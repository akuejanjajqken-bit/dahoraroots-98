// Constantes para o Admin Panel

// Cores do tema
export const COLORS = {
  primary: '#E16A3D',
  secondary: '#FEA450', 
  accent: '#016A6D',
  dark: '#043E52',
  light: '#FFF9F5',
  success: '#22C55E',
  warning: '#FEA450',
  danger: '#EF4444',
  info: '#3B82F6'
};

// Tipos de usuário
export const USER_TYPES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Permissões
export const PERMISSIONS = {
  ALL: 'all',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  COUPONS: 'coupons',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  USERS: 'users'
};

// Status de produtos
export const PRODUCT_STATUS = {
  ACTIVE: 'ativo',
  INACTIVE: 'inativo',
  LOW_STOCK: 'baixo_estoque',
  OUT_OF_STOCK: 'sem_estoque'
};

// Status de pedidos
export const ORDER_STATUS = {
  PENDING: 'pendente',
  PROCESSING: 'processando',
  SHIPPED: 'enviado',
  DELIVERED: 'entregue',
  CANCELLED: 'cancelado',
  RETURNED: 'devolvido'
};

// Status de cupons
export const COUPON_STATUS = {
  ACTIVE: 'ativo',
  INACTIVE: 'inativo',
  EXPIRED: 'expirado',
  EXHAUSTED: 'esgotado'
};

// Tipos de cupom
export const COUPON_TYPES = {
  PERCENTAGE: 'percentual',
  FIXED_VALUE: 'valor_fixo',
  FREE_SHIPPING: 'frete_gratis'
};

// Tipos de pagamento
export const PAYMENT_TYPES = {
  CREDIT_CARD: 'cartao_credito',
  DEBIT_CARD: 'cartao_debito',
  PIX: 'pix',
  BOLETO: 'boleto',
  CASH: 'dinheiro'
};

// Status de pagamento
export const PAYMENT_STATUS = {
  PENDING: 'pendente',
  PROCESSING: 'processando',
  APPROVED: 'aprovado',
  REJECTED: 'rejeitado',
  CANCELLED: 'cancelado',
  REFUNDED: 'reembolsado'
};

// Métodos de entrega
export const DELIVERY_METHODS = {
  STANDARD: 'padrao',
  EXPRESS: 'expresso',
  SAME_DAY: 'mesmo_dia',
  PICKUP: 'retirada'
};

// Status de entrega
export const DELIVERY_STATUS = {
  PENDING: 'pendente',
  PREPARING: 'preparando',
  SHIPPED: 'enviado',
  IN_TRANSIT: 'em_transito',
  DELIVERED: 'entregue',
  FAILED: 'falhou'
};

// Categorias de produtos (exemplo)
export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Bolos', slug: 'bolos' },
  { id: 2, name: 'Doces', slug: 'doces' },
  { id: 3, name: 'Tortas', slug: 'tortas' },
  { id: 4, name: 'Cookies', slug: 'cookies' },
  { id: 5, name: 'Brigadeiros', slug: 'brigadeiros' },
  { id: 6, name: 'Trufas', slug: 'trufas' }
];

// Subcategorias de produtos (exemplo)
export const PRODUCT_SUBCATEGORIES = {
  bolos: [
    { id: 1, name: 'Bolos de Aniversário', slug: 'bolos-aniversario' },
    { id: 2, name: 'Bolos de Casamento', slug: 'bolos-casamento' },
    { id: 3, name: 'Bolos de Festa', slug: 'bolos-festa' }
  ],
  doces: [
    { id: 4, name: 'Doces Finos', slug: 'doces-finos' },
    { id: 5, name: 'Doces Tradicionais', slug: 'doces-tradicionais' },
    { id: 6, name: 'Doces Gourmet', slug: 'doces-gourmet' }
  ]
};

// Estados do Brasil
export const BRAZILIAN_STATES = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
};

// Configurações de upload
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_FILES_PER_UPLOAD: 10
};

// Configurações de validação
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  PHONE_LENGTH: 11,
  CPF_LENGTH: 11,
  CNPJ_LENGTH: 14,
  CEP_LENGTH: 8
};

// Configurações de cache
export const CACHE = {
  DEFAULT_TTL: 300, // 5 minutos
  LONG_TTL: 3600, // 1 hora
  SHORT_TTL: 60 // 1 minuto
};

// Configurações de notificação
export const NOTIFICATION = {
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  WARNING_DURATION: 4000,
  INFO_DURATION: 3000
};

// Configurações de API
export const API = {
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 segundo
};

