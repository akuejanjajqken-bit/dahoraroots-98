const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Endereco - Representa os endereços dos usuários
 * Permite múltiplos endereços por usuário
 */
const Endereco = sequelize.define('Endereco', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Usuário é obrigatório'
      }
    }
  },
  cep: {
    type: DataTypes.STRING(9),
    allowNull: false,
    validate: {
      is: {
        args: /^\d{5}-?\d{3}$/,
        msg: 'CEP deve estar no formato 00000-000'
      },
      notEmpty: {
        msg: 'CEP é obrigatório'
      }
    }
  },
  logradouro: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Logradouro é obrigatório'
      },
      len: {
        args: [2, 255],
        msg: 'Logradouro deve ter entre 2 e 255 caracteres'
      }
    }
  },
  numero: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Número é obrigatório'
      }
    }
  },
  complemento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bairro: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Bairro é obrigatório'
      }
    }
  },
  cidade: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Cidade é obrigatória'
      }
    }
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Z]{2}$/,
        msg: 'Estado deve ser a sigla de 2 letras (ex: SP)'
      },
      notEmpty: {
        msg: 'Estado é obrigatório'
      }
    }
  },
  principal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Endereço principal do usuário'
  },
  tipo: {
    type: DataTypes.ENUM('residencial', 'comercial', 'outro'),
    allowNull: false,
    defaultValue: 'residencial'
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Nome personalizado para o endereço (ex: Casa, Trabalho)'
  },
  referencia: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Ponto de referência para entrega'
  },
  instrucoes_entrega: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Instruções especiais para entrega'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'enderecos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['usuario_id']
    },
    {
      fields: ['principal']
    },
    {
      fields: ['cep']
    }
  ]
});

/**
 * Hook executado antes de salvar o endereço
 * Se este endereço for marcado como principal, remove a marcação dos outros
 */
Endereco.beforeSave = async (endereco) => {
  if (endereco.principal && endereco.changed('principal')) {
    // Remove a marcação de principal dos outros endereços do usuário
    await Endereco.update(
      { principal: false },
      {
        where: {
          usuario_id: endereco.usuario_id,
          id: { [sequelize.Sequelize.Op.ne]: endereco.id }
        }
      }
    );
  }
};

/**
 * Método estático para buscar endereços do usuário
 * @param {number} usuarioId - ID do usuário
 * @param {boolean} apenasAtivos - Se deve retornar apenas endereços ativos
 * @returns {Array} - Lista de endereços do usuário
 */
Endereco.findByUser = async function(usuarioId, apenasAtivos = true) {
  const whereClause = { usuario_id: usuarioId };
  if (apenasAtivos) {
    whereClause.ativo = true;
  }
  
  return await this.findAll({
    where: whereClause,
    order: [['principal', 'DESC'], ['created_at', 'DESC']]
  });
};

/**
 * Método estático para buscar endereço principal do usuário
 * @param {number} usuarioId - ID do usuário
 * @returns {Endereco|null} - Endereço principal ou null
 */
Endereco.findPrincipal = async function(usuarioId) {
  return await this.findOne({
    where: {
      usuario_id: usuarioId,
      principal: true,
      ativo: true
    }
  });
};

/**
 * Método para definir como endereço principal
 */
Endereco.prototype.setAsPrincipal = async function() {
  this.principal = true;
  await this.save();
};

/**
 * Método para desativar endereço
 */
Endereco.prototype.desativar = async function() {
  this.ativo = false;
  if (this.principal) {
    this.principal = false;
  }
  await this.save();
};

/**
 * Método para formatar endereço completo
 * @returns {string} - Endereço formatado
 */
Endereco.prototype.getEnderecoCompleto = function() {
  const parts = [
    this.logradouro,
    this.numero,
    this.complemento,
    this.bairro,
    this.cidade,
    this.estado,
    this.cep
  ].filter(part => part && part.trim());
  
  return parts.join(', ');
};

/**
 * Método para obter dados públicos do endereço
 * @returns {object} - Dados públicos do endereço
 */
Endereco.prototype.toPublicJSON = function() {
  return {
    id: this.id,
    cep: this.cep,
    logradouro: this.logradouro,
    numero: this.numero,
    complemento: this.complemento,
    bairro: this.bairro,
    cidade: this.cidade,
    estado: this.estado,
    principal: this.principal,
    tipo: this.tipo,
    nome: this.nome,
    referencia: this.referencia,
    instrucoes_entrega: this.instrucoes_entrega,
    endereco_completo: this.getEnderecoCompleto()
  };
};

/**
 * Método estático para validar CEP
 * @param {string} cep - CEP a ser validado
 * @returns {boolean} - True se CEP é válido
 */
Endereco.isValidCEP = function(cep) {
  return /^\d{5}-?\d{3}$/.test(cep);
};

/**
 * Método estático para formatar CEP
 * @param {string} cep - CEP a ser formatado
 * @returns {string} - CEP formatado
 */
Endereco.formatCEP = function(cep) {
  return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
};

module.exports = Endereco;