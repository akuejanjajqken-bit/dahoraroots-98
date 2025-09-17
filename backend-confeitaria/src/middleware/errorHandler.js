const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', err);

  // Erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  // Erro de chave única duplicada
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'campo';
    return res.status(409).json({
      success: false,
      message: `${field} já está em uso`
    });
  }

  // Erro de chave estrangeira
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referência inválida'
    });
  }

  // Erro de conexão com banco
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      success: false,
      message: 'Serviço temporariamente indisponível'
    });
  }

  // Erro JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Erro de rate limiting
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Muitas requisições. Tente novamente em alguns minutos.'
    });
  }

  // Erro personalizado
  if (err.status && err.message) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    });
  }

  // Erro interno do servidor
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
};

module.exports = errorHandler;