// Configurações de tema
export const THEME = {
  DEFAULT: 'light',
  AVAILABLE: ['light', 'dark'],
  STORAGE_KEY: 'admin_theme'
};

// Configurações de idioma
export const LANGUAGE = {
  DEFAULT: 'pt-BR',
  AVAILABLE: ['pt-BR', 'en-US'],
  STORAGE_KEY: 'admin_language'
};

// Configurações de dashboard
export const DASHBOARD = {
  REFRESH_INTERVAL: 30000, // 30 segundos
  CHART_COLORS: [
    '#E16A3D',
    '#FEA450',
    '#016A6D',
    '#043E52',
    '#22C55E',
    '#EF4444',
    '#3B82F6',
    '#8B5CF6'
  ]
};

// Configurações de relatórios
export const REPORTS = {
  DATE_RANGES: [
    { label: 'Hoje', value: 'today' },
    { label: 'Ontem', value: 'yesterday' },
    { label: 'Últimos 7 dias', value: 'last_7_days' },
    { label: 'Últimos 30 dias', value: 'last_30_days' },
    { label: 'Este mês', value: 'this_month' },
    { label: 'Mês passado', value: 'last_month' },
    { label: 'Este ano', value: 'this_year' },
    { label: 'Ano passado', value: 'last_year' }
  ],
  EXPORT_FORMATS: ['csv', 'xlsx', 'pdf'],
  MAX_RECORDS: 10000
};

// Configurações de backup
export const BACKUP = {
  AUTO_BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
  MAX_BACKUP_FILES: 30,
  BACKUP_TYPES: ['full', 'incremental', 'differential']
};

// Configurações de segurança
export const SECURITY = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  PASSWORD_HISTORY: 5
};

// Configurações de monitoramento
export const MONITORING = {
  HEALTH_CHECK_INTERVAL: 60000, // 1 minuto
  PERFORMANCE_THRESHOLD: 1000, // 1 segundo
  ERROR_THRESHOLD: 10
};

// Configurações de integração
export const INTEGRATIONS = {
  PAYMENT_GATEWAYS: ['stripe', 'paypal', 'mercadopago', 'pagseguro'],
  SHIPPING_PROVIDERS: ['correios', 'jadlog', 'total_express'],
  EMAIL_PROVIDERS: ['sendgrid', 'mailgun', 'ses', 'smtp'],
  SMS_PROVIDERS: ['twilio', 'aws_sns', 'zenvia']
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Acesso negado. Faça login novamente.',
  FORBIDDEN: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  TIMEOUT_ERROR: 'Tempo limite excedido. Tente novamente.',
  UNKNOWN_ERROR: 'Erro desconhecido. Contate o suporte.'
};

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  SAVED: 'Salvo com sucesso!',
  UPDATED: 'Atualizado com sucesso!',
  DELETED: 'Excluído com sucesso!',
  CREATED: 'Criado com sucesso!',
  SENT: 'Enviado com sucesso!',
  UPLOADED: 'Upload realizado com sucesso!',
  EXPORTED: 'Exportado com sucesso!',
  IMPORTED: 'Importado com sucesso!'
};

// Configurações de desenvolvimento
export const DEVELOPMENT = {
  DEBUG_MODE: import.meta.env.DEV,
  LOG_LEVEL: import.meta.env.DEV ? 'debug' : 'error',
  MOCK_API: false,
  HOT_RELOAD: true
};

// Configurações de produção
export const PRODUCTION = {
  DEBUG_MODE: false,
  LOG_LEVEL: 'error',
  MOCK_API: false,
  HOT_RELOAD: false
};

// Configurações do ambiente atual
export const ENV = import.meta.env.DEV ? DEVELOPMENT : PRODUCTION;

// Exportar todas as constantes
export default {
  COLORS,
  USER_TYPES,
  PERMISSIONS,
  PRODUCT_STATUS,
  ORDER_STATUS,
  COUPON_STATUS,
  COUPON_TYPES,
  PAYMENT_TYPES,
  PAYMENT_STATUS,
  DELIVERY_METHODS,
  DELIVERY_STATUS,
  PRODUCT_CATEGORIES,
  PRODUCT_SUBCATEGORIES,
  BRAZILIAN_STATES,
  PAGINATION,
  UPLOAD,
  VALIDATION,
  CACHE,
  NOTIFICATION,
  API,
  THEME,
  LANGUAGE,
  DASHBOARD,
  REPORTS,
  BACKUP,
  SECURITY,
  MONITORING,
  INTEGRATIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ENV
};