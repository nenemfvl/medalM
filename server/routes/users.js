const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const router = express.Router();

// Buscar perfil do usuário atual
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('subscribers', 'username avatar')
      .populate('subscribedTo', 'username avatar');

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar perfil do usuário
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, bio, avatar, socialLinks, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Verificar se o username já existe (se foi alterado)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username já existe' });
      }
    }
    
    // Atualizar campos
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('subscribers', 'username avatar')
      .populate('subscribedTo', 'username avatar');
    
    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Alterar senha
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Verificar senha atual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }
    
    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar perfil público de outro usuário
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password -email -preferences')
      .populate('subscribers', 'username avatar')
      .populate('subscribedTo', 'username avatar');
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Buscar vídeos do usuário
    const videos = await Video.find({ user: user._id, isPublic: true })
      .select('title thumbnailUrl duration views likes createdAt')
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.json({
      user,
      recentVideos: videos
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Inscrever/Desinscrever de um usuário
router.post('/:userId/subscribe', auth, async (req, res) => {
  try {
    if (req.params.userId === req.user.id) {
      return res.status(400).json({ error: 'Não é possível se inscrever em si mesmo' });
    }
    
    const userToSubscribe = await User.findById(req.params.userId);
    if (!userToSubscribe) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const currentUser = await User.findById(req.user.id);
    
    const isSubscribed = currentUser.subscribedTo.includes(req.params.userId);
    
    if (isSubscribed) {
      // Desinscrever
      currentUser.subscribedTo = currentUser.subscribedTo.filter(
        id => id.toString() !== req.params.userId
      );
      userToSubscribe.subscribers = userToSubscribe.subscribers.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      // Inscrever
      currentUser.subscribedTo.push(req.params.userId);
      userToSubscribe.subscribers.push(req.user.id);
    }
    
    await Promise.all([currentUser.save(), userToSubscribe.save()]);
    
    res.json({
      message: isSubscribed ? 'Desinscrito com sucesso' : 'Inscrito com sucesso',
      isSubscribed: !isSubscribed
    });
  } catch (error) {
    console.error('Erro ao inscrever/desinscrever:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar usuários inscritos
router.get('/:userId/subscribers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'subscribers',
        select: 'username avatar bio totalViews totalLikes',
        options: {
          limit,
          skip: (page - 1) * limit
        }
      });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const total = user.subscribers.length;
    
    res.json({
      subscribers: user.subscribers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSubscribers: total
    });
  } catch (error) {
    console.error('Erro ao buscar inscritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar usuários que o usuário está inscrito
router.get('/:userId/subscriptions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'subscribedTo',
        select: 'username avatar bio totalViews totalLikes',
        options: {
          limit,
          skip: (page - 1) * limit
        }
      });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    const total = user.subscribedTo.length;
    
    res.json({
      subscriptions: user.subscribedTo,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSubscriptions: total
    });
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar usuários (para busca)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    })
    .select('username avatar bio totalViews totalLikes')
    .limit(limit)
    .skip((page - 1) * limit);
    
    const total = await User.countDocuments({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    console.error('Erro na busca de usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar conta
router.delete('/account', auth, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória para deletar a conta' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }
    
    // Deletar todos os vídeos do usuário
    await Video.deleteMany({ user: req.user.id });
    
    // Remover usuário de todas as listas de inscritos
    await User.updateMany(
      { subscribers: req.user.id },
      { $pull: { subscribers: req.user.id } }
    );
    
    await User.updateMany(
      { subscribedTo: req.user.id },
      { $pull: { subscribedTo: req.user.id } }
    );
    
    // Deletar usuário
    await user.remove();
    
    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
