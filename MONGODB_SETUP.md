# 🗄️ Configuração MongoDB Atlas

## 📋 Passo a Passo Detalhado

### 1. Criar Conta MongoDB Atlas
1. Acesse: https://mongodb.com/atlas
2. Clique em "Try Free"
3. Preencha seus dados e crie a conta

### 2. Criar Cluster
1. Escolha "FREE" (M0)
2. Selecione o provedor (AWS, Google Cloud, Azure)
3. Escolha a região mais próxima (ex: São Paulo)
4. Clique em "Create"

### 3. Configurar Segurança
1. **Database Access**:
   - Clique em "Database Access"
   - "Add New Database User"
   - Username: `medalm`
   - Password: `medalm123` (ou outro seguro)
   - Role: "Read and write to any database"
   - Clique em "Add User"

2. **Network Access**:
   - Clique em "Network Access"
   - "Add IP Address"
   - Clique em "Allow Access from Anywhere" (0.0.0.0/0)
   - Clique em "Confirm"

### 4. Obter String de Conexão
1. Clique em "Connect"
2. Escolha "Connect your application"
3. Copie a string de conexão
4. Substitua `<password>` pela senha do usuário

**String final deve ficar assim:**
```
mongodb+srv://medalm:medalm123@cluster0.xxxxx.mongodb.net/medalm?retryWrites=true&w=majority
```

### 5. Usar no Render.com
1. No seu serviço backend no Render
2. Vá em "Environment"
3. Adicione a variável:
   - Key: `MONGODB_URI`
   - Value: `sua_string_aqui`

## ✅ Pronto!
Agora seu banco de dados estará online e funcionando!
