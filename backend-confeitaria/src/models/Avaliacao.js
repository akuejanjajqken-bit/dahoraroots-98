const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Avaliacao - Representa as avaliações dos produtos
 * Sistema de reviews e ratings dos clientes
 */
const Avaliacao = sequelize.define('Avaliacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'produtos',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Produto é obrigatório'
      }
    }
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
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pedidos',
      key: 'id'
    },
    comment: 'Pedido relacionado à avaliação (opcional)'
  },
  nota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Nota deve ser pelo menos 1'
      },
      max: {
        args: [5],
        msg: 'Nota deve ser no máximo 5'
      }
    }
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Comentário deve ter no máximo 1000 caracteres'
      }
    }
  },
  data_avaliacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  aprovada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Avaliação aprovada para exibição'
  },
  moderada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Avaliação já foi moderada'
  },
  resposta: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Resposta da loja à avaliação'
  },
  data_resposta: {
    type: DataTypes.DATE,
    allowNull: true
  },
  util_nao_util: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: { util: 0, nao_util: 0 },
    comment: 'Contador de votos úteis/não úteis'
  },
  fotos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de URLs das fotos da avaliação'
  },
  aspectos: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Avaliação por aspectos (sabor, apresentação, etc)',
    defaultValue: {}
  }
}, {
  tableName: 'avaliacoes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['produto_id']
    },
    {
      fields: ['usuario_id']
    },
    {
      fields: ['aprovada']
    },
    {
      fields: ['data_avaliacao']
    },
    {
      unique: true,
      fields: ['produto_id', 'usuario_id', 'pedido_id']
    }
  ]
});

/**
 * Método estático para buscar avaliações de um produto
 * @param {number} produtoId - ID do produto
 * @param {object} options - Opções de busca
 * @returns {Array} - Lista de avaliações do produto
 */
Avaliacao.findByProduct = async function(produtoId, options = {}) {
  const Usuario = require('./Usuario');
  const Pedido = require('./Pedido');
  
  const defaultOptions = {
    where: {
      produto_id: produtoId,
      aprovada: true
    },
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome_completo', 'avatar_url']
      },
      {
        model: Pedido,
        as: 'pedido',
        attributes: ['id', 'numero_pedido', 'data_pedido'],
        required: false
      }
    ],
    order: [['data_avaliacao', 'DESC']],
    limit: 20
  };
  
  return await this.findAll({
    ...defaultOptions,
    ...options
  });
};

/**
 * Método estático para calcular média de avaliações de um produto
 * @param {number} produtoId - ID do produto
 * @returns {object} - Estatísticas das avaliações
 */
Avaliacao.getProductStats = async function(produtoId) {
  const stats = await this.findOne({
    where: {
      produto_id: produtoId,
      aprovada: true
    },
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'total_avaliacoes'],
      [sequelize.fn('AVG', sequelize.col('nota')), 'media_notas'],
      [sequelize.fn('MIN', sequelize.col('nota')), 'menor_nota'],
      [sequelize.fn('MAX', sequelize.col('nota')), 'maior_nota']
    ],
    raw: true
  });
  
  // Conta avaliações por nota
  const notas = await this.findAll({
    where: {
      produto_id: produtoId,
      aprovada: true
    },
    attributes: [
      'nota',
      [sequelize.fn('COUNT', sequelize.col('id')), 'quantidade']
    ],
    group: ['nota'],
    raw: true
  });
  
  const distribuicao = {};
  for (let i = 1; i <= 5; i++) {
    distribuicao[i] = 0;
  }
  
  notas.forEach(nota => {
    distribuicao[nota.nota] = parseInt(nota.quantidade);
  });
  
  return {
    total_avaliacoes: parseInt(stats.total_avaliacoes) || 0,
    media_notas: parseFloat(stats.media_notas) || 0,
    menor_nota: parseInt(stats.menor_nota) || 0,
    maior_nota: parseInt(stats.maior_nota) || 0,
    distribuicao_notas: distribuicao
  };
};

/**
 * Método estático para verificar se usuário já avaliou o produto
 * @param {number} usuarioId - ID do usuário
 * @param {number} produtoId - ID do produto
 * @param {number} pedidoId - ID do pedido (opcional)
 * @returns {boolean} - True se já avaliou
 */
Avaliacao.userAlreadyReviewed = async function(usuarioId, produtoId, pedidoId = null) {
  const whereClause = {
    usuario_id: usuarioId,
    produto_id: produtoId
  };
  
  if (pedidoId) {
    whereClause.pedido_id = pedidoId;
  }
  
  const count = await this.count({ where: whereClause });
  return count > 0;
};

/**
 * Método estático para buscar avaliações pendentes de moderação
 * @returns {Array} - Lista de avaliações pendentes
 */
Avaliacao.findPendingModeration = async function() {
  const Usuario = require('./Usuario');
  const Produto = require('./Produto');
  
  return await this.findAll({
    where: {
      moderada: false
    },
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome_completo', 'email']
      },
      {
        model: Produto,
        as: 'produto',
        attributes: ['id', 'nome', 'slug']
      }
    ],
    order: [['data_avaliacao', 'ASC']]
  });
};

/**
 * Método para aprovar avaliação
 */
Avaliacao.prototype.approve = async function() {
  this.aprovada = true;
  this.moderada = true;
  await this.save();
};

/**
 * Método para rejeitar avaliação
 */
Avaliacao.prototype.reject = async function() {
  this.aprovada = false;
  this.moderada = true;
  await this.save();
};

/**
 * Método para adicionar resposta da loja
 * @param {string} resposta - Resposta da loja
 */
Avaliacao.prototype.addResponse = async function(resposta) {
  this.resposta = resposta;
  this.data_resposta = new Date();
  await this.save();
};

/**
 * Método para votar na utilidade da avaliação
 * @param {number} usuarioId - ID do usuário que está votando
 * @param {boolean} util - True se útil, false se não útil
 */
Avaliacao.prototype.voteUseful = async function(usuarioId, util) {
  const votos = this.util_nao_util || { util: 0, nao_util: 0 };
  
  if (util) {
    votos.util += 1;
  } else {
    votos.nao_util += 1;
  }
  
  this.util_nao_util = votos;
  await this.save();
};

/**
 * Método para obter dados públicos da avaliação
 * @returns {object} - Dados públicos da avaliação
 */
Avaliacao.prototype.toPublicJSON = function() {
  return {
    id: this.id,
    nota: this.nota,
    comentario: this.comentario,
    data_avaliacao: this.data_avaliacao,
    resposta: this.resposta,
    data_resposta: this.data_resposta,
    util_nao_util: this.util_nao_util,
    fotos: this.fotos,
    aspectos: this.aspectos,
    usuario: this.usuario ? {
      id: this.usuario.id,
      nome: this.usuario.nome_completo,
      avatar: this.usuario.avatar_url
    } : null,
    pedido: this.pedido ? {
      numero: this.pedido.numero_pedido,
      data: this.pedido.data_pedido
    } : null
  };
};

/**
 * Método estático para buscar avaliações do usuário
 * @param {number} usuarioId - ID do usuário
 * @returns {Array} - Lista de avaliações do usuário
 */
Avaliacao.findByUser = async function(usuarioId) {
  const Produto = require('./Produto');
  
  return await this.findAll({
    where: { usuario_id: usuarioId },
    include: [{
      model: Produto,
      as: 'produto',
      attributes: ['id', 'nome', 'slug', 'imagens']
    }],
    order: [['data_avaliacao', 'DESC']]
  });
};

module.exports = Avaliacao;