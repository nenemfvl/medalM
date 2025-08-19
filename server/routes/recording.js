const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Configurações de gravação do usuário
router.get('/settings', auth, async (req, res) => {
  try {
    // Buscar configurações de gravação do usuário
    const user = await User.findById(req.user.id).select('recordingSettings');
    
    res.json({
      settings: user.recordingSettings || {
        quality: 'high',
        audioEnabled: true,
        microphoneEnabled: false,
        fps: 60,
        resolution: '1080p',
        bitrate: '8000k'
      }
    });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar configurações de gravação
router.put('/settings', auth, async (req, res) => {
  try {
    const { quality, audioEnabled, microphoneEnabled, fps, resolution, bitrate } = req.body;
    
    const user = await User.findById(req.user.id);
    
    user.recordingSettings = {
      quality: quality || user.recordingSettings?.quality || 'high',
      audioEnabled: audioEnabled !== undefined ? audioEnabled : user.recordingSettings?.audioEnabled || true,
      microphoneEnabled: microphoneEnabled !== undefined ? microphoneEnabled : user.recordingSettings?.microphoneEnabled || false,
      fps: fps || user.recordingSettings?.fps || 60,
      resolution: resolution || user.recordingSettings?.resolution || '1080p',
      bitrate: bitrate || user.recordingSettings?.bitrate || '8000k'
    };
    
    await user.save();
    
    res.json({
      message: 'Configurações atualizadas com sucesso',
      settings: user.recordingSettings
    });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Iniciar gravação
router.post('/start', auth, async (req, res) => {
  try {
    const { gameName, platform, server } = req.body;
    
    // Criar sessão de gravação
    const recordingSession = {
      userId: req.user.id,
      gameInfo: {
        gameName: gameName || 'Unknown Game',
        platform: platform || 'PC',
        server: server || ''
      },
      startTime: new Date(),
      status: 'recording',
      settings: req.user.recordingSettings
    };
    
    // Aqui você implementaria a lógica real de gravação
    // Por enquanto, apenas simulamos o início
    
    res.json({
      message: 'Gravação iniciada',
      sessionId: Date.now().toString(),
      session: recordingSession
    });
  } catch (error) {
    console.error('Erro ao iniciar gravação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Parar gravação
router.post('/stop', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    // Aqui você implementaria a lógica real de parada da gravação
    // Por enquanto, apenas simulamos o fim
    
    res.json({
      message: 'Gravação parada com sucesso',
      sessionId,
      duration: Math.floor(Math.random() * 300) + 30, // Simular duração
      fileSize: Math.floor(Math.random() * 100) + 10 // Simular tamanho do arquivo
    });
  } catch (error) {
    console.error('Erro ao parar gravação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Pausar/Retomar gravação
router.post('/pause', auth, async (req, res) => {
  try {
    const { sessionId, action } = req.body; // 'pause' ou 'resume'
    
    res.json({
      message: `Gravação ${action === 'pause' ? 'pausada' : 'retomada'} com sucesso`,
      sessionId,
      action
    });
  } catch (error) {
    console.error('Erro ao pausar/retomar gravação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Capturar screenshot
router.post('/screenshot', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    // Simular captura de screenshot
    const screenshotData = {
      sessionId,
      timestamp: new Date(),
      filename: `screenshot-${Date.now()}.png`,
      url: `/uploads/screenshots/screenshot-${Date.now()}.png`
    };
    
    res.json({
      message: 'Screenshot capturado com sucesso',
      screenshot: screenshotData
    });
  } catch (error) {
    console.error('Erro ao capturar screenshot:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Histórico de gravações
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Buscar vídeos do usuário
    const videos = await Video.find({ user: req.user.id })
      .select('title thumbnailUrl duration createdAt views likes')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await Video.countDocuments({ user: req.user.id });
    
    res.json({
      recordings: videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecordings: total
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas de gravação
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const totalVideos = await Video.countDocuments({ user: req.user.id });
    const totalViews = await Video.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]).then(result => result[0]?.total || 0);
    
    const totalLikes = await Video.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: null, total: { $sum: { $size: '$likes' } } } }
    ]).then(result => result[0]?.total || 0);
    
    res.json({
      totalRecordings: totalVideos,
      totalViews,
      totalLikes,
      totalSubscribers: user.subscribers.length,
      averageViews: totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
