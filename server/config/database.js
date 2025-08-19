const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/medalm',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`🗄️  MongoDB conectado: ${conn.connection.host}`);
    
    // Criar índices para melhor performance
    await mongoose.connection.db.collection('users').createIndex({ username: 1 });
    await mongoose.connection.db.collection('users').createIndex({ email: 1 });
    await mongoose.connection.db.collection('videos').createIndex({ user: 1, createdAt: -1 });
    await mongoose.connection.db.collection('videos').createIndex({ category: 1, createdAt: -1 });
    await mongoose.connection.db.collection('videos').createIndex({ tags: 1 });
    await mongoose.connection.db.collection('videos').createIndex({ views: -1 });
    await mongoose.connection.db.collection('videos').createIndex({ likes: -1 });
    
    console.log('📊 Índices do banco criados com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
