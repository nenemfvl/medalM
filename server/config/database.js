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
    console.log('📊 Conexão com banco estabelecida com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
