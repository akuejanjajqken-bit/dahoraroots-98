const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Produto - Representa os produtos da confeitaria
 * Inclui doces, bolos, tortas e outros itens
 */
const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome do produto é obrigatório'
      },
      len: {
        args: [2, 255],
        msg: 'Nome deve ter entre 2 e 255 caracteres'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  descricao_curta: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Descrição resumida para listagens'
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.01],
        msg: 'Preço deve ser maior que zero'
      },
      isDecimal: {
        msg: 'Preço deve ser um número decimal válido'
      }
    }
  },
  preco_promocional: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0.01],
        msg: 'Preço promocional deve ser maior que zero'
      },
      isDecimal: {
        msg: 'Preço promocional deve ser um número decimal válido'
      }
    }
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'Categoria é obrigatória'
      }
    }
  },
  estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Estoque não pode ser negativo'
      }
    }
  },
  estoque_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: {
        args: [0],
        msg: 'Estoque mínimo não pode ser negativo'
      }
    }
  },
  peso: {
    type: DataTypes.DECIMAL(8, 3),
    allowNull: true,
    comment: 'Peso em gramas',
    validate: {
      min: {
        args: [0],
        msg: 'Peso não pode ser negativo'
      }
    }
  },
  dimensoes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Dimensões: {largura, altura, profundidade} em cm',
    validate: {
      isValidDimensions(value) {
        if (value && typeof value === 'object') {
          const { largura, altura, profundidade } = value;
          if (largura && (largura < 0 || largura > 1000)) {
            throw new Error('Largura deve estar entre 0 e 1000 cm');
          }
          if (altura && (altura < 0 || altura > 1000)) {
            throw new Error('Altura deve estar entre 0 e 1000 cm');
          }
          if (profundidade && (profundidade < 0 || profundidade > 1000)) {
            throw new Error('Profundidade deve estar entre 0 e 1000 cm');
          }
        }
      }
    }
  },
  imagens: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de URLs das imagens do produto',
    validate: {
      isArray(value) {
        if (value && !Array.isArray(value)) {
          throw new Error('Imagens deve ser um array');
        }
      }
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      name: 'produto_slug_unique',
      msg: 'Este slug já está sendo usado'
    },
    validate: {
      notEmpty: {
        msg: 'Slug é obrigatório'
      },
      is: {
        args: /^[a-z0-9-]+$/,
        msg: 'Slug deve conter apenas letras minúsculas, números e hífens'
      }
    }
  },
  destaque: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Produto em destaque na homepage'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  disponivel_venda: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Disponível para venda online'
  },
  ingredientes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Lista de ingredientes do produto'
  },
  alergenos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array de alérgenos: [gluten, lactose, amendoim, etc]'
  },
  tempo_preparo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Tempo de preparo em minutos'
  },
  validade_dias: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Validade em dias após o preparo',
    validate: {
      min: {
        args: [1],
        msg: 'Validade deve ser pelo menos 1 dia'
      }
    }
  },
  temperatura_conservacao: {
    type: DataTypes.ENUM('ambiente', 'refrigerado', 'congelado'),
    allowNull: true,
    defaultValue: 'ambiente'
  },
  codigo_barras: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: {
      name: 'codigo_barras_unique',
      msg: 'Este código de barras já está sendo usado'
    }
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: {
      name: 'sku_unique',
      msg: 'Este SKU já está sendo usado'
    },
    comment: 'Código interno do produto'
  },
  meta_title: {
    type: DataTypes.STRING(60),
    allowNull: true,
    comment: 'Título para SEO'
  },
  meta_description: {
    type: DataTypes.STRING(160),
    allowNull: true,
    comment: 'Descrição para SEO'
  },
  palavras_chave: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Palavras-chave separadas por vírgula'
  },
  visualizacoes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Contador de visualizações do produto'
  },
  vendas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Contador de vendas do produto'
  }
}, {
  tableName: 'produtos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['categoria_id']
    },
    {
      fields: ['ativo']
    },
    {
      fields: ['destaque']
    },
    {
      fields: ['preco']
    },
    {
      fields: ['nome']
    },
    {
      fields: ['sku']
    },
    {
      fields: ['codigo_barras']
    }
  ]
});

/**
 * Hook executado antes de salvar o produto
 * Gera o slug automaticamente se não fornecido
 */
Produto.beforeSave = async (produto) => {
  if (produto.changed('nome') && !produto.slug) {
    produto.slug = produto.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim('-'); // Remove hífens do início e fim
  }
};

/**
 * Método estático para buscar produto por slug
 * @param {string} slug - Slug do produto
 * @returns {Produto|null} - Produto encontrado ou null
 */
Produto.findBySlug = async function(slug) {
  const Categoria = require('./Categoria');
  
  return await this.findOne({
    where: { 
      slug,
      ativo: true 
    },
    include: [{
      model: Categoria,
      as: 'categoria',
      where: { ativa: true }
    }]
  });
};

/**
 * Método estático para buscar produtos em destaque
 * @param {number} limit - Limite de produtos
 * @returns {Array} - Lista de produtos em destaque
 */
Produto.findFeatured = async function(limit = 10) {
  const Categoria = require('./Categoria');
  
  return await this.findAll({
    where: {
      destaque: true,
      ativo: true,
      disponivel_venda: true
    },
    include: [{
      model: Categoria,
      as: 'categoria',
      where: { ativa: true }
    }],
    order: [['created_at', 'DESC']],
    limit
  });
};

/**
 * Método estático para buscar produtos por categoria
 * @param {number} categoriaId - ID da categoria
 * @param {object} options - Opções de busca
 * @returns {Array} - Lista de produtos da categoria
 */
Produto.findByCategory = async function(categoriaId, options = {}) {
  const Categoria = require('./Categoria');
  const defaultOptions = {
    where: {
      categoria_id: categoriaId,
      ativo: true,
      disponivel_venda: true
    },
    include: [{
      model: Categoria,
      as: 'categoria',
      where: { ativa: true }
    }],
    order: [['destaque', 'DESC'], ['created_at', 'DESC']],
    limit: 20
  };
  
  return await this.findAll({
    ...defaultOptions,
    ...options
  });
};

/**
 * Método estático para busca full-text
 * @param {string} termo - Termo de busca
 * @param {object} options - Opções de busca
 * @returns {Array} - Lista de produtos encontrados
 */
Produto.search = async function(termo, options = {}) {
  const Categoria = require('./Categoria');
  const { Op } = require('sequelize');
  
  const whereClause = {
    ativo: true,
    disponivel_venda: true,
    [Op.or]: [
      { nome: { [Op.like]: `%${termo}%` } },
      { descricao: { [Op.like]: `%${termo}%` } },
      { descricao_curta: { [Op.like]: `%${termo}%` } },
      { ingredientes: { [Op.like]: `%${termo}%` } },
      { palavras_chave: { [Op.like]: `%${termo}%` } }
    ]
  };
  
  const defaultOptions = {
    where: whereClause,
    include: [{
      model: Categoria,
      as: 'categoria',
      where: { ativa: true }
    }],
    order: [['destaque', 'DESC'], ['visualizacoes', 'DESC']],
    limit: 20
  };
  
  return await this.findAll({
    ...defaultOptions,
    ...options
  });
};

/**
 * Método para obter preço atual (promocional ou normal)
 * @returns {number} - Preço atual do produto
 */
Produto.prototype.getPrecoAtual = function() {
  return this.preco_promocional || this.preco;
};

/**
 * Método para verificar se produto está em promoção
 * @returns {boolean} - True se está em promoção
 */
Produto.prototype.isPromocao = function() {
  return this.preco_promocional && this.preco_promocional < this.preco;
};

/**
 * Método para calcular desconto percentual
 * @returns {number} - Percentual de desconto
 */
Produto.prototype.getDescontoPercentual = function() {
  if (!this.isPromocao()) return 0;
  return Math.round(((this.preco - this.preco_promocional) / this.preco) * 100);
};

/**
 * Método para verificar se produto está disponível
 * @param {number} quantidade - Quantidade desejada
 * @returns {boolean} - True se está disponível
 */
Produto.prototype.isDisponivel = function(quantidade = 1) {
  return this.ativo && this.disponivel_venda && this.estoque >= quantidade;
};

/**
 * Método para decrementar estoque
 * @param {number} quantidade - Quantidade a decrementar
 */
Produto.prototype.decrementarEstoque = async function(quantidade) {
  if (this.estoque < quantidade) {
    throw new Error('Estoque insuficiente');
  }
  
  this.estoque -= quantidade;
  this.vendas += quantidade;
  await this.save();
};

/**
 * Método para incrementar visualizações
 */
Produto.prototype.incrementarVisualizacoes = async function() {
  this.visualizacoes += 1;
  await this.save();
};

/**
 * Método para verificar se estoque está baixo
 * @returns {boolean} - True se estoque está baixo
 */
Produto.prototype.isEstoqueBaixo = function() {
  return this.estoque <= this.estoque_minimo;
};

/**
 * Método para obter dados públicos do produto
 * @returns {object} - Dados públicos do produto
 */
Produto.prototype.toPublicJSON = function() {
  const produto = this.toJSON();
  return {
    ...produto,
    preco_atual: this.getPrecoAtual(),
    em_promocao: this.isPromocao(),
    desconto_percentual: this.getDescontoPercentual(),
    disponivel: this.isDisponivel(),
    estoque_baixo: this.isEstoqueBaixo()
  };
};

module.exports = Produto;