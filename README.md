# 🌿 Dahora Roots - E-commerce de Tabacaria

Uma loja online moderna e elegante para produtos de tabacaria, desenvolvida com React, TypeScript e backend Node.js com SQLite.

## ✨ Funcionalidades Implementadas

### 🛒 Sistema de Carrinho
- ✅ Adicionar/remover produtos
- ✅ Atualizar quantidades
- ✅ Persistência no localStorage
- ✅ Sidebar de carrinho
- ✅ Página dedicada do carrinho
- ✅ Cálculo automático de totais e frete

### 🔐 Sistema de Autenticação
- ✅ Login e registro de usuários
- ✅ Autenticação JWT
- ✅ Proteção de rotas
- ✅ Perfil do usuário
- ✅ Logout seguro

### 🎨 Interface e UX
- ✅ Design responsivo e moderno
- ✅ Glassmorphism e efeitos visuais
- ✅ Paleta de cores consistente
- ✅ Tipografia diversificada
- ✅ Animações suaves
- ✅ Componentes reutilizáveis

### 🛍️ E-commerce
- ✅ Catálogo de produtos
- ✅ Filtros e busca
- ✅ Página de checkout
- ✅ Sistema de pedidos
- ✅ Categorias organizadas

### 🗄️ Backend e Banco de Dados
- ✅ API REST com Express.js
- ✅ Banco SQLite para desenvolvimento
- ✅ Autenticação JWT
- ✅ CRUD completo de produtos
- ✅ Sistema de carrinho persistente
- ✅ Gestão de pedidos

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Instalar Dependências do Frontend
```bash
cd /workspace
npm install
```

### 2. Instalar Dependências do Backend
```bash
cd /workspace/backend
npm install
```

### 3. Inicializar o Banco de Dados
```bash
cd /workspace/backend
npm run init-db
```

### 4. Executar o Backend
```bash
cd /workspace/backend
npm run dev
```
O backend estará rodando em: http://localhost:3001

### 5. Executar o Frontend
```bash
cd /workspace
npm run dev
```
O frontend estará rodando em: http://localhost:5173

## 📁 Estrutura do Projeto

```
/workspace
├── src/
│   ├── components/          # Componentes React
│   │   ├── cart/           # Componentes do carrinho
│   │   ├── layout/         # Header, Footer
│   │   ├── sections/       # Seções da página inicial
│   │   └── ui/             # Componentes de UI
│   ├── contexts/           # Contextos React (Cart, Auth)
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Hooks customizados
│   └── lib/                # Utilitários
├── backend/
│   ├── server.js           # Servidor Express
│   ├── database.sql        # Schema do banco
│   ├── database.db         # Banco SQLite (gerado)
│   └── package.json        # Dependências do backend
└── public/                 # Arquivos estáticos
```

## 🎯 Funcionalidades Principais

### Carrinho de Compras
- **Adicionar produtos**: Clique no botão "Adicionar" em qualquer produto
- **Visualizar carrinho**: Clique no ícone do carrinho no header
- **Gerenciar quantidades**: Use os botões +/- no carrinho
- **Remover itens**: Botão de lixeira ou quantidade zero
- **Persistência**: Carrinho salvo no localStorage

### Autenticação
- **Registro**: Página `/register` para criar nova conta
- **Login**: Página `/login` para acessar conta existente
- **Perfil**: Página `/account` para gerenciar dados
- **Proteção**: Rotas protegidas automaticamente

### Produtos
- **Catálogo**: Página `/products` com todos os produtos
- **Categorias**: Filtros por categoria
- **Busca**: Campo de busca no header
- **Detalhes**: Informações completas de cada produto

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **Lucide React** - Ícones
- **Radix UI** - Componentes acessíveis

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **CORS** - Cross-origin requests

## 🎨 Design System

### Cores
- **Pine**: `#016A6D` - Cor primária
- **Sunset Orange**: `#E16A3D` - Cor secundária
- **Tangerine**: `#FFA45D` - Cor de destaque
- **Nile Blue**: `#043E52` - Cor escura
- **Light BG**: `#F8F8F8` - Fundo claro

### Tipografia
- **Graffiti**: Títulos principais
- **Playfair**: Títulos elegantes
- **Urban**: Texto corrido
- **Block**: Botões e elementos destacados

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🔧 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linter
```

### Backend
```bash
npm start            # Servidor em produção
npm run dev          # Servidor com nodemon
npm run init-db      # Inicializar banco de dados
```

## 🚀 Próximos Passos

### Funcionalidades Planejadas
- [ ] Sistema de avaliações
- [ ] Wishlist/Favoritos
- [ ] Programa de fidelidade
- [ ] Chat de suporte
- [ ] Blog integrado
- [ ] Sistema de cupons
- [ ] Relatórios de vendas
- [ ] Dashboard administrativo

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Migração para PostgreSQL
- [ ] Cache Redis
- [ ] CDN para imagens
- [ ] PWA features

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato:
- 📧 Email: contato@dahoraroots.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: www.dahoraroots.com

---

**Dahora Roots** - Sua loja premium de acessórios para cannabis e lifestyle 🌿✨