const cors = require('cors');

/**
 * Configuração do CORS (Cross-Origin Resource Sharing)
 * Permite requisições de diferentes origens de forma segura
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de origens permitidas
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://dahoraroots.com',
      'https://www.dahoraroots.com'
    ];

    // Em desenvolvimento, permite requisições sem origin (ex: Postman)
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push(undefined);
    }

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true, // Permite cookies e headers de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // Cache preflight por 24 horas
};

/**
 * Middleware de CORS customizado para diferentes rotas
 */
const corsMiddleware = cors(corsOptions);

/**
 * CORS específico para webhooks (mais permissivo)
 */
const webhookCorsOptions = {
  origin: true, // Permite qualquer origem para webhooks
  credentials: false,
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Webhook-Signature']
};

const webhookCors = cors(webhookCorsOptions);

module.exports = {
  corsMiddleware,
  webhookCors,
  corsOptions
};