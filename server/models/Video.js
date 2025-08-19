const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // duração em segundos
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Action',
      'Adventure',
      'RPG',
      'Strategy',
      'Sports',
      'Racing',
      'Fighting',
      'Puzzle',
      'Simulation',
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  isPublic: {
    type: Boolean,
    default: true
  },
  isProcessed: {
    type: Boolean,
    default: false
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  metadata: {
    resolution: String,
    fps: Number,
    bitrate: Number,
    codec: String,
    fileSize: Number
  },
  gameInfo: {
    gameName: String,
    platform: String,
    server: String
  },
  recordingSettings: {
    quality: {
      type: String,
      enum: ['low', 'medium', 'high', 'ultra'],
      default: 'high'
    },
    audioEnabled: {
      type: Boolean,
      default: true
    },
    microphoneEnabled: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Índices para melhor performance
videoSchema.index({ user: 1, createdAt: -1 });
videoSchema.index({ category: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ views: -1 });
videoSchema.index({ likes: -1 });
videoSchema.index({ createdAt: -1 });

// Método para obter estatísticas do vídeo
videoSchema.methods.getStats = function() {
  return {
    totalViews: this.views,
    totalLikes: this.likes.length,
    totalDislikes: this.dislikes.length,
    totalComments: this.comments.length,
    likeRatio: this.likes.length / (this.likes.length + this.dislikes.length) || 0
  };
};

// Método para verificar se um usuário deu like
videoSchema.methods.hasUserLiked = function(userId) {
  return this.likes.includes(userId);
};

// Método para verificar se um usuário deu dislike
videoSchema.methods.hasUserDisliked = function(userId) {
  return this.dislikes.includes(userId);
};

// Middleware para atualizar estatísticas do usuário
videoSchema.post('save', async function(doc) {
  if (doc.isModified('views') || doc.isModified('likes')) {
    const User = mongoose.model('User');
    const user = await User.findById(doc.user);
    
    if (user) {
      user.totalViews = await mongoose.model('Video').aggregate([
        { $match: { user: doc.user } },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]).then(result => result[0]?.total || 0);
      
      user.totalLikes = await mongoose.model('Video').aggregate([
        { $match: { user: doc.user } },
        { $group: { _id: null, total: { $sum: { $size: '$likes' } } } }
      ]).then(result => result[0]?.total || 0);
      
      await user.save();
    }
  }
});

module.exports = mongoose.model('Video', videoSchema);
