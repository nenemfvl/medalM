const express = require('express');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const router = express.Router();

// Buscar todos os vídeos (com paginação)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const videos = await Video.find(query)
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Video.countDocuments(query);

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar vídeo por ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('user', 'username avatar subscribers')
      .populate('comments.user', 'username avatar');

    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Incrementar visualizações
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo vídeo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, tags, videoUrl, thumbnailUrl, duration } = req.body;

    const video = new Video({
      title,
      description,
      category,
      tags: tags || [],
      videoUrl,
      thumbnailUrl,
      duration,
      user: req.user.id
    });

    await video.save();
    
    const populatedVideo = await Video.findById(video._id)
      .populate('user', 'username avatar');

    res.status(201).json(populatedVideo);
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar vídeo
router.put('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Verificar se o usuário é o dono do vídeo
    if (video.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const { title, description, category, tags } = req.body;
    
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags || video.tags;

    await video.save();
    
    const updatedVideo = await Video.findById(video._id)
      .populate('user', 'username avatar');

    res.json(updatedVideo);
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar vídeo
router.delete('/:id', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Verificar se o usuário é o dono do vídeo
    if (video.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    await video.remove();
    res.json({ message: 'Vídeo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Like/Unlike vídeo
router.post('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const likeIndex = video.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // Unlike
      video.likes.splice(likeIndex, 1);
    } else {
      // Like
      video.likes.push(req.user.id);
    }

    await video.save();
    res.json({ likes: video.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    console.error('Erro ao dar like:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Adicionar comentário
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    video.comments.push({
      user: req.user.id,
      text,
      createdAt: new Date()
    });

    await video.save();
    
    const populatedVideo = await Video.findById(video._id)
      .populate('comments.user', 'username avatar');

    res.json(populatedVideo.comments[populatedVideo.comments.length - 1]);
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar vídeos por usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const videos = await Video.find({ user: req.params.userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    console.error('Erro ao buscar vídeos do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
