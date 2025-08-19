# 🎮 MedalM - Aplicativo de Gravação e Compartilhamento de Gameplay

Um aplicativo completo para gravação, edição e compartilhamento de vídeos de gameplay, inspirado no Medal.tv.

## ✨ Funcionalidades

### 🎥 Gravação e Upload
- **Gravação de tela** com configurações personalizáveis
- **Gravação de áudio** do sistema e microfone
- **Upload de vídeos** com suporte a múltiplos formatos
- **Geração automática de thumbnails**
- **Processamento de vídeo** com FFmpeg

### ✂️ Editor de Vídeo
- **Corte e edição** de vídeos
- **Adição de efeitos** e transições
- **Sistema de tags** e categorias
- **Descrições** e metadados personalizáveis

### 👥 Rede Social
- **Perfis de usuário** personalizáveis
- **Sistema de inscrições** e seguidores
- **Likes, comentários** e compartilhamentos
- **Feed personalizado** baseado em interesses
- **Sistema de busca** avançado

### 🔐 Autenticação e Segurança
- **Registro e login** de usuários
- **Autenticação JWT** segura
- **Perfis privados** e públicos
- **Controle de acesso** baseado em roles

### 📱 Interface Moderna
- **Design responsivo** para todos os dispositivos
- **Tema escuro** otimizado para gamers
- **Animações suaves** com Framer Motion
- **Componentes reutilizáveis** com Tailwind CSS

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com Express.js
- **MongoDB** com Mongoose
- **Socket.io** para comunicação em tempo real
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **FFmpeg** para processamento de vídeo

### Frontend
- **React 18** com hooks modernos
- **React Router** para navegação
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **React Query** para gerenciamento de estado
- **Axios** para requisições HTTP

## 📋 Pré-requisitos

- **Node.js** 16+ 
- **MongoDB** 5+
- **FFmpeg** instalado no sistema
- **Git** para clonar o repositório

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/medalm.git
cd medalm
```

### 2. Instale as dependências
```bash
# Instalar dependências do projeto principal
npm run install-all

# Ou instalar manualmente:
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Configure as variáveis de ambiente
```bash
# No diretório server/
cp env.example .env

# Edite o arquivo .env com suas configurações:
MONGODB_URI=mongodb://localhost:27017/medalm
JWT_SECRET=sua-chave-secreta-super-segura
PORT=5000
```

### 4. Inicie o MongoDB
```bash
# Se estiver usando MongoDB local
mongod

# Ou use MongoDB Atlas (nuvem)
```

### 5. Execute o aplicativo
```bash
# Desenvolvimento (ambos frontend e backend)
npm run dev

# Ou execute separadamente:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

## 🌐 Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Documentação da API**: http://localhost:5000/api/docs

## 📁 Estrutura do Projeto

```
medalm/
├── server/                 # Backend Node.js
│   ├── config/            # Configurações
│   ├── middleware/        # Middlewares
│   ├── models/            # Modelos MongoDB
│   ├── routes/            # Rotas da API
│   ├── uploads/           # Arquivos enviados
│   ├── videos/            # Vídeos processados
│   └── index.js           # Servidor principal
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Hooks customizados
│   │   ├── context/       # Contextos React
│   │   ├── api/           # Serviços de API
│   │   └── utils/         # Utilitários
│   └── public/            # Arquivos estáticos
├── package.json           # Dependências principais
└── README.md              # Este arquivo
```

## 🔧 Configurações

### Configurações de Gravação
- **Qualidade**: Low, Medium, High, Ultra
- **FPS**: 30, 60, 120
- **Resolução**: 720p, 1080p, 1440p, 4K
- **Bitrate**: Configurável
- **Áudio**: Sistema e/ou microfone

### Configurações de Upload
- **Formatos suportados**: MP4, AVI, MOV, MKV, WMV, FLV, WebM
- **Tamanho máximo**: 500MB por arquivo
- **Thumbnails**: JPG, PNG, GIF, WebP (máx. 10MB)

## 🎯 Funcionalidades em Destaque

### Gravação Inteligente
- **Detecção automática** de jogos
- **Início/parada** com atalhos de teclado
- **Pausa/retomada** durante a gravação
- **Captura de screenshots** em tempo real

### Editor Avançado
- **Timeline visual** para edição
- **Corte preciso** frame por frame
- **Efeitos de transição** suaves
- **Exportação** em múltiplos formatos

### Rede Social Gamificada
- **Sistema de conquistas** para criadores
- **Rankings** por categoria de jogo
- **Eventos e desafios** semanais
- **Integração** com plataformas de streaming

## 🚧 Funcionalidades Futuras

- [ ] **Streaming ao vivo** integrado
- [ ] **Editor colaborativo** em tempo real
- [ ] **IA para detecção** de momentos épicos
- [ ] **Integração** com Discord e Twitch
- [ ] **App mobile** nativo
- [ ] **Sistema de monetização** para criadores

## 🤝 Contribuição

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- **Medal.tv** pela inspiração
- **Comunidade React** pelos componentes
- **Tailwind CSS** pelo design system
- **FFmpeg** pelo processamento de vídeo

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

- 📧 **Email**: seu-email@exemplo.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/medalm/issues)
- 💬 **Discord**: [Link do servidor](https://discord.gg/seu-servidor)

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!**
