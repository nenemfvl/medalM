const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150/6366f1/ffffff?text=U'
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  subscribedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalViews: {
    type: Number,
    default: 0
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  socialLinks: {
    youtube: String,
    twitch: String,
    twitter: String,
    instagram: String,
    discord: String
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profilePublic: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true,
  autoIndex: false // Desabilita criação automática de índices
});

// Criar índices de forma segura para evitar conflitos
userSchema.on('index', function(error) {
  if (error) {
    console.log('⚠️  Aviso: Índice já existe:', error.message);
  }
});

// Método para obter estatísticas do usuário
userSchema.methods.getStats = function() {
  return {
    totalSubscribers: this.subscribers.length,
    totalSubscribed: this.subscribedTo.length,
    totalViews: this.totalViews,
    totalLikes: this.totalLikes
  };
};

// Método para verificar se um usuário está inscrito
userSchema.methods.isSubscribedTo = function(userId) {
  return this.subscribedTo.includes(userId);
};

module.exports = mongoose.model('User', userSchema);
