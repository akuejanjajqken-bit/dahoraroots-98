const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Cupom - Representa os cupons de desconto
 * Sistema de promoções e descontos
 */
const Cupom = sequelize.define('Cupom', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      name: 'cupom_codigo_unique',
      msg: 'Código do cupom deve ser único'
    },
    validate: {
      notEmpty: {
        msg: 'Código do cupom é obrigatório'
      },
      len: {
        args: [3, 50],
        msg: 'Código deve ter entre 3 e 50 caracteres'
      }
    }
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome do cupom é obrigatório'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('percentual', 'valor_fixo', 'frete_gratis'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['percentual', 'valor_fixo', 'frete_gratis']],
        msg: 'Tipo deve ser percentual, valor_fixo ou frete_gratis'
      }
    }
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.01],
        msg: 'Valor deve ser maior que zero'
      }
    },
    comment: 'Valor do desconto (percentual ou valor fixo)'
  },
  valor_minimo_pedido: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Valor mínimo não pode ser negativo'
      }
    }
  },
  valor_maximo_desconto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Valor máximo de desconto (para cupons percentuais)'
  },
  usos_maximo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [1],
        msg: 'Usos máximo deve ser pelo menos 1'
      }
    },
    comment: 'Número máximo de usos do cupom'
  },
  usos_atual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Usos atual não pode ser negativo'
      }
    }
  },
  usos_por_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Usos por usuário deve ser pelo menos 1'
      }
    }
  },
  data_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Data de início deve ser uma data válida'
      }
    }
  },
  data_fim: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Data de fim deve ser uma data válida'
      },
      isAfterStart(value) {
        if (value <= this.data_inicio) {
          throw new Error('Data de fim deve ser posterior à data de início');
        }
      }
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  categorias_permitidas: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de IDs de categorias permitidas (vazio = todas)'
  },
  categorias_excluidas: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de IDs de categorias excluídas'
  },
  produtos_permitidos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de IDs de produtos permitidos (vazio = todos)'
  },
  produtos_excluidos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de IDs de produtos excluídos'
  },
  usuarios_permitidos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de IDs de usuários permitidos (vazio = todos)'
  },
  usuarios_excluidos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de IDs de usuários excluídos'
  },
  tipo_usuario: {
    type: DataTypes.ENUM('todos', 'novos', 'existentes'),
    allowNull: false,
    defaultValue: 'todos'
  },
  primeira_compra: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Cupom válido apenas para primeira compra'
  },
  combinavel: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Se pode ser combinado com outros cupons'
  },
  prioridade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Prioridade do cupom (maior número = maior prioridade)'
  }
}, {
  tableName: 'cupons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['codigo']
    },
    {
      fields: ['ativo']
    },
    {
      fields: ['data_inicio', 'data_fim']
    },
    {
      fields: ['tipo']
    }
  ]
});

/**
 * Método estático para buscar cupom por código
 * @param {string} codigo - Código do cupom
 * @param {number} usuarioId - ID do usuário (opcional)
 * @param {number} valorPedido - Valor do pedido (opcional)
 * @returns {Cupom|null} - Cupom válido ou null
 */
Cupom.findValidByCode = async function(codigo, usuarioId = null, valorPedido = 0) {
  const agora = new Date();
  
  const cupom = await this.findOne({
    where: {
      codigo: codigo.toUpperCase(),
      ativo: true,
      data_inicio: { [sequelize.Sequelize.Op.lte]: agora },
      data_fim: { [sequelize.Sequelize.Op.gte]: agora }
    }
  });
  
  if (!cupom) {
    return null;
  }
  
  // Verifica se ainda pode ser usado
  if (cupom.usos_maximo && cupom.usos_atual >= cupom.usos_maximo) {
    return null;
  }
  
  // Verifica valor mínimo do pedido
  if (valorPedido < cupom.valor_minimo_pedido) {
    return null;
  }
  
  // Verifica usuário específico
  if (usuarioId) {
    // Verifica se usuário está na lista de permitidos
    if (cupom.usuarios_permitidos.length > 0 && 
        !cupom.usuarios_permitidos.includes(usuarioId)) {
      return null;
    }
    
    // Verifica se usuário está na lista de excluídos
    if (cupom.usuarios_excluidos.includes(usuarioId)) {
      return null;
    }
    
    // Verifica usos por usuário
    const UsuarioCupom = require('./UsuarioCupom');
    const usosUsuario = await UsuarioCupom.count({
      where: {
        usuario_id: usuarioId,
        cupom_id: cupom.id
      }
    });
    
    if (usosUsuario >= cupom.usos_por_usuario) {
      return null;
    }
  }
  
  return cupom;
};

