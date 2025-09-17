const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importa configurações
const { corsMiddleware, webhookCors } = require('./config/cors');
const { swaggerSpec, swaggerUiOptions } = require('./config/swagger');
const { testConnection, syncDatabase } = require('./config/database');

// Importa middlewares
const errorHandler = require('./middleware/errorHandler');

// Importa controllers
const AuthController = require('./controllers/authController');
const ProdutoController = require('./controllers/produtoController');
const CarrinhoController = require('./controllers/carrinhoController');
const PedidoController = require('./controllers/pedidoController');

// Importa validações
const {
  validate,
  registerSchema,
  loginSchema,
  produtoSchema,
  categoriaSchema,
  enderecoSchema,
  pedidoSchema,
  avaliacaoSchema,
  cupomSchema,
  queryParamsSchema
} = require('./middleware/validation');

// Importa middlewares de autenticação
const {
  authenticateToken,
  requireAdmin,
  optionalAuth,
  verifyRefreshToken
} = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middlewares de Segurança e Configuração
 */

// Helmet para headers de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS
app.use(corsMiddleware);

// Compressão de respostas
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests por IP
  message: {
    success: false,
    message: 'Muitas requisições deste IP. Tente novamente em alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Parser de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Documentação da API (Swagger)
 */
app.use('/api-docs', require('swagger-ui-express').serve);
app.get('/api-docs', require('swagger-ui-express').setup(swaggerSpec, swaggerUiOptions));

/**
 * Rotas de Health Check
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Dahora Roots Confeitaria',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health'
  });
});

/**
 * Rotas de Autenticação
 */
app.post('/api/auth/register', validate(registerSchema), AuthController.register);
app.post('/api/auth/login', validate(loginSchema), AuthController.login);
app.post('/api/auth/refresh', verifyRefreshToken, AuthController.refresh);
app.post('/api/auth/logout', authenticateToken, AuthController.logout);
app.post('/api/auth/forgot-password', AuthController.forgotPassword);
app.post('/api/auth/reset-password', AuthController.resetPassword);

// Rotas protegidas de autenticação
app.get('/api/auth/profile', authenticateToken, AuthController.getProfile);
app.put('/api/auth/profile', authenticateToken, AuthController.updateProfile);
app.put('/api/auth/change-password', authenticateToken, AuthController.changePassword);

/**
 * Rotas de Produtos
 */
app.get('/api/products', validate(queryParamsSchema, 'query'), ProdutoController.list);
app.get('/api/products/search', validate(queryParamsSchema, 'query'), ProdutoController.search);
app.get('/api/products/featured', ProdutoController.getFeatured);
app.get('/api/products/category/:category', validate(queryParamsSchema, 'query'), ProdutoController.getByCategory);
app.get('/api/products/:slug', ProdutoController.getBySlug);

// Rotas protegidas de produtos (admin)
app.post('/api/products', authenticateToken, requireAdmin, validate(produtoSchema), ProdutoController.create);
app.put('/api/products/:id', authenticateToken, requireAdmin, validate(produtoSchema), ProdutoController.update);
app.delete('/api/products/:id', authenticateToken, requireAdmin, ProdutoController.delete);
app.put('/api/products/:id/stock', authenticateToken, requireAdmin, ProdutoController.updateStock);
app.get('/api/products/low-stock', authenticateToken, requireAdmin, ProdutoController.getLowStock);

/**
 * Rotas do Carrinho
 */
app.get('/api/cart', authenticateToken, CarrinhoController.getCart);
app.post('/api/cart/add', authenticateToken, CarrinhoController.addItem);
app.put('/api/cart/update/:produto_id', authenticateToken, CarrinhoController.updateItem);
app.delete('/api/cart/remove/:produto_id', authenticateToken, CarrinhoController.removeItem);
app.delete('/api/cart/clear', authenticateToken, CarrinhoController.clearCart);
app.get('/api/cart/count', authenticateToken, CarrinhoController.getCount);
app.post('/api/cart/validate', authenticateToken, CarrinhoController.validateCart);
app.post('/api/cart/fix', authenticateToken, CarrinhoController.fixCart);

/**
 * Rotas de Pedidos
 */
app.get('/api/orders', authenticateToken, PedidoController.list);
app.get('/api/orders/:id', authenticateToken, PedidoController.getById);
app.post('/api/orders/create', authenticateToken, validate(pedidoSchema), PedidoController.create);
app.put('/api/orders/:id/status', authenticateToken, requireAdmin, PedidoController.updateStatus);
app.put('/api/orders/:id/cancel', authenticateToken, PedidoController.cancel);
app.put('/api/orders/:id/confirm-delivery', authenticateToken, PedidoController.confirmDelivery);
app.post('/api/orders/calculate-shipping', PedidoController.calculateShipping);

/**
 * Rotas de Webhooks (CORS mais permissivo)
 */
app.use('/api/webhooks', webhookCors);

/**
 * Middleware de tratamento de erros
 */
app.use(errorHandler);

/**
 * Middleware para rotas não encontradas
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

/**
 * Inicialização do servidor
 */
const startServer = async () => {
  try {
    // Testa conexão com banco de dados
    await testConnection();
    
    // Sincroniza modelos com banco (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      await syncDatabase(false); // false = não força recriação
    }

    // Inicia servidor
    app.listen(PORT, () => {
      console.log(`
🚀 Servidor Dahora Roots Confeitaria iniciado!

📊 Informações:
   • Porta: ${PORT}
   • Ambiente: ${process.env.NODE_ENV}
   • API URL: ${process.env.API_URL || `http://localhost:${PORT}`}
   • Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}

📚 Documentação:
   • Swagger UI: http://localhost:${PORT}/api-docs
   • Health Check: http://localhost:${PORT}/health

🎨 Cores do Tema:
   • Primary: ${process.env.COLOR_PRIMARY || '#E16A3D'}
   • Secondary: ${process.env.COLOR_SECONDARY || '#FEA450'}
   • Accent: ${process.env.COLOR_ACCENT || '#016A6D'}
   • Dark: ${process.env.COLOR_DARK || '#043E52'}

✅ Pronto para receber requisições!
      `);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Inicia servidor
startServer();

// Tratamento de sinais para shutdown graceful
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

module.exports = app;