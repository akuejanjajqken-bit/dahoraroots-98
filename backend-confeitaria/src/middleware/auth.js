const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * Middleware de autenticação JWT
 * Verifica se o usuário está autenticado
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca o usuário no banco
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (usuario.status !== 'ativo') {
      return res.status(401).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    // Adiciona o usuário ao request
    req.user = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se o usuário é administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  if (req.user.tipo_usuario !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem acessar este recurso'
    });
  }

  next();
};

/**
 * Middleware opcional de autenticação
 * Não retorna erro se não houver token, apenas adiciona o usuário se existir
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.findByPk(decoded.id);
      
      if (usuario && usuario.status === 'ativo') {
        req.user = usuario;
      }
    }
    
    next();
  } catch (error) {
    // Em caso de erro, continua sem usuário autenticado
    next();
  }
};

/**
 * Middleware para verificar se o usuário pode acessar o recurso
 * Verifica se é o próprio usuário ou admin
 */
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Usuário não autenticado'
    });
  }

  const resourceUserId = parseInt(req.params.userId || req.params.id);
  const currentUserId = req.user.id;

  if (req.user.tipo_usuario === 'admin' || currentUserId === resourceUserId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Você só pode acessar seus próprios recursos'
    });
  }
};

/**
 * Gera token JWT para o usuário
 * @param {Usuario} usuario - Instância do usuário
 * @returns {string} - Token JWT
 */
const generateToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  );
};

/**
 * Gera refresh token para o usuário
 * @param {Usuario} usuario - Instância do usuário
 * @returns {string} - Refresh token JWT
 */
const generateRefreshToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      type: 'refresh'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    }
  );
};

/**
 * Middleware para verificar refresh token
 */
const verifyRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token não fornecido'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario || usuario.status !== 'ativo') {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado ou inativo'
      });
    }

    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token inválido ou expirado'
    });
  }
};

/**
 * Middleware para rate limiting por usuário
 * Limita requisições por usuário autenticado
 */
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpa requisições antigas
    if (requests.has(userId)) {
      const userRequests = requests.get(userId);
      const recentRequests = userRequests.filter(time => time > windowStart);
      requests.set(userId, recentRequests);
    }

    // Verifica limite
    const userRequests = requests.get(userId) || [];
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Muitas requisições. Tente novamente em alguns minutos.'
      });
    }

    // Adiciona requisição atual
    userRequests.push(now);
    requests.set(userId, userRequests);

    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth,
  requireOwnershipOrAdmin,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  userRateLimit
};