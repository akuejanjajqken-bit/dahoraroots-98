const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Modelo Usuario - Representa os usuários do sistema
 * Inclui tanto clientes quanto administradores
 */
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome_completo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome completo é obrigatório'
      },
      len: {
        args: [2, 255],
        msg: 'Nome deve ter entre 2 e 255 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      name: 'email_unique',
      msg: 'Este email já está cadastrado'
    },
    validate: {
      isEmail: {
        msg: 'Email deve ter um formato válido'
      },
      notEmpty: {
        msg: 'Email é obrigatório'
      }
    }
  },
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Senha é obrigatória'
      },
      len: {
        args: [6, 255],
        msg: 'Senha deve ter pelo menos 6 caracteres'
      }
    }
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
        msg: 'Telefone deve estar no formato (11) 99999-9999'
      }
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    allowNull: true,
    unique: {
      name: 'cpf_unique',
      msg: 'Este CPF já está cadastrado'
    },
    validate: {
      is: {
        args: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        msg: 'CPF deve estar no formato 000.000.000-00'
      }
    }
  },
  tipo_usuario: {
    type: DataTypes.ENUM('admin', 'cliente'),
    allowNull: false,
    defaultValue: 'cliente',
    validate: {
      isIn: {
        args: [['admin', 'cliente']],
        msg: 'Tipo de usuário deve ser admin ou cliente'
      }
    }
  },
  data_cadastro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ultimo_acesso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ativo', 'inativo'),
    allowNull: false,
    defaultValue: 'ativo',
    validate: {
      isIn: {
        args: [['ativo', 'inativo']],
        msg: 'Status deve ser ativo ou inativo'
      }
    }
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  genero: {
    type: DataTypes.ENUM('masculino', 'feminino', 'outro', 'nao_informado'),
    allowNull: true,
    defaultValue: 'nao_informado'
  },
  newsletter: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  termos_aceitos: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  data_aceite_termos: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    /**
     * Hook executado antes de salvar o usuário
     * Criptografa a senha se ela foi modificada
     */
    beforeSave: async (usuario) => {
      if (usuario.changed('senha_hash')) {
        const salt = await bcrypt.genSalt(12);
        usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, salt);
      }
    }
  }
});

/**
 * Método para verificar se a senha está correta
 * @param {string} senha - Senha em texto plano
 * @returns {boolean} - True se a senha estiver correta
 */
Usuario.prototype.verificarSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha_hash);
};

/**
 * Método para atualizar o último acesso
 */
Usuario.prototype.atualizarUltimoAcesso = async function() {
  this.ultimo_acesso = new Date();
  await this.save();
};

/**
 * Método para obter dados públicos do usuário (sem senha)
 * @returns {object} - Dados públicos do usuário
 */
Usuario.prototype.toPublicJSON = function() {
  const { senha_hash, ...usuarioPublico } = this.toJSON();
  return usuarioPublico;
};

/**
 * Método estático para buscar usuário por email
 * @param {string} email - Email do usuário
 * @returns {Usuario|null} - Usuário encontrado ou null
 */
Usuario.findByEmail = async function(email) {
  return await this.findOne({
    where: { email: email.toLowerCase() }
  });
};

/**
 * Método estático para verificar se email já existe
 * @param {string} email - Email a ser verificado
 * @param {number} excludeId - ID do usuário a ser excluído da busca
 * @returns {boolean} - True se email já existe
 */
Usuario.emailExists = async function(email, excludeId = null) {
  const whereClause = { email: email.toLowerCase() };
  if (excludeId) {
    whereClause.id = { [sequelize.Sequelize.Op.ne]: excludeId };
  }
  
  const count = await this.count({ where: whereClause });
  return count > 0;
};

/**
 * Método estático para verificar se CPF já existe
 * @param {string} cpf - CPF a ser verificado
 * @param {number} excludeId - ID do usuário a ser excluído da busca
 * @returns {boolean} - True se CPF já existe
 */
Usuario.cpfExists = async function(cpf, excludeId = null) {
  const whereClause = { cpf };
  if (excludeId) {
    whereClause.id = { [sequelize.Sequelize.Op.ne]: excludeId };
  }
  
  const count = await this.count({ where: whereClause });
  return count > 0;
};

module.exports = Usuario;