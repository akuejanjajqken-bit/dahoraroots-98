const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Carrinho - Representa os itens no carrinho de compras
 * Gerencia o carrinho temporário dos usuários
 */
const Carrinho = sequelize.define('Carrinho', {
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
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Quantidade deve ser pelo menos 1'
      }
    }
  },
  data_adicao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observações específicas do item no carrinho'
  },
  personalizacoes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Personalizações do produto (ex: sabor, cor, tamanho)',
    defaultValue: {}
  },
  preco_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Preço do produto no momento da adição ao carrinho'
  }
}, {
  tableName: 'carrinho',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['usuario_id']
    },
    {
      fields: ['produto_id']
    },
    {
      unique: true,
      fields: ['usuario_id', 'produto_id']
    }
  ]
});

/**
 * Método estático para buscar carrinho do usuário
 * @param {number} usuarioId - ID do usuário
 * @returns {Array} - Lista de itens no carrinho
 */
Carrinho.findByUser = async function(usuarioId) {
  const Produto = require('./Produto');
  const Categoria = require('./Categoria');
  
  return await this.findAll({
    where: { usuario_id: usuarioId },
    include: [{
      model: Produto,
      as: 'produto',
      where: { ativo: true },
      include: [{
        model: Categoria,
        as: 'categoria',
        where: { ativa: true }
      }]
    }],
    order: [['data_adicao', 'DESC']]
  });
};

/**
 * Método estático para adicionar item ao carrinho
 * @param {number} usuarioId - ID do usuário
 * @param {number} produtoId - ID do produto
 * @param {number} quantidade - Quantidade a adicionar
 * @param {object} options - Opções adicionais
 * @returns {Carrinho} - Item do carrinho criado/atualizado
 */
Carrinho.addItem = async function(usuarioId, produtoId, quantidade = 1, options = {}) {
  const Produto = require('./Produto');
  
  // Verifica se o produto existe e está ativo
  const produto = await Produto.findByPk(produtoId);
  if (!produto || !produto.ativo) {
    throw new Error('Produto não encontrado ou inativo');
  }
  
  if (!produto.isDisponivel(quantidade)) {
    throw new Error('Produto não disponível na quantidade solicitada');
  }
  
  // Verifica se o item já existe no carrinho
  const itemExistente = await this.findOne({
    where: {
      usuario_id: usuarioId,
      produto_id: produtoId
    }
  });
  
  if (itemExistente) {
    // Atualiza a quantidade
    itemExistente.quantidade += quantidade;
    itemExistente.preco_unitario = produto.getPrecoAtual();
    if (options.observacoes) {
      itemExistente.observacoes = options.observacoes;
    }
    if (options.personalizacoes) {
      itemExistente.personalizacoes = options.personalizacoes;
    }
    await itemExistente.save();
    return itemExistente;
  } else {
    // Cria novo item no carrinho
    return await this.create({
      usuario_id: usuarioId,
      produto_id: produtoId,
      quantidade,
      preco_unitario: produto.getPrecoAtual(),
      observacoes: options.observacoes,
      personalizacoes: options.personalizacoes
    });
  }
};

/**
 * Método estático para atualizar quantidade do item
 * @param {number} usuarioId - ID do usuário
 * @param {number} produtoId - ID do produto
 * @param {number} quantidade - Nova quantidade
 * @returns {Carrinho|null} - Item atualizado ou null se removido
 */
Carrinho.updateQuantity = async function(usuarioId, produtoId, quantidade) {
  const item = await this.findOne({
    where: {
      usuario_id: usuarioId,
      produto_id: produtoId
    }
  });
  
  if (!item) {
    throw new Error('Item não encontrado no carrinho');
  }
  
  if (quantidade <= 0) {
    await item.destroy();
    return null;
  }
  
  // Verifica disponibilidade do produto
  const Produto = require('./Produto');
  const produto = await Produto.findByPk(produtoId);
  if (!produto.isDisponivel(quantidade)) {
    throw new Error('Quantidade não disponível em estoque');
  }
  
  item.quantidade = quantidade;
  await item.save();
  return item;
};

/**
 * Método estático para remover item do carrinho
 * @param {number} usuarioId - ID do usuário
 * @param {number} produtoId - ID do produto
 * @returns {boolean} - True se removido com sucesso
 */
Carrinho.removeItem = async function(usuarioId, produtoId) {
  const item = await this.findOne({
    where: {
      usuario_id: usuarioId,
      produto_id: produtoId
    }
  });
  
  if (!item) {
    return false;
  }
  
  await item.destroy();
  return true;
};

/**
 * Método estático para limpar carrinho do usuário
 * @param {number} usuarioId - ID do usuário
 * @returns {number} - Número de itens removidos
 */
Carrinho.clearCart = async function(usuarioId) {
  return await this.destroy({
    where: { usuario_id: usuarioId }
  });
};

/**
 * Método estático para contar itens no carrinho
 * @param {number} usuarioId - ID do usuário
 * @returns {number} - Número total de itens
 */
Carrinho.countItems = async function(usuarioId) {
  const result = await this.findOne({
    where: { usuario_id: usuarioId },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('quantidade')), 'total']
    ],
    raw: true
  });
  
  return parseInt(result?.total) || 0;
};

/**
 * Método estático para calcular total do carrinho
 * @param {number} usuarioId - ID do usuário
 * @returns {object} - Objeto com totais calculados
 */
Carrinho.calculateTotal = async function(usuarioId) {
  const itens = await this.findByUser(usuarioId);
  
  let subtotal = 0;
  let totalItens = 0;
  
  for (const item of itens) {
    const precoAtual = item.produto.getPrecoAtual();
    subtotal += precoAtual * item.quantidade;
    totalItens += item.quantidade;
  }
  
  return {
    subtotal,
    totalItens,
    itens: itens.length
  };
};

/**
 * Método para verificar se item ainda está disponível
 * @returns {boolean} - True se ainda disponível
 */
Carrinho.prototype.isDisponivel = function() {
  return this.produto && this.produto.isDisponivel(this.quantidade);
};

/**
 * Método para obter subtotal do item
 * @returns {number} - Subtotal do item
 */
Carrinho.prototype.getSubtotal = function() {
  const precoAtual = this.produto ? this.produto.getPrecoAtual() : this.preco_unitario;
  return precoAtual * this.quantidade;
};

/**
 * Método para obter dados públicos do item do carrinho
 * @returns {object} - Dados públicos do item
 */
Carrinho.prototype.toPublicJSON = function() {
  return {
    id: this.id,
    quantidade: this.quantidade,
    preco_unitario: this.produto ? this.produto.getPrecoAtual() : this.preco_unitario,
    subtotal: this.getSubtotal(),
    observacoes: this.observacoes,
    personalizacoes: this.personalizacoes,
    disponivel: this.isDisponivel(),
    produto: this.produto ? this.produto.toPublicJSON() : null
  };
};

module.exports = Carrinho;