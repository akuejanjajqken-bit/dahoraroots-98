const { Usuario } = require('../models');
const { generateToken, generateRefreshToken } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');

/**
 * Controller de Autenticação
 * Gerencia login, registro e operações relacionadas
 */
class AuthController {
  /**
   * Registra um novo usuário
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { nome_completo, email, senha, telefone, cpf, data_nascimento, genero, newsletter, termos_aceitos } = req.body;

      // Verifica se email já existe
      const emailExists = await Usuario.emailExists(email);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'Este email já está cadastrado'
        });
      }

      // Verifica se CPF já existe (se fornecido)
      if (cpf) {
        const cpfExists = await Usuario.cpfExists(cpf);
        if (cpfExists) {
          return res.status(409).json({
            success: false,
            message: 'Este CPF já está cadastrado'
          });
        }
      }

      // Cria o usuário
      const usuario = await Usuario.create({
        nome_completo,
        email: email.toLowerCase(),
        senha_hash: senha, // Será criptografada pelo hook
        telefone,
        cpf,
        data_nascimento,
        genero,
        newsletter,
        termos_aceitos,
        data_aceite_termos: new Date()
      });

      // Gera tokens
      const token = generateToken(usuario);
      const refreshToken = generateRefreshToken(usuario);

      // Atualiza último acesso
      await usuario.atualizarUltimoAcesso();

      // Envia email de boas-vindas
      try {
        await sendEmail({
          to: usuario.email,
          subject: 'Bem-vindo à Dahora Roots Confeitaria!',
          template: 'welcome',
          data: {
            nome: usuario.nome_completo,
            email: usuario.email
          }
        });
      } catch (emailError) {
        console.error('Erro ao enviar email de boas-vindas:', emailError);
        // Não falha o registro se o email não for enviado
      }

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso!',
        data: {
          user: usuario.toPublicJSON(),
          token,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Realiza login do usuário
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      // Busca o usuário
      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Verifica se usuário está ativo
      if (usuario.status !== 'ativo') {
        return res.status(401).json({
          success: false,
          message: 'Usuário inativo. Entre em contato com o suporte.'
        });
      }

      // Verifica a senha
      const senhaValida = await usuario.verificarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gera tokens
      const token = generateToken(usuario);
      const refreshToken = generateRefreshToken(usuario);

      // Atualiza último acesso
      await usuario.atualizarUltimoAcesso();

      res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        data: {
          user: usuario.toPublicJSON(),
          token,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Renova o token de acesso
   * POST /api/auth/refresh
   */
  static async refresh(req, res, next) {
    try {
      const usuario = req.user;

      // Gera novo token
      const token = generateToken(usuario);

      res.json({
        success: true,
        message: 'Token renovado com sucesso!',
        data: {
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Realiza logout do usuário
   * POST /api/auth/logout
   */
  static async logout(req, res, next) {
    try {
      // Em uma implementação mais robusta, você poderia
      // adicionar o token a uma blacklist
      res.json({
        success: true,
        message: 'Logout realizado com sucesso!'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Solicita redefinição de senha
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const usuario = await Usuario.findByEmail(email);
      if (!usuario) {
        // Por segurança, não revela se o email existe ou não
        return res.json({
          success: true,
          message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
        });
      }

      // Gera token de redefinição (válido por 1 hora)
      const resetToken = require('jsonwebtoken').sign(
        { id: usuario.id, type: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Envia email com link de redefinição
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      await sendEmail({
        to: usuario.email,
        subject: 'Redefinição de Senha - Dahora Roots',
        template: 'password-reset',
        data: {
          nome: usuario.nome_completo,
          resetUrl
        }
      });

      res.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Redefine a senha do usuário
   * POST /api/auth/reset-password
   */
  static async resetPassword(req, res, next) {
    try {
      const { token, senha } = req.body;

      // Verifica o token
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'password_reset') {
        return res.status(400).json({
          success: false,
          message: 'Token inválido'
        });
      }

      // Busca o usuário
      const usuario = await Usuario.findByPk(decoded.id);
      if (!usuario) {
        return res.status(400).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Atualiza a senha
      usuario.senha_hash = senha; // Será criptografada pelo hook
      await usuario.save();

      // Envia email de confirmação
      await sendEmail({
        to: usuario.email,
        subject: 'Senha Redefinida - Dahora Roots',
        template: 'password-reset-confirmation',
        data: {
          nome: usuario.nome_completo
        }
      });

      res.json({
        success: true,
        message: 'Senha redefinida com sucesso!'
      });
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }
      next(error);
    }
  }

  /**
   * Obtém perfil do usuário autenticado
   * GET /api/auth/profile
   */
  static async getProfile(req, res, next) {
    try {
      const usuario = req.user;

      res.json({
        success: true,
        data: {
          user: usuario.toPublicJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza perfil do usuário
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res, next) {
    try {
      const usuario = req.user;
      const { nome_completo, telefone, data_nascimento, genero, newsletter } = req.body;

      // Verifica se email foi alterado e se já existe
      if (req.body.email && req.body.email !== usuario.email) {
        const emailExists = await Usuario.emailExists(req.body.email, usuario.id);
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Este email já está cadastrado'
          });
        }
        usuario.email = req.body.email.toLowerCase();
      }

      // Verifica se CPF foi alterado e se já existe
      if (req.body.cpf && req.body.cpf !== usuario.cpf) {
        const cpfExists = await Usuario.cpfExists(req.body.cpf, usuario.id);
        if (cpfExists) {
          return res.status(409).json({
            success: false,
            message: 'Este CPF já está cadastrado'
          });
        }
        usuario.cpf = req.body.cpf;
      }

      // Atualiza campos
      if (nome_completo) usuario.nome_completo = nome_completo;
      if (telefone !== undefined) usuario.telefone = telefone;
      if (data_nascimento !== undefined) usuario.data_nascimento = data_nascimento;
      if (genero !== undefined) usuario.genero = genero;
      if (newsletter !== undefined) usuario.newsletter = newsletter;

      await usuario.save();

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso!',
        data: {
          user: usuario.toPublicJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Altera senha do usuário
   * PUT /api/auth/change-password
   */
  static async changePassword(req, res, next) {
    try {
      const usuario = req.user;
      const { senha_atual, nova_senha } = req.body;

      // Verifica senha atual
      const senhaValida = await usuario.verificarSenha(senha_atual);
      if (!senhaValida) {
        return res.status(400).json({
          success: false,
          message: 'Senha atual incorreta'
        });
      }

      // Atualiza senha
      usuario.senha_hash = nova_senha; // Será criptografada pelo hook
      await usuario.save();

      // Envia email de confirmação
      await sendEmail({
        to: usuario.email,
        subject: 'Senha Alterada - Dahora Roots',
        template: 'password-change-confirmation',
        data: {
          nome: usuario.nome_completo
        }
      });

      res.json({
        success: true,
        message: 'Senha alterada com sucesso!'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;