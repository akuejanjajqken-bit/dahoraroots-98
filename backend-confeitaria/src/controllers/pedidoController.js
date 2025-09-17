const { Pedido, ItemPedido, Carrinho, Produto, Cupom, UsuarioCupom } = require('../models');
const { sendEmail } = require('../services/emailService');

/**
 * Controller de Pedidos
 * Gerencia operações relacionadas aos pedidos
 */
class PedidoController {
  /**
   * Lista pedidos do usuário
   * GET /api/orders
   */
  static async list(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const whereClause = { usuario_id: usuarioId };
      if (status) {
        whereClause.status = status;
      }

      const offset = (page - 1) * limit;

      const { count, rows: pedidos } = await Pedido.findAndCountAll({
        where: whereClause,
        include: [{
          model: ItemPedido,
          as: 'itens',
          include: [{
            model: Produto,
            as: 'produto',
            attributes: ['id', 'nome', 'slug', 'imagens']
          }]
        }],
        order: [['data_pedido', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });

      res.json({
        success: true,
        data: {
          pedidos: pedidos.map(pedido => pedido.toPublicJSON()),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém detalhes de um pedido
   * GET /api/orders/:id
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;

      const pedido = await Pedido.findOne({
        where: {
          id: id,
          usuario_id: usuarioId
        },
        include: [{
          model: ItemPedido,
          as: 'itens',
          include: [{
            model: Produto,
            as: 'produto',
            attributes: ['id', 'nome', 'slug', 'imagens', 'peso']
          }]
        }]
      });

      if (!pedido) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          pedido: pedido.toPublicJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria novo pedido
   * POST /api/orders/create
   */
  static async create(req, res, next) {
    const transaction = await Pedido.sequelize.transaction();

    try {
      const usuarioId = req.user.id;
      const {
        endereco_entrega,
        metodo_pagamento,
        observacoes,
        cupom_codigo,
        tipo_entrega,
        data_agendamento,
        horario_agendamento
      } = req.body;

      // Valida e obtém itens do carrinho
      const itensCarrinho = await Carrinho.findByUser(usuarioId);
      if (itensCarrinho.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Carrinho está vazio'
        });
      }

      // Valida disponibilidade dos produtos
      for (const item of itensCarrinho) {
        if (!item.produto || !item.produto.isDisponivel(item.quantidade)) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Produto "${item.produto?.nome || 'N/A'}" não está disponível na quantidade solicitada`
          });
        }
      }

      // Calcula valores
      let valorProdutos = 0;
      for (const item of itensCarrinho) {
        valorProdutos += item.produto.getPrecoAtual() * item.quantidade;
      }

      // Aplica cupom se fornecido
      let cupom = null;
      let valorDesconto = 0;
      if (cupom_codigo) {
        cupom = await Cupom.findValidByCode(cupom_codigo, usuarioId, valorProdutos);
        if (!cupom) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Cupom inválido ou não aplicável'
          });
        }

        const desconto = cupom.calcularDesconto(valorProdutos);
        valorDesconto = desconto.valor_desconto;
      }

      // Calcula frete (implementar lógica de frete)
      const valorFrete = await this.calcularFrete(endereco_entrega, itensCarrinho, tipo_entrega);

      // Calcula total
      const valorTotal = valorProdutos - valorDesconto + valorFrete;

      // Cria o pedido
      const pedido = await Pedido.create({
        usuario_id: usuarioId,
        valor_total: valorTotal,
        valor_produtos: valorProdutos,
        valor_frete: valorFrete,
        valor_desconto: valorDesconto,
        metodo_pagamento,
        endereco_entrega,
        observacoes,
        cupom_id: cupom?.id,
        tipo_entrega,
        data_agendamento,
        horario_agendamento
      }, { transaction });

      // Cria itens do pedido
      const itensPedido = [];
      for (const item of itensCarrinho) {
        const itemPedido = await ItemPedido.create({
          pedido_id: pedido.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: item.produto.getPrecoAtual(),
          nome_produto: item.produto.nome,
          observacoes: item.observacoes,
          personalizacoes: item.personalizacoes
        }, { transaction });

        // Decrementa estoque
        await item.produto.decrementarEstoque(item.quantidade);

        itensPedido.push(itemPedido);
      }

      // Usa o cupom se aplicado
      if (cupom) {
        await cupom.use(usuarioId, pedido.id);
      }

      // Limpa o carrinho
      await Carrinho.clearCart(usuarioId);

      // Confirma transação
      await transaction.commit();

      // Envia email de confirmação
      try {
        await sendEmail({
          to: req.user.email,
          subject: `Pedido Confirmado - ${pedido.numero_pedido}`,
          template: 'order-confirmation',
          data: {
            pedido: pedido.toPublicJSON(),
            itens: itensPedido.map(item => item.toPublicJSON())
          }
        });
      } catch (emailError) {
        console.error('Erro ao enviar email de confirmação:', emailError);
      }

      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso!',
        data: {
          pedido: pedido.toPublicJSON(),
          itens: itensPedido.map(item => item.toPublicJSON())
        }
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * Atualiza status do pedido (admin)
   * PUT /api/orders/:id/status
   */
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, observacoes } = req.body;

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      await pedido.atualizarStatus(status, observacoes);

      // Envia notificação por email se necessário
      if (['confirmado', 'enviado', 'entregue'].includes(status)) {
        try {
          await sendEmail({
            to: pedido.usuario.email,
            subject: `Atualização do Pedido ${pedido.numero_pedido}`,
            template: 'order-status-update',
            data: {
              pedido: pedido.toPublicJSON(),
              novo_status: status,
              observacoes
            }
          });
        } catch (emailError) {
          console.error('Erro ao enviar email de atualização:', emailError);
        }
      }

      res.json({
        success: true,
        message: 'Status do pedido atualizado com sucesso!',
        data: {
          pedido: pedido.toPublicJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancela pedido
   * PUT /api/orders/:id/cancel
   */
  static async cancel(req, res, next) {
    const transaction = await Pedido.sequelize.transaction();

    try {
      const { id } = req.params;
      const { motivo } = req.body;
      const usuarioId = req.user.id;

      const pedido = await Pedido.findOne({
        where: {
          id: id,
          usuario_id: usuarioId
        },
        include: [{
          model: ItemPedido,
          as: 'itens',
          include: [{
            model: Produto,
            as: 'produto'
          }]
        }]
      });

      if (!pedido) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      if (!pedido.podeSerCancelado()) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Pedido não pode ser cancelado no status atual'
        });
      }

      // Cancela o pedido
      await pedido.cancelar(motivo);

      // Restaura estoque dos produtos
      for (const item of pedido.itens) {
        if (item.produto) {
          item.produto.estoque += item.quantidade;
          item.produto.vendas -= item.quantidade;
          await item.produto.save({ transaction });
        }
      }

      // Confirma transação
      await transaction.commit();

      // Envia email de cancelamento
      try {
        await sendEmail({
          to: pedido.usuario.email,
          subject: `Pedido Cancelado - ${pedido.numero_pedido}`,
          template: 'order-cancellation',
          data: {
            pedido: pedido.toPublicJSON(),
            motivo
          }
        });
      } catch (emailError) {
        console.error('Erro ao enviar email de cancelamento:', emailError);
      }

      res.json({
        success: true,
        message: 'Pedido cancelado com sucesso!',
        data: {
          pedido: pedido.toPublicJSON()
        }
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  /**
   * Confirma entrega do pedido
   * PUT /api/orders/:id/confirm-delivery
   */
  static async confirmDelivery(req, res, next) {
    try {
      const { id } = req.params;
      const { avaliacao, comentario } = req.body;
      const usuarioId = req.user.id;

      const pedido = await Pedido.findOne({
        where: {
          id: id,
          usuario_id: usuarioId,
          status: 'entregue'
        }
      });

      if (!pedido) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado ou não foi entregue'
        });
      }

      await pedido.confirmarEntrega(avaliacao, comentario);

      res.json({
        success: true,
        message: 'Entrega confirmada com sucesso!',
        data: {
          pedido: pedido.toPublicJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calcula frete para o pedido
   * POST /api/orders/calculate-shipping
   */
  static async calculateShipping(req, res, next) {
    try {
      const { endereco_entrega, itens, tipo_entrega = 'normal' } = req.body;

      // Implementar lógica de cálculo de frete
      const valorFrete = await this.calcularFrete(endereco_entrega, itens, tipo_entrega);

      res.json({
        success: true,
        data: {
          valor_frete: valorFrete,
          tipo_entrega,
          prazo_entrega: this.getPrazoEntrega(tipo_entrega)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Método auxiliar para calcular frete
   * @private
   */
  static async calcularFrete(endereco, itens, tipoEntrega) {
    // Implementação básica - em produção, integrar com API dos Correios
    let valorBase = 15.00; // Frete base
    
    // Calcula peso total
    let pesoTotal = 0;
    for (const item of itens) {
      const produto = item.produto || await Produto.findByPk(item.produto_id);
      if (produto && produto.peso) {
        pesoTotal += produto.peso * item.quantidade;
      }
    }

    // Ajusta frete por peso
    if (pesoTotal > 1000) { // Mais de 1kg
      valorBase += (pesoTotal - 1000) / 1000 * 5; // R$ 5 por kg adicional
    }

    // Ajusta por tipo de entrega
    switch (tipoEntrega) {
      case 'expressa':
        valorBase *= 2;
        break;
      case 'agendada':
        valorBase *= 0.8;
        break;
    }

    // Frete grátis para pedidos acima de R$ 150
    const valorProdutos = itens.reduce((total, item) => {
      const produto = item.produto || {};
      return total + (produto.getPrecoAtual ? produto.getPrecoAtual() : 0) * item.quantidade;
    }, 0);

    if (valorProdutos >= 150) {
      return 0;
    }

    return Math.round(valorBase * 100) / 100; // Arredonda para 2 casas decimais
  }

  /**
   * Método auxiliar para obter prazo de entrega
   * @private
   */
  static getPrazoEntrega(tipoEntrega) {
    switch (tipoEntrega) {
      case 'expressa':
        return 1; // 1 dia útil
      case 'agendada':
        return 7; // 7 dias úteis
      default:
        return 3; // 3 dias úteis
    }
  }
}

module.exports = PedidoController;