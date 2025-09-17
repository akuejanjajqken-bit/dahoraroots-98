# 🍰 Backend Dahora Roots Confeitaria

Backend completo para e-commerce de doces e confeitaria desenvolvido com Node.js, Express e MySQL.

## 🎨 Paleta de Cores

- **Primary**: #E16A3D (Sunset Orange)
- **Secondary**: #FEA450 (Tangerine)
- **Accent**: #016A6D (Pine)
- **Dark**: #043E52 (Nile Blue)

## 🚀 Funcionalidades

### ✅ Implementadas

- **Sistema de Autenticação JWT**
  - Registro e login de usuários
  - Refresh tokens
  - Redefinição de senha
  - Perfil do usuário

- **Gestão de Produtos**
  - CRUD completo de produtos
  - Categorias organizadas
  - Sistema de busca full-text
  - Produtos em destaque
  - Controle de estoque

- **Carrinho de Compras**
  - Adicionar/remover itens
  - Atualizar quantidades
  - Validação de disponibilidade
  - Cálculo automático de totais

- **Sistema de Pedidos**
  - Criação de pedidos
  - Controle de status
  - Cálculo de frete
  - Notificações por email

- **Sistema de Email**
  - Templates responsivos
  - Confirmação de pedidos
  - Notificações de status
  - Emails transacionais

- **Segurança**
  - Rate limiting
  - CORS configurado
  - Headers de segurança
  - Validação de dados
  - Sanitização de inputs

- **Documentação**
  - Swagger UI customizado
  - Temas com cores da marca
  - Documentação interativa

## 📋 Pré-requisitos

- Node.js >= 16.0.0
- MySQL >= 8.0
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd backend-confeitaria
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=confeitaria_db
DB_PORT=3306

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# App
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

4. **Configure o banco de dados**
```bash
# Crie o banco de dados
mysql -u root -p
CREATE DATABASE confeitaria_db;
```

5. **Execute as migrações**
```bash
npm run migrate
```

6. **Popule o banco com dados de exemplo**
```bash
npm run seed
```

7. **Inicie o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 Documentação da API

Acesse a documentação interativa em:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Principais Endpoints

#### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/profile` - Obter perfil

#### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:slug` - Obter produto por slug
- `GET /api/products/search` - Buscar produtos
- `GET /api/products/featured` - Produtos em destaque

#### Carrinho
- `GET /api/cart` - Obter carrinho
- `POST /api/cart/add` - Adicionar item
- `PUT /api/cart/update/:id` - Atualizar item
- `DELETE /api/cart/remove/:id` - Remover item

#### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders/create` - Criar pedido
- `GET /api/orders/:id` - Obter pedido

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **usuarios** - Dados dos usuários
- **categorias** - Categorias de produtos
- **produtos** - Produtos da confeitaria
- **pedidos** - Pedidos dos clientes
- **itens_pedido** - Itens de cada pedido
- **enderecos** - Endereços dos usuários
- **carrinho** - Carrinho de compras
- **avaliacoes** - Avaliações dos produtos
- **cupons** - Cupons de desconto
- **usuario_cupons** - Uso de cupons

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## 📁 Estrutura do Projeto

```
src/
├── config/           # Configurações
│   ├── database.js   # Configuração do banco
│   ├── cors.js       # Configuração CORS
│   └── swagger.js    # Configuração Swagger
├── controllers/      # Controllers da API
│   ├── authController.js
│   ├── produtoController.js
│   ├── carrinhoController.js
│   └── pedidoController.js
├── middleware/       # Middlewares
│   ├── auth.js       # Autenticação
│   ├── validation.js # Validação
│   └── errorHandler.js
├── models/          # Modelos do banco
│   ├── Usuario.js
│   ├── Produto.js
│   ├── Pedido.js
│   └── index.js
├── services/        # Serviços
│   └── emailService.js
├── routes/          # Rotas (se necessário)
└── server.js        # Arquivo principal
```

## 🔧 Scripts Disponíveis

```bash
npm start          # Inicia o servidor
npm run dev        # Inicia em modo desenvolvimento
npm test           # Executa testes
npm run migrate    # Executa migrações
npm run seed       # Popula banco com dados
npm run docs       # Gera documentação
```

## 🌐 Variáveis de Ambiente

### Obrigatórias
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`

### Opcionais
- `PORT` (padrão: 3000)
- `NODE_ENV` (padrão: development)
- `API_URL`, `FRONTEND_URL`
- `COLOR_PRIMARY`, `COLOR_SECONDARY`, etc.

## 🔒 Segurança

- ✅ Rate limiting implementado
- ✅ CORS configurado
- ✅ Headers de segurança (Helmet)
- ✅ Validação de dados com Joi
- ✅ Sanitização de inputs
- ✅ JWT com refresh tokens
- ✅ Criptografia de senhas (bcrypt)

## 📧 Sistema de Email

O sistema inclui templates responsivos para:
- Boas-vindas
- Confirmação de pedidos
- Atualizações de status
- Redefinição de senha
- Cancelamentos

## 🚀 Deploy

### Docker (Recomendado)

```bash
# Build da imagem
docker build -t confeitaria-backend .

# Executar container
docker run -p 3000:3000 --env-file .env confeitaria-backend
```

### Deploy Manual

1. Configure o servidor de produção
2. Instale Node.js e MySQL
3. Clone o repositório
4. Configure as variáveis de ambiente
5. Execute `npm install --production`
6. Execute as migrações
7. Inicie com `npm start`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: contato@dahoraroots.com
- **Documentação**: http://localhost:3000/api-docs
- **Issues**: Use o sistema de issues do GitHub

## 🎯 Próximas Funcionalidades

- [ ] Sistema de cupons de desconto
- [ ] Integração com gateway de pagamento
- [ ] Sistema de avaliações
- [ ] Dashboard administrativo
- [ ] Relatórios de vendas
- [ ] Integração com Correios
- [ ] Notificações push
- [ ] Sistema de wishlist
- [ ] Programa de fidelidade

---

**🍰 Desenvolvido com carinho para a Dahora Roots Confeitaria**