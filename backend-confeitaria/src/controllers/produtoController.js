const { Produto, Categoria, Avaliacao } = require('../models');
const { Op } = require('sequelize');

/**
 * Controller de Produtos
 * Gerencia operações relacionadas aos produtos
 */
class ProdutoController {
  /**
   * Lista produtos com paginação e filtros
   * GET /api/products
   */
  static async list(req, res, next) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = 'created_at',
        order = 'DESC',
        search,
        categoria,
        preco_min,
        preco_max,
        destaque,
        ativo = true
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Filtros
      if (search) {
        whereClause[Op.or] = [
          { nome: { [Op.like]: `%${search}%` } },
          { descricao: { [Op.like]: `%${search}%` } },
          { descricao_curta: { [Op.like]: `%${search}%` } },
          { ingredientes: { [Op.like]: `%${search}%` } },
          { palavras_chave: { [Op.like]: `%${search}%` } }
        ];
      }

      if (categoria) {
        whereClause.categoria_id = categoria;
      }

      if (preco_min || preco_max) {
        whereClause.preco = {};
        if (preco_min) whereClause.preco[Op.gte] = preco_min;
        if (preco_max) whereClause.preco[Op.lte] = preco_max;
      }

      if (destaque !== undefined) {
        whereClause.destaque = destaque === 'true';
      }

      if (ativo !== undefined) {
        whereClause.ativo = ativo === 'true';
      }

      // Busca produtos
      const { count, rows: produtos } = await Produto.findAndCountAll({
        where: whereClause,
        include: [{
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nome', 'slug', 'cor_hex']
        }],
        order: [[sort, order.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });

      // Calcula estatísticas de avaliações para cada produto
      const produtosComStats = await Promise.all(
        produtos.map(async (produto) => {
          const stats = await Avaliacao.getProductStats(produto.id);
          return {
            ...produto.toPublicJSON(),
            avaliacoes: stats
          };
        })
      );

      res.json({
        success: true,
        data: {
          produtos: produtosComStats,
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
   * Busca produto por slug
   * GET /api/products/:slug
   */
  static async getBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      const produto = await Produto.findBySlug(slug);
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Incrementa visualizações
      await produto.incrementarVisualizacoes();

      // Busca avaliações do produto
      const avaliacoes = await Avaliacao.findByProduct(produto.id, {
        limit: 10
      });

      // Calcula estatísticas de avaliações
      const stats = await Avaliacao.getProductStats(produto.id);

      // Busca produtos relacionados (mesma categoria)
      const produtosRelacionados = await Produto.findByCategory(produto.categoria_id, {
        where: {
          id: { [Op.ne]: produto.id },
          ativo: true
        },
        limit: 4
      });

      res.json({
        success: true,
        data: {
          produto: produto.toPublicJSON(),
          avaliacoes: {
            lista: avaliacoes.map(av => av.toPublicJSON()),
            estatisticas: stats
          },
          produtos_relacionados: produtosRelacionados.map(p => p.toPublicJSON())
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca produtos por categoria
   * GET /api/products/category/:category
   */
  static async getByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 20, sort = 'created_at', order = 'DESC' } = req.query;

      // Busca categoria por slug
      const categoria = await Categoria.findBySlug(category);
      if (!categoria) {
        return res.status(404).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      const offset = (page - 1) * limit;

      // Busca produtos da categoria
      const { count, rows: produtos } = await Produto.findAndCountAll({
        where: {
          categoria_id: categoria.id,
          ativo: true,
          disponivel_venda: true
        },
        include: [{
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nome', 'slug', 'cor_hex']
        }],
        order: [[sort, order.toUpperCase()]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });

      // Calcula estatísticas de avaliações
      const produtosComStats = await Promise.all(
        produtos.map(async (produto) => {
          const stats = await Avaliacao.getProductStats(produto.id);
          return {
            ...produto.toPublicJSON(),
            avaliacoes: stats
          };
        })
      );

      res.json({
        success: true,
        data: {
          categoria: {
            id: categoria.id,
            nome: categoria.nome,
            slug: categoria.slug,
            descricao: categoria.descricao,
            cor_hex: categoria.cor_hex
          },
          produtos: produtosComStats,
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
   * Busca produtos em destaque
   * GET /api/products/featured
   */
  static async getFeatured(req, res, next) {
    try {
      const { limit = 10 } = req.query;

      const produtos = await Produto.findFeatured(parseInt(limit));

      // Calcula estatísticas de avaliações
      const produtosComStats = await Promise.all(
        produtos.map(async (produto) => {
          const stats = await Avaliacao.getProductStats(produto.id);
          return {
            ...produto.toPublicJSON(),
            avaliacoes: stats
          };
        })
      );

      res.json({
        success: true,
        data: {
          produtos: produtosComStats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Busca produtos (full-text search)
   * GET /api/products/search
   */
  static async search(req, res, next) {
    try {
      const { q, page = 1, limit = 20 } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca deve ter pelo menos 2 caracteres'
        });
      }

      const offset = (page - 1) * limit;
      const produtos = await Produto.search(q.trim(), {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Calcula estatísticas de avaliações
      const produtosComStats = await Promise.all(
        produtos.map(async (produto) => {
          const stats = await Avaliacao.getProductStats(produto.id);
          return {
            ...produto.toPublicJSON(),
            avaliacoes: stats
          };
        })
      );

      res.json({
        success: true,
        data: {
          produtos: produtosComStats,
          query: q.trim(),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: produtosComStats.length
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cria novo produto (admin)
   * POST /api/products
   */
  static async create(req, res, next) {
    try {
      const produtoData = req.body;

      // Verifica se categoria existe
      const categoria = await Categoria.findByPk(produtoData.categoria_id);
      if (!categoria) {
        return res.status(400).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }

      const produto = await Produto.create(produtoData);

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso!',
        data: {
          produto: produto.toPublicJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza produto (admin)
   * PUT /api/products/:id
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const produtoData = req.body;

      const produto = await Produto.findByPk(id);
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Verifica se categoria existe (se fornecida)
      if (produtoData.categoria_id) {
        const categoria = await Categoria.findByPk(produtoData.categoria_id);
        if (!categoria) {
          return res.status(400).json({
            success: false,
            message: 'Categoria não encontrada'
          });
        }
      }

      await produto.update(produtoData);

      res.json({
        success: true,
        message: 'Produto atualizado com sucesso!',
        data: {
          produto: produto.toPublicJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove produto (admin)
   * DELETE /api/products/:id
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const produto = await Produto.findByPk(id);
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Verifica se produto pode ser excluído
      // (não tem pedidos associados, etc.)
      const temPedidos = await produto.countItens_pedido() > 0;
      if (temPedidos) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir produto que já foi vendido'
        });
      }

      await produto.destroy();

      res.json({
        success: true,
        message: 'Produto excluído com sucesso!'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualiza estoque do produto (admin)
   * PUT /api/products/:id/stock
   */
  static async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { estoque, estoque_minimo } = req.body;

      const produto = await Produto.findByPk(id);
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      if (estoque !== undefined) produto.estoque = estoque;
      if (estoque_minimo !== undefined) produto.estoque_minimo = estoque_minimo;

      await produto.save();

      res.json({
        success: true,
        message: 'Estoque atualizado com sucesso!',
        data: {
          produto: {
            id: produto.id,
            nome: produto.nome,
            estoque: produto.estoque,
            estoque_minimo: produto.estoque_minimo,
            estoque_baixo: produto.isEstoqueBaixo()
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lista produtos com estoque baixo (admin)
   * GET /api/products/low-stock
   */
  static async getLowStock(req, res, next) {
    try {
      const produtos = await Produto.findAll({
        where: {
          ativo: true,
          [Op.and]: [
            sequelize.literal('estoque <= estoque_minimo')
          ]
        },
        include: [{
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nome', 'slug']
        }],
        order: [['estoque', 'ASC']]
      });

      res.json({
        success: true,
        data: {
          produtos: produtos.map(produto => ({
            id: produto.id,
            nome: produto.nome,
            estoque: produto.estoque,
            estoque_minimo: produto.estoque_minimo,
            categoria: produto.categoria
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProdutoController;