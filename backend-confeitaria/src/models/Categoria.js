const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Categoria - Representa as categorias de produtos
 * Organiza os produtos em grupos lógicos
 */
const Categoria = sequelize.define('Categoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome da categoria é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'Nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: {
      name: 'slug_unique',
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
  imagem_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'URL da imagem deve ser válida'
      }
    }
  },
  icone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Nome do ícone (ex: cake, cookie, candy)'
  },
  cor_hex: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#E16A3D',
    validate: {
      is: {
        args: /^#[0-9A-F]{6}$/i,
        msg: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
      }
    }
  },
  ordem_exibicao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Ordem de exibição da categoria (menor número = maior prioridade)'
  },
  ativa: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  }
}, {
  tableName: 'categorias',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['ativa']
    },
    {
      fields: ['ordem_exibicao']
    }
  ]
});

/**
 * Hook executado antes de salvar a categoria
 * Gera o slug automaticamente se não fornecido
 */
Categoria.beforeSave = async (categoria) => {
  if (categoria.changed('nome') && !categoria.slug) {
    categoria.slug = categoria.nome
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
 * Método estático para buscar categoria por slug
 * @param {string} slug - Slug da categoria
 * @returns {Categoria|null} - Categoria encontrada ou null
 */
Categoria.findBySlug = async function(slug) {
  return await this.findOne({
    where: { 
      slug,
      ativa: true 
    }
  });
};

/**
 * Método estático para listar categorias ativas ordenadas
 * @returns {Array} - Lista de categorias ativas
 */
Categoria.findActive = async function() {
  return await this.findAll({
    where: { ativa: true },
    order: [['ordem_exibicao', 'ASC'], ['nome', 'ASC']]
  });
};

/**
 * Método para contar produtos da categoria
 * @returns {number} - Número de produtos ativos na categoria
 */
Categoria.prototype.countProdutos = async function() {
  const Produto = require('./Produto');
  return await Produto.count({
    where: {
      categoria_id: this.id,
      ativo: true
    }
  });
};

/**
 * Método para obter produtos da categoria
 * @param {object} options - Opções de busca
 * @returns {Array} - Lista de produtos da categoria
 */
Categoria.prototype.getProdutos = async function(options = {}) {
  const Produto = require('./Produto');
  const defaultOptions = {
    where: {
      categoria_id: this.id,
      ativo: true
    },
    order: [['destaque', 'DESC'], ['created_at', 'DESC']],
    limit: 20
  };
  
  return await Produto.findAll({
    ...defaultOptions,
    ...options
  });
};

/**
 * Método para verificar se categoria pode ser excluída
 * @returns {boolean} - True se não há produtos associados
 */
Categoria.prototype.canBeDeleted = async function() {
  const count = await this.countProdutos();
  return count === 0;
};

/**
 * Método para ativar/desativar categoria
 * @param {boolean} ativa - Status da categoria
 */
Categoria.prototype.setActive = async function(ativa) {
  this.ativa = ativa;
  await this.save();
};

/**
 * Método estático para buscar categorias com contagem de produtos
 * @returns {Array} - Lista de categorias com contagem
 */
Categoria.findWithProductCount = async function() {
  const { QueryTypes } = require('sequelize');
  
  const query = `
    SELECT 
      c.*,
      COUNT(p.id) as total_produtos,
      COUNT(CASE WHEN p.ativo = 1 THEN 1 END) as produtos_ativos
    FROM categorias c
    LEFT JOIN produtos p ON c.id = p.categoria_id
    WHERE c.ativa = 1
    GROUP BY c.id
    ORDER BY c.ordem_exibicao ASC, c.nome ASC
  `;
  
  return await sequelize.query(query, {
    type: QueryTypes.SELECT
  });
};

module.exports = Categoria;