# 🚀 Instalação Rápida - Backend Dahora Roots

## ⚡ Instalação em 5 minutos

### 1. Pré-requisitos
- Node.js 16+ instalado
- MySQL 8.0+ instalado
- Git instalado

### 2. Clone e Instale
```bash
# Clone o repositório
git clone <repository-url>
cd backend-confeitaria

# Instale dependências
npm install
```

### 3. Configure o Banco
```bash
# Crie o banco de dados
mysql -u root -p
CREATE DATABASE confeitaria_db;
exit
```

### 4. Configure as Variáveis
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

**Configuração mínima do .env:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=confeitaria_db
JWT_SECRET=seu_jwt_secret_super_seguro
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

### 5. Execute as Migrações
```bash
# Cria as tabelas
npm run migrate

# Popula com dados de exemplo
npm run seed
```

### 6. Inicie o Servidor
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## ✅ Verificação

Acesse:
- **API**: http://localhost:3000
- **Documentação**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 👤 Usuários de Teste

Após executar o seed, você terá:

**Administrador:**
- Email: `admin@dahoraroots.com`
- Senha: `admin123`

**Cliente:**
- Email: `cliente@exemplo.com`
- Senha: `cliente123`

## 🎫 Cupons de Teste

- `BEMVINDO10` - 10% OFF para novos clientes
- `FRETE15` - Frete grátis acima de R$ 150
- `DESCONTO20` - 20% OFF com limite de R$ 50

## 🐳 Docker (Alternativa)

Se preferir usar Docker:

```bash
# Inicia todos os serviços
docker-compose up -d

# Verifica logs
docker-compose logs -f app
```

## 🔧 Comandos Úteis

```bash
# Executar testes
npm test

# Verificar código
npm run lint

# Formatar código
npm run format

# Gerar documentação
npm run docs
```

## 🆘 Problemas Comuns

### Erro de conexão com MySQL
- Verifique se o MySQL está rodando
- Confirme as credenciais no .env
- Teste a conexão: `mysql -u root -p`

### Erro de porta em uso
- Mude a porta no .env: `PORT=3001`
- Ou mate o processo: `lsof -ti:3000 | xargs kill`

### Erro de permissão
- No Linux/Mac: `sudo npm install`
- No Windows: Execute como administrador

## 📞 Suporte

- **Email**: contato@dahoraroots.com
- **Documentação**: http://localhost:3000/api-docs
- **Issues**: GitHub Issues

---

**🎉 Pronto! Seu backend está funcionando!**