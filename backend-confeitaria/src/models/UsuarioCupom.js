const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo UsuarioCupom - Representa o uso de cupons por usuários
 * Controla quantas vezes cada usuário usou cada cupom
 */
const UsuarioCupom = sequelize.define('UsuarioCupom', {
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
    }
  },
  cupom_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cupons',
      key: 'id'
    }
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'pedidos',
      key: 'id'
    }
  },
  valor_desconto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Valor do desconto aplicado'
  },
  data_uso: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuario_cupons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['usuario_id']
    },
    {
      fields: ['cupom_id']
    },
    {
      fields: ['pedido_id']
    },
    {
      unique: true,
      fields: ['usuario_id', 'cupom_id', 'pedido_id']
    }
  ]
});

module.exports = UsuarioCupom;