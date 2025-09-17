const { sequelize } = require('../config/database');

// Importa todos os modelos
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Produto = require('./Produto');
const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');
const Endereco = require('./Endereco');
const Carrinho = require('./Carrinho');
const Avaliacao = require('./Avaliacao');
const Cupom = require('./Cupom');
const UsuarioCupom = require('./UsuarioCupom');

/**
 * Define as associações entre os modelos
 * Estabelece os relacionamentos do banco de dados
 */

// Usuario -> Endereco (1:N)
Usuario.hasMany(Endereco, {
  foreignKey: 'usuario_id',
  as: 'enderecos'
});
Endereco.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Usuario -> Pedido (1:N)
Usuario.hasMany(Pedido, {
  foreignKey: 'usuario_id',
  as: 'pedidos'
});
Pedido.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Usuario -> Carrinho (1:N)
Usuario.hasMany(Carrinho, {
  foreignKey: 'usuario_id',
  as: 'carrinho'
});
Carrinho.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Usuario -> Avaliacao (1:N)
Usuario.hasMany(Avaliacao, {
  foreignKey: 'usuario_id',
  as: 'avaliacoes'
});
Avaliacao.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Usuario -> UsuarioCupom (1:N)
Usuario.hasMany(UsuarioCupom, {
  foreignKey: 'usuario_id',
  as: 'usos_cupons'
});
UsuarioCupom.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});

// Categoria -> Produto (1:N)
Categoria.hasMany(Produto, {
  foreignKey: 'categoria_id',
  as: 'produtos'
});
Produto.belongsTo(Categoria, {
  foreignKey: 'categoria_id',
  as: 'categoria'
});

// Produto -> Carrinho (1:N)
Produto.hasMany(Carrinho, {
  foreignKey: 'produto_id',
  as: 'carrinho'
});
Carrinho.belongsTo(Produto, {
  foreignKey: 'produto_id',
  as: 'produto'
});

// Produto -> ItemPedido (1:N)
Produto.hasMany(ItemPedido, {
  foreignKey: 'produto_id',
  as: 'itens_pedido'
});
ItemPedido.belongsTo(Produto, {
  foreignKey: 'produto_id',
  as: 'produto'
});

// Produto -> Avaliacao (1:N)
Produto.hasMany(Avaliacao, {
  foreignKey: 'produto_id',
  as: 'avaliacoes'
});
Avaliacao.belongsTo(Produto, {
  foreignKey: 'produto_id',
  as: 'produto'
});

// Pedido -> ItemPedido (1:N)
Pedido.hasMany(ItemPedido, {
  foreignKey: 'pedido_id',
  as: 'itens'
});
ItemPedido.belongsTo(Pedido, {
  foreignKey: 'pedido_id',
  as: 'pedido'
});

// Pedido -> Avaliacao (1:N)
Pedido.hasMany(Avaliacao, {
  foreignKey: 'pedido_id',
  as: 'avaliacoes'
});
Avaliacao.belongsTo(Pedido, {
  foreignKey: 'pedido_id',
  as: 'pedido'
});

// Pedido -> UsuarioCupom (1:N)
Pedido.hasMany(UsuarioCupom, {
  foreignKey: 'pedido_id',
  as: 'usos_cupons'
});
UsuarioCupom.belongsTo(Pedido, {
  foreignKey: 'pedido_id',
  as: 'pedido'
});

// Cupom -> UsuarioCupom (1:N)
Cupom.hasMany(UsuarioCupom, {
  foreignKey: 'cupom_id',
  as: 'usos'
});
UsuarioCupom.belongsTo(Cupom, {
  foreignKey: 'cupom_id',
  as: 'cupom'
});

// Pedido -> Cupom (N:1) - Relacionamento opcional
Pedido.belongsTo(Cupom, {
  foreignKey: 'cupom_id',
  as: 'cupom'
});
Cupom.hasMany(Pedido, {
  foreignKey: 'cupom_id',
  as: 'pedidos'
});

/**
 * Exporta todos os modelos e a instância do Sequelize
 */
module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Produto,
  Pedido,
  ItemPedido,
  Endereco,
  Carrinho,
  Avaliacao,
  Cupom,
  UsuarioCupom
};