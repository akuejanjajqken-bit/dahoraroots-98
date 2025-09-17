const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuração do Swagger para documentação da API
 * Utiliza as cores do tema da confeitaria
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Confeitaria Dahora Roots',
    version: '1.0.0',
    description: `
      API completa para e-commerce de doces e confeitaria.
      
      ## Cores do Tema
      - **Primary**: #E16A3D (Sunset Orange)
      - **Secondary**: #FEA450 (Tangerine) 
      - **Accent**: #016A6D (Pine)
      - **Dark**: #043E52 (Nile Blue)
      
      ## Funcionalidades
      - Sistema de autenticação JWT
      - Gestão de produtos e categorias
      - Carrinho de compras
      - Processamento de pedidos
      - Integração com gateways de pagamento
      - Sistema de avaliações
      - Dashboard administrativo
    `,
    contact: {
      name: 'Dahora Roots',
      email: 'contato@dahoraroots.com',
      url: 'https://dahoraroots.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3000',
      description: 'Servidor de Desenvolvimento'
    },
    {
      url: 'https://api.dahoraroots.com',
      description: 'Servidor de Produção'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT para autenticação'
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'Chave API para webhooks'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            example: 'Erro na requisição'
          },
          errors: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Operação realizada com sucesso'
          },
          data: {
            type: 'object'
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Autenticação',
      description: 'Endpoints para login, registro e gerenciamento de usuários'
    },
    {
      name: 'Produtos',
      description: 'Gestão de produtos, categorias e busca'
    },
    {
      name: 'Carrinho',
      description: 'Operações do carrinho de compras'
    },
    {
      name: 'Pedidos',
      description: 'Criação e gestão de pedidos'
    },
    {
      name: 'Pagamento',
      description: 'Processamento de pagamentos'
    },
    {
      name: 'Admin',
      description: 'Endpoints administrativos'
    }
  ]
};

/**
 * Opções para o swagger-jsdoc
 */
const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ]
};

/**
 * Gera a especificação Swagger
 */
const swaggerSpec = swaggerJsdoc(options);

/**
 * Configuração customizada do Swagger UI
 */
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { 
      background-color: #043E52 !important; 
    }
    .swagger-ui .topbar .download-url-wrapper .download-url-button {
      background-color: #E16A3D !important;
      border-color: #E16A3D !important;
    }
    .swagger-ui .btn.authorize {
      background-color: #016A6D !important;
      border-color: #016A6D !important;
    }
    .swagger-ui .btn.authorize svg {
      fill: #FEA450 !important;
    }
    .swagger-ui .scheme-container {
      background-color: #FAFAFA !important;
    }
    .swagger-ui .opblock.opblock-post {
      border-color: #E16A3D !important;
    }
    .swagger-ui .opblock.opblock-get {
      border-color: #016A6D !important;
    }
    .swagger-ui .opblock.opblock-put {
      border-color: #FEA450 !important;
    }
    .swagger-ui .opblock.opblock-delete {
      border-color: #dc3545 !important;
    }
    .swagger-ui .opblock .opblock-summary {
      border-color: inherit !important;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary {
      border-color: #E16A3D !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary {
      border-color: #016A6D !important;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary {
      border-color: #FEA450 !important;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary {
      border-color: #dc3545 !important;
    }
    .swagger-ui .btn.execute {
      background-color: #E16A3D !important;
      border-color: #E16A3D !important;
    }
    .swagger-ui .btn.execute:hover {
      background-color: #d55a2d !important;
      border-color: #d55a2d !important;
    }
    .swagger-ui .response-col_status {
      color: #016A6D !important;
    }
    .swagger-ui .parameter__name {
      color: #043E52 !important;
    }
    .swagger-ui .parameter__type {
      color: #E16A3D !important;
    }
    .swagger-ui .model-title {
      color: #043E52 !important;
    }
    .swagger-ui .prop-name {
      color: #016A6D !important;
    }
    .swagger-ui .prop-type {
      color: #E16A3D !important;
    }
  `,
  customSiteTitle: 'API Confeitaria Dahora Roots',
  customfavIcon: '/favicon.ico'
};

module.exports = {
  swaggerSpec,
  swaggerUiOptions
};