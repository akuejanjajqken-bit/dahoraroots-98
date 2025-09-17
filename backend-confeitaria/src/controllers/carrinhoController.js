const { Carrinho, Produto, Categoria } = require('../models');

/**
 * Controller do Carrinho
 * Gerencia operações do carrinho de compras
 */
class CarrinhoController {
  /**
   * Obtém itens do carrinho do usuário
   * GET /api/cart
   */
  static async getCart(req, res, next) {
    try {
      const usuarioId = req.user.id;

      const itens = await Carrinho.findByUser(usuarioId);
      const totais = await Carrinho.calculateTotal(usuarioId);

      res.json({
        success: true,
        data: {
          itens: itens.map(item => item.toPublicJSON()),
          totais
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Adiciona item ao carrinho
   * POST /api/cart/add
   */
  static async addItem(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { produto_id, quantidade = 1, observacoes, personalizacoes } = req.body;

      // Verifica se o produto existe
      const produto = await Produto.findByPk(produto_id, {
        include: [{
          model: Categoria,
          as: 'categoria',
          where: { ativa: true }
        }]
      });

      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      if (!produto.ativo) {
        return res.status(400).json({
          success: false,
          message: 'Produto não está disponível'
        });
      }

      if (!produto.disponivel_venda) {
        return res.status(400).json({
          success: false,
          message: 'Produto não está disponível para venda online'
        });
      }

      if (!produto.isDisponivel(quantidade)) {
        return res.status(400).json({
          success: false,
          message: 'Quantidade não disponível em estoque'
        });
      }

      // Adiciona item ao carrinho
      const item = await Carrinho.addItem(usuarioId, produto_id, quantidade, {
        observacoes,
        personalizacoes
      });

      // Recalcula totais
      const totais = await Carrinho.calculateTotal(usuarioId);

      res.json({
        success: true,
        message: 'Item adicionado ao carrinho!',
        data: {
          item: item.toPublicJSON(),
          totais
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza quantidade de item no carrinho
   * PUT /api/cart/update/:produto_id
   */
  static async updateItem(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { produto_id } = req.params;
      const { quantidade } = req.body;

      if (quantidade < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantidade não pode ser negativa'
        });
      }

      const item = await Carrinho.updateQuantity(usuarioId, parseInt(produto_id), quantidade);

      // Recalcula totais
      const totais = await Carrinho.calculateTotal(usuarioId);

      if (item) {
        res.json({
          success: true,
          message: 'Item atualizado no carrinho!',
          data: {
            item: item.toPublicJSON(),
            totais
          }
        });
      } else {
        res.json({
          success: true,
          message: 'Item removido do carrinho!',
          data: {
            totais
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove item do carrinho
   * DELETE /api/cart/remove/:produto_id
   */
  static async removeItem(req, res, next) {
    try {
      const usuarioId = req.user.id;
      const { produto_id } = req.params;

      const removido = await Carrinho.removeItem(usuarioId, parseInt(produto_id));

      if (!removido) {
        return res.status(404).json({
          success: false,
          message: 'Item não encontrado no carrinho'
        });
      }

      // Recalcula totais
      const totais = await Carrinho.calculateTotal(usuarioId);

      res.json({
        success: true,
        message: 'Item removido do carrinho!',
        data: {
          totais
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Limpa o carrinho do usuário
   * DELETE /api/cart/clear
   */
  static async clearCart(req, res, next) {
    try {
      const usuarioId = req.user.id;

      const itensRemovidos = await Carrinho.clearCart(usuarioId);

      res.json({
        success: true,
        message: 'Carrinho limpo com sucesso!',
        data: {
          itens_removidos: itensRemovidos
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtém contagem de itens no carrinho
   * GET /api/cart/count
   */
  static async getCount(req, res, next) {
    try {
      const usuarioId = req.user.id;

      const totalItens = await Carrinho.countItems(usuarioId);

      res.json({
        success: true,
        data: {
          total_itens: totalItens
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Valida itens do carrinho
   * POST /api/cart/validate
   */
  static async validateCart(req, res, next) {
    try {
      const usuarioId = req.user.id;

      const itens = await Carrinho.findByUser(usuarioId);
      const problemas = [];

      for (const item of itens) {
        // Verifica se produto ainda existe e está ativo
        if (!item.produto) {
          problemas.push({
            item_id: item.id,
            produto_id: item.produto_id,
            problema: 'Produto não encontrado',
            acao: 'remover'
          });
          continue;
        }

        if (!item.produto.ativo) {
          problemas.push({
            item_id: item.id,
            produto_id: item.produto_id,
            produto_nome: item.produto.nome,
            problema: 'Produto não está mais disponível',
            acao: 'remover'
          });
          continue;
        }

        if (!item.produto.disponivel_venda) {
          problemas.push({
            item_id: item.id,
            produto_id: item.produto_id,
            produto_nome: item.produto.nome,
            problema: 'Produto não está disponível para venda online',
            acao: 'remover'
          });
          continue;
        }

        // Verifica estoque
        if (!item.produto.isDisponivel(item.quantidade)) {
          const estoqueDisponivel = item.produto.estoque;
          problemas.push({
            item_id: item.id,
            produto_id: item.produto_id,
            produto_nome: item.produto.nome,
            problema: `Estoque insuficiente. Disponível: ${estoqueDisponivel}`,
            acao: 'ajustar_quantidade',
            quantidade_disponivel: estoqueDisponivel
          });
        }

        // Verifica se preço mudou
        const precoAtual = item.produto.getPrecoAtual();
        if (item.preco_unitario !== precoAtual) {
          problemas.push({
            item_id: item.id,
            produto_id: item.produto_id,
            produto_nome: item.produto.nome,
            problema: 'Preço do produto foi alterado',
            acao: 'atualizar_preco',
            preco_anterior: item.preco_unitario,
            preco_atual: precoAtual
          });
        }
      }

      res.json({
        success: true,
        data: {
          itens_validados: itens.length,
          problemas,
          carrinho_valido: problemas.length === 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aplica correções automáticas no carrinho
   * POST /api/cart/fix
   */
  static async fixCart(req, res, next) {
    try {
      const usuarioId = req.user.id;

      const itens = await Carrinho.findByUser(usuarioId);
      const correcoes = [];

      for (const item of itens) {
        // Remove produtos inexistentes ou inativos
        if (!item.produto || !item.produto.ativo || !item.produto.disponivel_venda) {
          await item.destroy();
          correcoes.push({
            acao: 'removido',
            produto_id: item.produto_id,
            motivo: 'Produto não disponível'
          });
          continue;
        }

        // Ajusta quantidade se estoque insuficiente
        if (!item.produto.isDisponivel(item.quantidade)) {
          const estoqueDisponivel = item.produto.estoque;
          if (estoqueDisponivel > 0) {
            item.quantidade = estoqueDisponivel;
            await item.save();
            correcoes.push({
              acao: 'quantidade_ajustada',
              produto_id: item.produto_id,
              quantidade_anterior: item.quantidade,
              quantidade_nova: estoqueDisponivel
            });
          } else {
            await item.destroy();
            correcoes.push({
              acao: 'removido',
              produto_id: item.produto_id,
              motivo: 'Produto sem estoque'
            });
          }
          continue;
        }

        // Atualiza preço se mudou
        const precoAtual = item.produto.getPrecoAtual();
        if (item.preco_unitario !== precoAtual) {
          item.preco_unitario = precoAtual;
          await item.save();
          correcoes.push({
            acao: 'preco_atualizado',
            produto_id: item.produto_id,
            preco_anterior: item.preco_unitario,
            preco_novo: precoAtual
          });
        }
      }

      // Recalcula totais
      const totais = await Carrinho.calculateTotal(usuarioId);

      res.json({
        success: true,
        message: 'Carrinho corrigido com sucesso!',
        data: {
          correcoes,
          totais
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CarrinhoController;