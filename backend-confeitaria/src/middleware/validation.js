const Joi = require('joi');

/**
 * Middleware de validação usando Joi
 * Valida os dados da requisição antes de processar
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors
      });
    }

    // Substitui os dados originais pelos validados
    req[property] = value;
    next();
  };
};

/**
 * Schemas de validação para diferentes endpoints
 */

// Validação de registro de usuário
const registerSchema = Joi.object({
  nome_completo: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Nome completo é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido'
    }),
  senha: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.empty': 'Senha é obrigatória',
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'string.max': 'Senha deve ter no máximo 128 caracteres'
    }),
  telefone: Joi.string()
    .pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Telefone deve estar no formato (11) 99999-9999'
    }),
  cpf: Joi.string()
    .pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .optional()
    .messages({
      'string.pattern.base': 'CPF deve estar no formato 000.000.000-00'
    }),
  data_nascimento: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Data de nascimento não pode ser futura'
    }),
  genero: Joi.string()
    .valid('masculino', 'feminino', 'outro', 'nao_informado')
    .optional(),
  newsletter: Joi.boolean()
    .default(true),
  termos_aceitos: Joi.boolean()
    .valid(true)
    .required()
    .messages({
      'any.only': 'Você deve aceitar os termos de uso'
    })
});

// Validação de login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido'
    }),
  senha: Joi.string()
    .required()
    .messages({
      'string.empty': 'Senha é obrigatória'
    })
});

// Validação de produto
const produtoSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Nome do produto é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres'
    }),
  descricao: Joi.string()
    .max(2000)
    .optional()
    .allow(''),
  descricao_curta: Joi.string()
    .max(500)
    .optional()
    .allow(''),
  preco: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Preço deve ser maior que zero'
    }),
  preco_promocional: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null),
  categoria_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Categoria é obrigatória'
    }),
  estoque: Joi.number()
    .integer()
    .min(0)
    .default(0),
  estoque_minimo: Joi.number()
    .integer()
    .min(0)
    .default(5),
  peso: Joi.number()
    .positive()
    .precision(3)
    .optional()
    .allow(null),
  dimensoes: Joi.object({
    largura: Joi.number().positive().max(1000).optional(),
    altura: Joi.number().positive().max(1000).optional(),
    profundidade: Joi.number().positive().max(1000).optional()
  }).optional(),
  imagens: Joi.array()
    .items(Joi.string().uri())
    .default([]),
  destaque: Joi.boolean()
    .default(false),
  ativo: Joi.boolean()
    .default(true),
  disponivel_venda: Joi.boolean()
    .default(true),
  ingredientes: Joi.string()
    .max(2000)
    .optional()
    .allow(''),
  alergenos: Joi.array()
    .items(Joi.string())
    .default([]),
  tempo_preparo: Joi.number()
    .integer()
    .min(1)
    .optional()
    .allow(null),
  validade_dias: Joi.number()
    .integer()
    .min(1)
    .optional()
    .allow(null),
  temperatura_conservacao: Joi.string()
    .valid('ambiente', 'refrigerado', 'congelado')
    .default('ambiente'),
  codigo_barras: Joi.string()
    .max(50)
    .optional()
    .allow(''),
  sku: Joi.string()
    .max(50)
    .optional()
    .allow(''),
  meta_title: Joi.string()
    .max(60)
    .optional()
    .allow(''),
  meta_description: Joi.string()
    .max(160)
    .optional()
    .allow(''),
  palavras_chave: Joi.string()
    .max(500)
    .optional()
    .allow('')
});

// Validação de categoria
const categoriaSchema = Joi.object({
  nome: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Nome da categoria é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
  descricao: Joi.string()
    .max(1000)
    .optional()
    .allow(''),
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Slug deve conter apenas letras minúsculas, números e hífens'
    }),
  imagem_url: Joi.string()
    .uri()
    .optional()
    .allow(''),
  icone: Joi.string()
    .max(50)
    .optional()
    .allow(''),
  cor_hex: Joi.string()
    .pattern(/^#[0-9A-F]{6}$/i)
    .default('#E16A3D')
    .messages({
      'string.pattern.base': 'Cor deve estar no formato hexadecimal (#RRGGBB)'
    }),
  ordem_exibicao: Joi.number()
    .integer()
    .default(0),
  ativa: Joi.boolean()
    .default(true),
  meta_title: Joi.string()
    .max(60)
    .optional()
    .allow(''),
  meta_description: Joi.string()
    .max(160)
    .optional()
    .allow(''),
  palavras_chave: Joi.string()
    .max(500)
    .optional()
    .allow('')
});

// Validação de endereço
const enderecoSchema = Joi.object({
  cep: Joi.string()
    .pattern(/^\d{5}-?\d{3}$/)
    .required()
    .messages({
      'string.pattern.base': 'CEP deve estar no formato 00000-000'
    }),
  logradouro: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Logradouro é obrigatório',
      'string.min': 'Logradouro deve ter pelo menos 2 caracteres'
    }),
  numero: Joi.string()
    .max(20)
    .required()
    .messages({
      'string.empty': 'Número é obrigatório'
    }),
  complemento: Joi.string()
    .max(100)
    .optional()
    .allow(''),
  bairro: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Bairro é obrigatório'
    }),
  cidade: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Cidade é obrigatória'
    }),
  estado: Joi.string()
    .length(2)
    .pattern(/^[A-Z]{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Estado deve ser a sigla de 2 letras (ex: SP)'
    }),
  principal: Joi.boolean()
    .default(false),
  tipo: Joi.string()
    .valid('residencial', 'comercial', 'outro')
    .default('residencial'),
  nome: Joi.string()
    .max(100)
    .optional()
    .allow(''),
  referencia: Joi.string()
    .max(255)
    .optional()
    .allow(''),
  instrucoes_entrega: Joi.string()
    .max(500)
    .optional()
    .allow('')
});

// Validação de pedido
const pedidoSchema = Joi.object({
  endereco_entrega: Joi.object({
    cep: Joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
    logradouro: Joi.string().min(2).max(255).required(),
    numero: Joi.string().max(20).required(),
    complemento: Joi.string().max(100).optional().allow(''),
    bairro: Joi.string().min(2).max(100).required(),
    cidade: Joi.string().min(2).max(100).required(),
    estado: Joi.string().length(2).pattern(/^[A-Z]{2}$/).required(),
    referencia: Joi.string().max(255).optional().allow(''),
    instrucoes_entrega: Joi.string().max(500).optional().allow('')
  }).required(),
  metodo_pagamento: Joi.string()
    .valid('pix', 'cartao_credito', 'cartao_debito', 'boleto', 'dinheiro', 'transferencia')
    .required()
    .messages({
      'any.only': 'Método de pagamento inválido'
    }),
  observacoes: Joi.string()
    .max(1000)
    .optional()
    .allow(''),
  cupom_codigo: Joi.string()
    .max(50)
    .optional()
    .allow(''),
  tipo_entrega: Joi.string()
    .valid('normal', 'expressa', 'agendada')
    .default('normal'),
  data_agendamento: Joi.date()
    .min('now')
    .optional()
    .allow(null),
  horario_agendamento: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .allow(null)
    .messages({
      'string.pattern.base': 'Horário deve estar no formato HH:MM'
    })
});

// Validação de avaliação
const avaliacaoSchema = Joi.object({
  produto_id: Joi.number()
    .integer()
    .positive()
    .required(),
  pedido_id: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null),
  nota: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': 'Nota deve ser pelo menos 1',
      'number.max': 'Nota deve ser no máximo 5'
    }),
  comentario: Joi.string()
    .max(1000)
    .optional()
    .allow(''),
  fotos: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .default([]),
  aspectos: Joi.object({
    sabor: Joi.number().integer().min(1).max(5).optional(),
    apresentacao: Joi.number().integer().min(1).max(5).optional(),
    qualidade: Joi.number().integer().min(1).max(5).optional(),
    entrega: Joi.number().integer().min(1).max(5).optional()
  }).optional()
});

// Validação de cupom
const cupomSchema = Joi.object({
  codigo: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Código do cupom é obrigatório'
    }),
  nome: Joi.string()
    .min(2)
    .max(100)
    .required(),
  descricao: Joi.string()
    .max(500)
    .optional()
    .allow(''),
  tipo: Joi.string()
    .valid('percentual', 'valor_fixo', 'frete_gratis')
    .required(),
  valor: Joi.number()
    .positive()
    .precision(2)
    .required(),
  valor_minimo_pedido: Joi.number()
    .min(0)
    .precision(2)
    .default(0),
  valor_maximo_desconto: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null),
  usos_maximo: Joi.number()
    .integer()
    .min(1)
    .optional()
    .allow(null),
  data_inicio: Joi.date()
    .required(),
  data_fim: Joi.date()
    .greater(Joi.ref('data_inicio'))
    .required()
    .messages({
      'date.greater': 'Data de fim deve ser posterior à data de início'
    }),
  ativo: Joi.boolean()
    .default(true),
  categorias_permitidas: Joi.array()
    .items(Joi.number().integer().positive())
    .default([]),
  categorias_excluidas: Joi.array()
    .items(Joi.number().integer().positive())
    .default([]),
  produtos_permitidos: Joi.array()
    .items(Joi.number().integer().positive())
    .default([]),
  produtos_excluidos: Joi.array()
    .items(Joi.number().integer().positive())
    .default([]),
  usuarios_permitidos: Joi.array()
    .items(Joi.number().integer().positive())
    .default([]),
  usuarios_excluidos: Joi.array()
    .items(Joi.number().integer().positive())
    .default([]),
  tipo_usuario: Joi.string()
    .valid('todos', 'novos', 'existentes')
    .default('todos'),
  primeira_compra: Joi.boolean()
    .default(false),
  combinavel: Joi.boolean()
    .default(false),
  prioridade: Joi.number()
    .integer()
    .default(0)
});

// Validação de parâmetros de query
const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid('nome', 'preco', 'created_at', 'visualizacoes', 'vendas').default('created_at'),
  order: Joi.string().valid('ASC', 'DESC').default('DESC'),
  search: Joi.string().max(100).optional().allow(''),
  categoria: Joi.number().integer().positive().optional(),
  preco_min: Joi.number().positive().optional(),
  preco_max: Joi.number().positive().optional(),
  destaque: Joi.boolean().optional(),
  ativo: Joi.boolean().optional()
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  produtoSchema,
  categoriaSchema,
  enderecoSchema,
  pedidoSchema,
  avaliacaoSchema,
  cupomSchema,
  queryParamsSchema
};