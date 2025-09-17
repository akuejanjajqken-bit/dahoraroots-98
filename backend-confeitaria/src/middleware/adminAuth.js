const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');

/**
 * Níveis de permissão administrativa
 */
const PERMISSION_LEVELS = {
  SUPER_ADMIN: 'super_admin', // Acesso total
  ADMIN: 'admin',             // Gerencia produtos e pedidos
  MODERATOR: 'moderator'      // Apenas visualiza
};

/**
 * Middleware para verificar se o usuário é administrador
 */
const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca o usuário no banco para verificar se ainda é admin
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verifica se é administrador
    if (!['super_admin', 'admin', 'moderator'].includes(usuario.tipo_usuario)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso'
      });
    }

    // Verifica se usuário está ativo
    if (usuario.status !== 'ativo') {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    req.user = usuario;
    req.adminLevel = usuario.tipo_usuario;
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

    console.error('Erro na autenticação admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Middleware para verificar se é super admin
 */
const isSuperAdmin = (req, res, next) => {
  if (req.adminLevel !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas super administradores podem acessar este recurso'
    });
  }
  next();
};

/**
 * Middleware para verificar se pode editar (admin ou super_admin)
 */
const canEdit = (req, res, next) => {
  if (!['super_admin', 'admin'].includes(req.adminLevel)) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Você não tem permissão para editar'
    });
  }
  next();
};

/**
 * Middleware para verificar se pode deletar (apenas super_admin)
 */
const canDelete = (req, res, next) => {
  if (req.adminLevel !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas super administradores podem deletar'
    });
  }
  next();
};

/**
 * Função para criar hash de senha
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

/**
 * Função para verificar senha
 */
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Função para criar primeiro administrador
 */
const createFirstAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'arrkkhecorp@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Dahoraroots2025*';
    
    // Verifica se já existe um admin
    const existingAdmin = await Usuario.findOne({
      where: { tipo_usuario: 'super_admin' }
    });
    
    if (existingAdmin) {
      console.log('✅ Super administrador já existe');
      return;
    }
    
    // Cria o super admin
    const hashedPassword = await hashPassword(adminPassword);
    
    const admin = await Usuario.create({
      email: adminEmail,
      senha_hash: hashedPassword,
      nome_completo: 'Administrador Master',
      tipo_usuario: 'super_admin',
      status: 'ativo',
      termos_aceitos: true,
      data_aceite_termos: new Date()
    });
    
    console.log('✅ Super administrador criado com sucesso!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Senha: ${adminPassword}`);
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    
    return admin;
  } catch (error) {
    console.error('❌ Erro ao criar super administrador:', error);
    throw error;
  }
};

/**
 * Middleware para log de ações administrativas
 */
const logAdminAction = async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log da ação após a resposta
    if (req.user && req.user.tipo_usuario) {
      logAction({
        adminId: req.user.id,
        action: `${req.method} ${req.originalUrl}`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        success: res.statusCode < 400
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * Função para registrar ações administrativas
 */
const logAction = async (actionData) => {
  try {
    // Aqui você pode implementar o log em uma tabela específica
    // ou em um sistema de logs externo
    console.log('🔍 Admin Action:', {
      timestamp: new Date().toISOString(),
      ...actionData
    });
  } catch (error) {
    console.error('Erro ao registrar ação administrativa:', error);
  }
};

module.exports = {
  isAdmin,
  isSuperAdmin,
  canEdit,
  canDelete,
  hashPassword,
  verifyPassword,
  createFirstAdmin,
  logAdminAction,
  PERMISSION_LEVELS
};