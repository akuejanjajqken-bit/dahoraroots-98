# 🎛️ Painel Administrativo - Dahora Roots

## 📋 **Visão Geral**

Painel administrativo completo para gerenciamento da loja de confeitaria, desenvolvido com React, Vite e Tailwind CSS.

## 🎨 **Design System**

### **Paleta de Cores:**
- **Primary:** #E16A3D (Sunset Orange)
- **Secondary:** #FEA450 (Tangerine)  
- **Accent:** #016A6D (Pine)
- **Dark:** #043E52 (Nile Blue)
- **Light:** #FFF9F5 (Light Background)
- **Success:** #22C55E
- **Warning:** #FEA450
- **Danger:** #EF4444

## 🚀 **Instalação e Execução**

### **Pré-requisitos:**
- Node.js 18+
- npm ou yarn
- Backend rodando na porta 3000

### **Instalação:**
```bash
cd src/admin
npm install
```

### **Desenvolvimento:**
```bash
npm run dev
```

### **Build:**
```bash
npm run build
```

### **Preview:**
```bash
npm run preview
```

## 🔐 **Acesso**

### **URL:**
```
http://localhost:3001/admin/login
```

### **Credenciais:**
- **Email:** `arrkkhecorp@gmail.com`
- **Senha:** `Dahoraroots2025*`

## 📱 **Funcionalidades**

### **Dashboard:**
- 📊 Estatísticas de vendas
- 📈 Gráficos de performance
- 🎯 Métricas de conversão
- 📋 Pedidos recentes

### **Produtos:**
- ➕ Adicionar/editar produtos
- 🖼️ Upload de imagens
- 📦 Controle de estoque
- 🏷️ Gerenciamento de categorias
- 🔄 Variações de produtos

### **Cupons:**
- 🎫 Criar cupons de desconto
- 📊 Relatórios de uso
- ⏰ Controle de validade
- 🎯 Segmentação de clientes

### **Pedidos:**
- 📋 Lista de pedidos
- 🔄 Atualização de status
- 📦 Controle de entrega
- 💰 Gestão de pagamentos

### **Clientes:**
- 👥 Lista de clientes
- 📊 Histórico de compras
- 💳 Dados de pagamento
- 📧 Comunicação

## 🏗️ **Estrutura do Projeto**

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Layout.jsx       # Layout principal
│   ├── ProtectedRoute.jsx # Rota protegida
│   └── FormProduto.jsx  # Formulário de produto
├── pages/               # Páginas do admin
│   ├── Login.jsx        # Página de login
│   ├── Dashboard.jsx    # Dashboard principal
│   ├── Produtos.jsx     # Gerenciamento de produtos
│   └── Cupons.jsx       # Gerenciamento de cupons
├── contexts/            # Context API
│   ├── AuthContext.jsx  # Contexto de autenticação
│   └── AdminContext.jsx # Contexto do admin
├── services/            # Serviços de API
│   └── api.js          # Configuração do Axios
├── utils/               # Utilitários
│   └── helpers.js      # Funções auxiliares
└── config/              # Configurações
    └── constants.js    # Constantes da aplicação
```

## 🔧 **Configuração**

### **Variáveis de Ambiente:**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Dahora Roots Admin
VITE_APP_VERSION=1.0.0
```

### **Proxy de Desenvolvimento:**
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

## 🎯 **Componentes Principais**

### **Layout:**
- Sidebar com navegação
- Header com informações do usuário
- Área de conteúdo principal
- Footer com informações

### **FormProduto:**
- Informações básicas
- Preços e estoque
- Upload de imagens
- Dimensões e peso
- Variações do produto

### **AuthContext:**
- Gerenciamento de autenticação
- Controle de permissões
- Persistência de token
- Logout automático

## 🛡️ **Segurança**

### **Autenticação:**
- JWT tokens
- Refresh tokens
- Logout automático
- Verificação de permissões

### **Permissões:**
- **Super Admin:** Acesso total
- **Admin:** Gerenciamento de produtos e pedidos
- **Moderator:** Apenas visualização

### **Validação:**
- Validação de formulários
- Sanitização de dados
- Proteção contra XSS
- Rate limiting

## 📊 **API Integration**

### **Endpoints Principais:**
```javascript
// Autenticação
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile

// Produtos
GET /api/products
POST /api/admin/products
PUT /api/admin/products/:id
DELETE /api/admin/products/:id

// Cupons
GET /api/admin/coupons
POST /api/admin/coupons
PUT /api/admin/coupons/:id
DELETE /api/admin/coupons/:id

// Dashboard
GET /api/admin/dashboard/stats
GET /api/admin/dashboard/charts
```

## 🎨 **Styling**

### **Tailwind CSS:**
- Configuração personalizada
- Cores do design system
- Componentes utilitários
- Responsividade

### **Classes Customizadas:**
```css
.gradient-primary    /* Gradiente primário */
.gradient-accent     /* Gradiente accent */
.btn-primary         /* Botão primário */
.btn-secondary       /* Botão secundário */
.card                /* Card padrão */
.table-header        /* Cabeçalho da tabela */
.badge-success       /* Badge de sucesso */
```

## 🚀 **Deploy**

### **Build para Produção:**
```bash
npm run build
```

### **Preview do Build:**
```bash
npm run preview
```

### **Deploy na Lovable:**
1. Faça push para o repositório
2. Acesse a Lovable
3. Clique em "Deploy"
4. Aguarde o build automático

## 🔍 **Debugging**

### **Logs de Desenvolvimento:**
```javascript
// Habilitar logs detalhados
localStorage.setItem('debug', 'true')
```

### **Ferramentas de Desenvolvimento:**
- React Developer Tools
- Redux DevTools (se aplicável)
- Network tab para debug de API

## 📱 **Responsividade**

### **Breakpoints:**
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### **Componentes Responsivos:**
- Sidebar colapsável
- Tabelas com scroll horizontal
- Formulários adaptativos
- Cards flexíveis

## 🧪 **Testes**

### **Executar Testes:**
```bash
npm run test
```

### **Cobertura:**
```bash
npm run test:coverage
```

## 📚 **Documentação**

### **Componentes:**
- JSDoc nos componentes principais
- Exemplos de uso
- Props e métodos documentados

### **API:**
- Swagger/OpenAPI
- Exemplos de requisições
- Códigos de erro

## 🐛 **Troubleshooting**

### **Problemas Comuns:**

1. **Erro de CORS:**
   - Verifique se o backend está rodando
   - Confirme a configuração do proxy

2. **Token Expirado:**
   - Faça logout e login novamente
   - Verifique a configuração do JWT

3. **Erro de Permissão:**
   - Confirme se o usuário é admin
   - Verifique as permissões no backend

## 🤝 **Contribuição**

### **Padrões de Código:**
- ESLint configurado
- Prettier para formatação
- Conventional commits
- Code review obrigatório

### **Estrutura de Commits:**
```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
style: formatação de código
refactor: refatoração
test: adicionar testes
```

## 📞 **Suporte**

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs do console
3. Teste em ambiente de desenvolvimento
4. Entre em contato com a equipe

---

**🎉 Painel administrativo pronto para uso!**

**Acesse `/admin/login` e comece a gerenciar sua loja.**