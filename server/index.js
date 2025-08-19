const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite por IP
});
app.use(limiter);

// Middleware para parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/recording', require('./routes/recording'));

// Socket.io para tempo real
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MedalM Server funcionando!' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

const PORT = process.env.PORT || 5000;

// Conectar com o banco de dados
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor MedalM rodando na porta ${PORT}`);
    console.log(`📱 Cliente: http://localhost:3000`);
    console.log(`🔧 API: http://localhost:${PORT}/api`);
    console.log(`🗄️  Banco: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/medalm'}`);
  });
});
