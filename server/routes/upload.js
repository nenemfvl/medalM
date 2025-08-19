const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const router = express.Router();

// Configuração do Multer para upload de vídeos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuração do Multer para upload de thumbnails
const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/thumbnails');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumb-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtros de arquivo
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|mkv|wmv|flv|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de vídeo são permitidos!'));
  }
};

const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'));
  }
};

// Configurações do Multer
const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  }
});

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Upload de vídeo
router.post('/video', auth, uploadVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const videoPath = `/videos/${req.file.filename}`;
    const fileSize = req.file.size;

    res.json({
      message: 'Vídeo enviado com sucesso',
      videoPath,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Erro no upload do vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Upload de thumbnail
router.post('/thumbnail', auth, uploadThumbnail.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const thumbnailPath = `/uploads/thumbnails/${req.file.filename}`;

    res.json({
      message: 'Thumbnail enviado com sucesso',
      thumbnailPath,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Erro no upload da thumbnail:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Upload múltiplo de arquivos
router.post('/multiple', auth, uploadVideo.array('videos', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      videoPath: `/videos/${file.filename}`,
      fileSize: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      message: `${uploadedFiles.length} vídeos enviados com sucesso`,
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar arquivo
router.delete('/:filename', auth, async (req, res) => {
  try {
    const { filename } = req.params;
    const { type } = req.query; // 'video' ou 'thumbnail'

    let filePath;
    if (type === 'video') {
      filePath = path.join(__dirname, '../videos', filename);
    } else {
      filePath = path.join(__dirname, '../uploads/thumbnails', filename);
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Arquivo deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware de tratamento de erro do Multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Muitos arquivos' });
    }
  }
  
  if (error.message) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

module.exports = router;
