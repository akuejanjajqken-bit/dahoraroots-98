const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Pedido - Representa os pedidos dos clientes
 * Gerencia todo o ciclo de vida de um pedido
 */
const Pedido = sequelize.define('Pedido', {
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
  numero_pedido: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      name: 'numero_pedido_unique',
      msg: 'Número do pedido deve ser único'
    },
    comment: 'Número único do pedido (ex: PED-2024-001)'
  },
  status: {
    type: DataTypes.ENUM(
      'pendente',
      'confirmado',
      'processando',
      'preparando',
      'pronto',
      'enviado',
      'entregue',
      'cancelado',
      'reembolsado'
    ),
    allowNull: false,
    defaultValue: 'pendente',
    validate: {
      isIn: {
        args: [[
          'pendente',
          'confirmado',
          'processando',
          'preparando',
          'pronto',
          'enviado',
          'entregue',
          'cancelado',
          'reembolsado'
        ]],
        msg: 'Status inválido'
      }
    }
  },
  valor_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.01],
        msg: 'Valor total deve ser maior que zero'
      }
    }
  },
  valor_produtos: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.01],
        msg: 'Valor dos produtos deve ser maior que zero'
      }
    }
  },
  valor_frete: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Valor do frete não pode ser negativo'
      }
    }
  },
  valor_desconto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Valor do desconto não pode ser negativo'
      }
    }
  },
  valor_taxa: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Taxas adicionais (ex: taxa de entrega expressa)'
  },
  metodo_pagamento: {
    type: DataTypes.ENUM(
      'pix',
      'cartao_credito',
      'cartao_debito',
      'boleto',
      'dinheiro',
      'transferencia'
    ),
    allowNull: false,
    validate: {
      isIn: {
        args: [[
          'pix',
          'cartao_credito',
          'cartao_debito',
          'boleto',
          'dinheiro',
          'transferencia'
        ]],
        msg: 'Método de pagamento inválido'
      }
    }
  },
  status_pagamento: {
    type: DataTypes.ENUM(
      'pendente',
      'processando',
      'aprovado',
      'rejeitado',
      'cancelado',
      'reembolsado'
    ),
    allowNull: false,
    defaultValue: 'pendente',
    validate: {
      isIn: {
        args: [[
          'pendente',
          'processando',
          'aprovado',
          'rejeitado',
          'cancelado',
          'reembolsado'
        ]],
        msg: 'Status de pagamento inválido'
      }
    }
  },
  endereco_entrega: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Dados do endereço de entrega',
    validate: {
      isValidAddress(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Endereço de entrega é obrigatório');
        }
        
        const required = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
        for (const field of required) {
          if (!value[field]) {
            throw new Error(`Campo ${field} é obrigatório no endereço`);
          }
        }
      }
    }
  },
  data_pedido: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  data_confirmacao: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_preparacao: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_envio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_entrega: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data_cancelamento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  codigo_rastreio: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Código de rastreamento da entrega'
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observações do cliente'
  },
  observacoes_internas: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observações internas da loja'
  },
  cupom_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'cupons',
      key: 'id'
    }
  },
  taxa_entrega: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Taxa de entrega específica'
  },
  prazo_entrega: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Prazo de entrega em dias úteis'
  },
  tipo_entrega: {
    type: DataTypes.ENUM('normal', 'expressa', 'agendada'),
    allowNull: false,
    defaultValue: 'normal'
  },
  data_agendamento: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data agendada para entrega'
  },
  horario_agendamento: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Horário agendado para entrega'
  },
  entrega_confirmada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  avaliacao_entrega: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  comentario_entrega: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['usuario_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['data_pedido']
    },
    {
      fields: ['numero_pedido']
    },
    {
      fields: ['codigo_rastreio']
    }
  ]
});

/**
 * Hook executado antes de criar o pedido
 * Gera o número do pedido automaticamente
 */
Pedido.beforeCreate = async (pedido) => {
  if (!pedido.numero_pedido) {
    const ano = new Date().getFullYear();
    const count = await Pedido.count({
      where: {
        data_pedido: {
          [sequelize.Sequelize.Op.gte]: new Date(`${ano}-01-01`),
          [sequelize.Sequelize.Op.lt]: new Date(`${ano + 1}-01-01`)
        }
      }
    });
    
    pedido.numero_pedido = `PED-${ano}-${String(count + 1).padStart(4, '0')}`;
  }
};

/**
 * Método estático para buscar pedidos por usuário
 * @param {number} usuarioId - ID do usuário
 * @param {object} options - Opções de busca
 * @returns {Array} - Lista de pedidos do usuário
 */
