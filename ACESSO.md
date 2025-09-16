# 🌿 Dahora Roots - Como Acessar o Projeto

## ✅ Status dos Serviços

**Ambos os serviços estão rodando corretamente!**

### 🖥️ Frontend (Interface da Loja)
- **URL Local:** http://localhost:8080
- **URL Externa:** http://172.30.0.2:8080
- **Status:** ✅ Funcionando (Build de Produção)

### 🔧 Backend (API)
- **URL Local:** http://localhost:3001
- **URL Externa:** http://172.30.0.2:3001
- **Status:** ✅ Funcionando

## 🚀 Como Acessar

### Opção 1: Acesso Local (Recomendado)
Se você está no mesmo ambiente:
```
http://localhost:8080
```

### Opção 2: Acesso Externo
Se você está em outro ambiente:
```
http://172.30.0.2:8080
```

## 🛍️ O que Testar

### 1. Página Inicial
- Acesse a URL acima
- Você verá a página inicial com o design moderno da Dahora Roots
- Hero section com carousel de produtos
- Seções de produtos em destaque

### 2. Sistema de Carrinho
- Clique em "Adicionar ao Carrinho" em qualquer produto
- Clique no ícone do carrinho no header (canto superior direito)
- Teste adicionar/remover produtos
- Acesse `/cart` para ver a página completa do carrinho

### 3. Autenticação
- Clique no ícone de usuário no header
- Teste "Criar Conta" para registrar um novo usuário
- Faça login com as credenciais criadas
- Acesse "Minha Conta" para ver o perfil

### 4. Navegação
- `/products` - Catálogo completo
- `/cart` - Página do carrinho
- `/checkout` - Finalização de compra
- `/login` - Página de login
- `/register` - Página de registro
- `/account` - Perfil do usuário

## 🎯 Funcionalidades Implementadas

✅ **Sistema de Carrinho Completo**
- Adicionar/remover produtos
- Atualizar quantidades
- Persistência no localStorage
- Sidebar de carrinho
- Cálculo automático de totais

✅ **Sistema de Autenticação**
- Login e registro
- JWT tokens
- Proteção de rotas
- Perfil do usuário

✅ **Backend SQL**
- API REST completa
- Banco SQLite com dados de exemplo
- CRUD de produtos
- Sistema de pedidos

✅ **Design Moderno**
- Interface responsiva
- Glassmorphism
- Animações suaves
- Paleta de cores consistente

## 📊 Dados de Exemplo

O sistema já vem com:
- 8 produtos em diferentes categorias
- 12 categorias organizadas
- Sistema pronto para seus produtos reais

## 🔧 Comandos Úteis

### Verificar Status dos Serviços
```bash
# Frontend
curl http://localhost:5173

# Backend
curl http://localhost:3001/api/health
```

### Parar os Serviços
```bash
# Parar frontend
pkill -f vite

# Parar backend
pkill -f "node server.js"
```

### Reiniciar os Serviços
```bash
# Backend
cd /workspace/backend && npm run dev &

# Frontend
cd /workspace && npx vite --host 0.0.0.0 --port 5173 &
```

## 🆘 Solução de Problemas

### Se não conseguir acessar:
1. Verifique se os serviços estão rodando:
   ```bash
   ps aux | grep -E "(vite|node.*server)"
   ```

2. Teste a conectividade:
   ```bash
   curl http://localhost:5173
   curl http://localhost:3001/api/health
   ```

3. Se necessário, reinicie os serviços usando os comandos acima

---

**🎉 Seu projeto está funcionando perfeitamente!**

Acesse **http://localhost:8080** ou **http://172.30.0.2:8080** para começar a explorar sua loja online!