/**
 * Método para calcular desconto
 * @param {number} valorPedido - Valor do pedido
 * @returns {object} - Objeto com desconto calculado
 */
Cupom.prototype.calcularDesconto = function(valorPedido) {
  let valorDesconto = 0;
  
  switch (this.tipo) {
    case 'percentual':
      valorDesconto = (valorPedido * this.valor) / 100;
      if (this.valor_maximo_desconto && valorDesconto > this.valor_maximo_desconto) {
        valorDesconto = this.valor_maximo_desconto;
      }
      break;
      
    case 'valor_fixo':
      valorDesconto = this.valor;
      break;
      
    case 'frete_gratis':
      valorDesconto = 0; // Será aplicado no frete
      break;
  }
  
  // Não pode dar desconto maior que o valor do pedido
  if (valorDesconto > valorPedido) {
    valorDesconto = valorPedido;
  }
  
  return {
    valor_desconto: valorDesconto,
    tipo: this.tipo,
    valor_original: this.valor
  };
};

/**
 * Método para verificar se cupom é válido para produto
 * @param {number} produtoId - ID do produto
 * @param {number} categoriaId - ID da categoria
 * @returns {boolean} - True se válido para o produto
 */
Cupom.prototype.isValidForProduct = function(produtoId, categoriaId) {
  // Verifica produtos permitidos
  if (this.produtos_permitidos.length > 0 && 
      !this.produtos_permitidos.includes(produtoId)) {
    return false;
  }
  
  // Verifica produtos excluídos
  if (this.produtos_excluidos.includes(produtoId)) {
    return false;
  }
  
  // Verifica categorias permitidas
  if (this.categorias_permitidas.length > 0 && 
      !this.categorias_permitidas.includes(categoriaId)) {
    return false;
  }
  
  // Verifica categorias excluídas
  if (this.categorias_excluidas.includes(categoriaId)) {
    return false;
  }
  
  return true;
};

/**
 * Método para usar cupom
 * @param {number} usuarioId - ID do usuário
 * @param {number} pedidoId - ID do pedido
 */
Cupom.prototype.use = async function(usuarioId, pedidoId) {
  // Incrementa contador de usos
  this.usos_atual += 1;
  await this.save();
  
  // Registra uso do usuário
  const UsuarioCupom = require('./UsuarioCupom');
  await UsuarioCupom.create({
    usuario_id: usuarioId,
    cupom_id: this.id,
    pedido_id: pedidoId
  });
};

/**
 * Método para verificar se cupom está ativo
 * @returns {boolean} - True se ativo
 */
Cupom.prototype.isActive = function() {
  const agora = new Date();
  return this.ativo && 
         this.data_inicio <= agora && 
         this.data_fim >= agora &&
         (!this.usos_maximo || this.usos_atual < this.usos_maximo);
};

/**
 * Método para obter dados públicos do cupom
 * @returns {object} - Dados públicos do cupom
 */
Cupom.prototype.toPublicJSON = function() {
  return {
    id: this.id,
    codigo: this.codigo,
    nome: this.nome,
    descricao: this.descricao,
    tipo: this.tipo,
    valor: this.valor,
    valor_minimo_pedido: this.valor_minimo_pedido,
    valor_maximo_desconto: this.valor_maximo_desconto,
    data_inicio: this.data_inicio,
    data_fim: this.data_fim,
    ativo: this.isActive(),
    usos_restantes: this.usos_maximo ? this.usos_maximo - this.usos_atual : null,
    usos_por_usuario: this.usos_por_usuario,
    primeira_compra: this.primeira_compra,
    combinavel: this.combinavel
  };
};

/**
 * Método estático para buscar cupons ativos
 * @returns {Array} - Lista de cupons ativos
 */
Cupom.findActive = async function() {
  const agora = new Date();
  
  return await this.findAll({
    where: {
      ativo: true,
      data_inicio: { [sequelize.Sequelize.Op.lte]: agora },
      data_fim: { [sequelize.Sequelize.Op.gte]: agora }
    },
    order: [['prioridade', 'DESC'], ['created_at', 'DESC']]
  });
};

module.exports = Cupom;