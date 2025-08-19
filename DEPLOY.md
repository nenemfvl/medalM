# 🚀 Deploy Online do MedalM

## 📋 Pré-requisitos
- Conta no [Render.com](https://render.com) (gratuito)
- Conta no [MongoDB Atlas](https://mongodb.com/atlas) (gratuito)

## 🔧 Passo a Passo

### 1. MongoDB Atlas (Banco de Dados)
1. Acesse [MongoDB Atlas](https://mongodb.com/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster (gratuito)
4. Crie um usuário de banco de dados
5. Obtenha a string de conexão

### 2. Render.com (Deploy)
1. Acesse [Render.com](https://render.com)
2. Faça login com GitHub
3. Clique em "New +" → "Web Service"
4. Conecte seu repositório GitHub

### 3. Configuração do Backend
- **Name**: `medalm-api`
- **Environment**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: `Free`

#### Variáveis de Ambiente:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=sua_string_mongodb_aqui
JWT_SECRET=medalm_super_secret_key_2024_production
CORS_ORIGIN=https://medalm-client.onrender.com
```

### 4. Configuração do Frontend
- **Name**: `medalm-client`
- **Environment**: `Static Site`
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/build`
- **Plan**: `Free`

#### Variáveis de Ambiente:
```
REACT_APP_API_URL=https://medalm-api.onrender.com/api
```

## 🌐 URLs Finais
- **Frontend**: https://medalm-client.onrender.com
- **Backend**: https://medalm-api.onrender.com
- **API**: https://medalm-api.onrender.com/api

## 📝 Notas Importantes
- O plano gratuito do Render pode ter algumas limitações
- O banco MongoDB Atlas gratuito tem limite de 512MB
- O deploy pode levar alguns minutos na primeira vez

## 🆘 Suporte
Se precisar de ajuda, verifique os logs no Render.com
