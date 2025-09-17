const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo ItemPedido - Representa os itens de um pedido
 * Relaciona produtos com pedidos e suas quantidades
 */
const ItemPedido = sequelize.define('ItemPedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pedidos',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Pedido é obrigatório'
      }
    }
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
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Quantidade deve ser pelo menos 1'
      }
    }
  },
  preco_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.01],
        msg: 'Preço unitário deve ser maior que zero'
      }
    },
    comment: 'Preço do produto no momento da compra'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.01],
        msg: 'Subtotal deve ser maior que zero'
      }
    },
    comment: 'Quantidade × Preço unitário'
  },
  nome_produto: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Nome do produto no momento da compra (backup)'
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observações específicas do item'
  },
  personalizacoes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Personalizações do produto (ex: sabor, cor, tamanho)',
    defaultValue: {}
  }
}, {
  tableName: 'itens_pedido',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['pedido_id']
    },
    {
      fields: ['produto_id']
    },
    {
      unique: true,
      fields: ['pedido_id', 'produto_id']
    }
  ]
});

/**
 * Hook executado antes de salvar o item
 * Calcula o subtotal automaticamente
 */
ItemPedido.beforeSave = async (item) => {
  if (item.changed('quantidade') || item.changed('preco_unitario')) {
    item.subtotal = item.quantidade * item.preco_unitario;
  }
};

/**
 * Método estático para criar itens do pedido
 * @param {number} pedidoId - ID do pedido
 * @param {Array} itens - Array de itens com produto_id, quantidade e preco_unitario
 * @returns {Array} - Array de itens criados
 */
ItemPedido.createFromCart = async function(pedidoId, itens) {
  const itensCriados = [];
  
  for (const item of itens) {
    const { produto_id, quantidade, preco_unitario, observacoes, personalizacoes } = item;
    
    // Busca o produto para obter o nome atual
    const Produto = require('./Produto');
    const produto = await Produto.findByPk(produto_id);
    
    if (!produto) {
      throw new Error(`Produto com ID ${produto_id} não encontrado`);
    }
    
    const itemPedido = await this.create({
      pedido_id: pedidoId,
      produto_id,
      quantidade,
      preco_unitario,
      nome_produto: produto.nome,
      observacoes,
      personalizacoes
    });
    
    itensCriados.push(itemPedido);
  }
  
  return itensCriados;
};

/**
 * Método para obter dados públicos do item
 * @returns {object} - Dados públicos do item
 */
ItemPedido.prototype.toPublicJSON = function() {
  return {
    id: this.id,
    quantidade: this.quantidade,
    preco_unitario: this.preco_unitario,
    subtotal: this.subtotal,
    nome_produto: this.nome_produto,
    observacoes: this.observacoes,
    personalizacoes: this.personalizacoes
  };
};

module.exports = ItemPedido;