Pedido.findByUser = async function(usuarioId, options = {}) {
  const Usuario = require('./Usuario');
  const ItemPedido = require('./ItemPedido');
  const Produto = require('./Produto');
  
  const defaultOptions = {
    where: { usuario_id: usuarioId },
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome_completo', 'email']
      },
      {
        model: ItemPedido,
        as: 'itens',
        include: [{
          model: Produto,
          as: 'produto',
          attributes: ['id', 'nome', 'slug', 'imagens']
        }]
      }
    ],
    order: [['data_pedido', 'DESC']]
  };
  
  return await this.findAll({
    ...defaultOptions,
    ...options
  });
};

/**
 * Método estático para buscar pedido por número
 * @param {string} numeroPedido - Número do pedido
 * @returns {Pedido|null} - Pedido encontrado ou null
 */
Pedido.findByNumber = async function(numeroPedido) {
  const Usuario = require('./Usuario');
  const ItemPedido = require('./ItemPedido');
  const Produto = require('./Produto');
  
  return await this.findOne({
    where: { numero_pedido: numeroPedido },
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id', 'nome_completo', 'email', 'telefone']
      },
      {
        model: ItemPedido,
        as: 'itens',
        include: [{
          model: Produto,
          as: 'produto',
          attributes: ['id', 'nome', 'slug', 'imagens', 'peso']
        }]
      }
    ]
  });
};

/**
 * Método para atualizar status do pedido
 * @param {string} novoStatus - Novo status do pedido
 * @param {string} observacoes - Observações da mudança
 */
Pedido.prototype.atualizarStatus = async function(novoStatus, observacoes = null) {
  const statusAnterior = this.status;
  this.status = novoStatus;
  
  // Atualiza data específica baseada no status
  const agora = new Date();
  switch (novoStatus) {
    case 'confirmado':
      this.data_confirmacao = agora;
      break;
    case 'preparando':
      this.data_preparacao = agora;
      break;
    case 'enviado':
      this.data_envio = agora;
      break;
    case 'entregue':
      this.data_entrega = agora;
      this.entrega_confirmada = true;
      break;
    case 'cancelado':
      this.data_cancelamento = agora;
      break;
  }
  
  if (observacoes) {
    this.observacoes_internas = this.observacoes_internas 
      ? `${this.observacoes_internas}\n[${agora.toISOString()}] ${observacoes}`
      : `[${agora.toISOString()}] ${observacoes}`;
  }
  
  await this.save();
  
  // Log da mudança de status
  console.log(`Pedido ${this.numero_pedido}: ${statusAnterior} → ${novoStatus}`);
};

/**
 * Método para cancelar pedido
 * @param {string} motivo - Motivo do cancelamento
 */
Pedido.prototype.cancelar = async function(motivo = 'Cancelado pelo cliente') {
  if (['entregue', 'cancelado', 'reembolsado'].includes(this.status)) {
    throw new Error('Não é possível cancelar pedido com status atual');
  }
  
  await this.atualizarStatus('cancelado', `Cancelamento: ${motivo}`);
};

/**
 * Método para confirmar entrega
 * @param {number} avaliacao - Avaliação da entrega (1-5)
 * @param {string} comentario - Comentário sobre a entrega
 */
Pedido.prototype.confirmarEntrega = async function(avaliacao, comentario = null) {
  if (this.status !== 'entregue') {
    throw new Error('Pedido deve estar com status "entregue" para confirmar entrega');
  }
  
  this.entrega_confirmada = true;
  this.avaliacao_entrega = avaliacao;
  this.comentario_entrega = comentario;
  
  await this.save();
};

/**
 * Método para calcular totais do pedido
 * @returns {object} - Objeto com os totais calculados
 */
Pedido.prototype.calcularTotais = function() {
  const subtotal = this.valor_produtos;
  const desconto = this.valor_desconto;
  const frete = this.valor_frete;
  const taxa = this.valor_taxa || 0;
  
  const total = subtotal - desconto + frete + taxa;
  
  return {
    subtotal,
    desconto,
    frete,
    taxa,
    total
  };
};

/**
 * Método para verificar se pedido pode ser cancelado
 * @returns {boolean} - True se pode ser cancelado
 */
Pedido.prototype.podeSerCancelado = function() {
  return !['entregue', 'cancelado', 'reembolsado'].includes(this.status);
};

/**
 * Método para obter tempo decorrido desde o pedido
 * @returns {object} - Tempo decorrido em diferentes unidades
 */
Pedido.prototype.getTempoDecorrido = function() {
  const agora = new Date();
  const diferenca = agora - this.data_pedido;
  
  const segundos = Math.floor(diferenca / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  return { segundos, minutos, horas, dias };
};

/**
 * Método para obter dados públicos do pedido
 * @returns {object} - Dados públicos do pedido
 */
Pedido.prototype.toPublicJSON = function() {
  const pedido = this.toJSON();
  return {
    ...pedido,
    totais: this.calcularTotais(),
    tempo_decorrido: this.getTempoDecorrido(),
    pode_cancelar: this.podeSerCancelado()
  };
};

module.exports = Pedido;