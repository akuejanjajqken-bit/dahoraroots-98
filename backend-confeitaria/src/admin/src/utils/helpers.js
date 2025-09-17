// Utilitários para o Admin Panel

// Formatação de moeda
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatação de números
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Formatação de data
export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
};

// Formatação de data e hora
export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('pt-BR');
};

// Formatação de porcentagem
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(1)}%`;
};

// Validação de email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de CPF
export const isValidCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

// Validação de CEP
export const isValidCEP = (cep) => {
  cep = cep.replace(/[^\d]/g, '');
  return cep.length === 8;
};

// Formatação de CEP
export const formatCEP = (cep) => {
  cep = cep.replace(/[^\d]/g, '');
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
};

// Formatação de CPF
export const formatCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatação de telefone
export const formatPhone = (phone) => {
  phone = phone.replace(/[^\d]/g, '');
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

// Geração de código aleatório
export const generateRandomCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text
export const truncate = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if file is image
export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    'ativo': 'success',
    'inativo': 'danger',
    'pendente': 'warning',
    'processando': 'info',
    'concluido': 'success',
    'cancelado': 'danger',
    'baixo_estoque': 'warning',
    'sem_estoque': 'danger'
  };
  return colors[status] || 'secondary';
};

// Get status text
export const getStatusText = (status) => {
  const texts = {
    'ativo': 'Ativo',
    'inativo': 'Inativo',
    'pendente': 'Pendente',
    'processando': 'Processando',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado',
    'baixo_estoque': 'Baixo Estoque',
    'sem_estoque': 'Sem Estoque'
  };
  return texts[status] || status;
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// Calculate tax
export const calculateTax = (value, taxRate) => {
  return value * (taxRate / 100);
};

// Calculate total with tax
export const calculateTotalWithTax = (value, taxRate) => {
  return value + calculateTax(value, taxRate);
};

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

// Check if date is in the past
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

// Check if date is in the future
export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

// Get relative time
export const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`;
  if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
  if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
  return 'Agora mesmo';
};

// Sort array by field
export const sortBy = (array, field, direction = 'asc') => {
  return array.sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, fields = []) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    if (fields.length === 0) {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(term)
      );
    }
    
    return fields.some(field => {
      const value = item[field];
      return String(value).toLowerCase().includes(term);
    });
  });
};

// Group array by field
export const groupBy = (array, field) => {
  return array.reduce((groups, item) => {
    const key = item[field];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

// Get unique values from array
export const getUniqueValues = (array, field) => {
  return [...new Set(array.map(item => item[field]))];
};

// Calculate average
export const calculateAverage = (array, field) => {
  if (array.length === 0) return 0;
  const sum = array.reduce((acc, item) => acc + item[field], 0);
  return sum / array.length;
};

// Calculate sum
export const calculateSum = (array, field) => {
  return array.reduce((acc, item) => acc + item[field], 0);
};

// Get min value
export const getMinValue = (array, field) => {
  return Math.min(...array.map(item => item[field]));
};

// Get max value
export const getMaxValue = (array, field) => {
  return Math.max(...array.map(item => item[field]));
};

// Check if user has permission
export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !requiredPermission) return false;
  
  // Se tem permissão "all", pode tudo
  if (userPermissions.includes('all')) return true;
  
  // Verifica se tem a permissão específica
  return userPermissions.includes(requiredPermission);
};

// Check if user is admin
export const isAdmin = (user) => {
  return user && (user.tipo_usuario === 'admin' || user.tipo_usuario === 'super_admin');
};

// Check if user is super admin
export const isSuperAdmin = (user) => {
  return user && user.tipo_usuario === 'super_admin';
};

// Get user initials
export const getUserInitials = (name) => {
  if (!name) return '?';
  const words = name.split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Validate password strength
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;
  
  return {
    score,
    strength: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

// Generate password
export const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Download file
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data as CSV
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Get browser info
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const browsers = {
    chrome: /Chrome/.test(userAgent),
    firefox: /Firefox/.test(userAgent),
    safari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    edge: /Edg/.test(userAgent),
    ie: /MSIE|Trident/.test(userAgent)
  };
  
  const browser = Object.keys(browsers).find(key => browsers[key]);
  return {
    name: browser || 'unknown',
    userAgent
  };
};

// Check if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check if device is tablet
export const isTablet = () => {
  return /iPad|Android(?=.*Mobile)/i.test(navigator.userAgent);
};

// Check if device is desktop
export const isDesktop = () => {
  return !isMobile() && !isTablet();
};

// Get screen size
export const getScreenSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

// Check if screen is small
export const isSmallScreen = () => {
  return window.innerWidth < 768;
};

// Check if screen is medium
export const isMediumScreen = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

// Check if screen is large
export const isLargeScreen = () => {
  return window.innerWidth >= 1024;
};

// Local storage helpers
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// Session storage helpers
export const sessionStorage = {
  set: (key, value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      return false;
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }
};

// Theme helpers
export const theme = {
  set: (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    storage.set('theme', themeName);
  },
  
  get: () => {
    return storage.get('theme', 'light');
  },
  
  toggle: () => {
    const currentTheme = theme.get();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    theme.set(newTheme);
    return newTheme;
  }
};

// Notification helpers
export const notification = {
  success: (message) => {
    // Implementar com toast library
    console.log('Success:', message);
  },
  
  error: (message) => {
    // Implementar com toast library
    console.log('Error:', message);
  },
  
  warning: (message) => {
    // Implementar com toast library
    console.log('Warning:', message);
  },
  
  info: (message) => {
    // Implementar com toast library
    console.log('Info:', message);
  }
};

// API helpers
export const api = {
  buildUrl: (baseUrl, params = {}) => {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  },
  
  buildFormData: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  }
};

// Export all helpers
export default {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatPercentage,
  isValidEmail,
  isValidCPF,
  isValidCEP,
  formatCEP,
  formatCPF,
  formatPhone,
  generateRandomCode,
  debounce,
  throttle,
  capitalize,
  truncate,
  getFileExtension,
  isImageFile,
  formatFileSize,
  getStatusColor,
  getStatusText,
  calculateDiscountPercentage,
  calculateTax,
  calculateTotalWithTax,
  generateSlug,
  isToday,
  isPastDate,
  isFutureDate,
  getRelativeTime,
  sortBy,
  filterBySearch,
  groupBy,
  getUniqueValues,
  calculateAverage,
  calculateSum,
  getMinValue,
  getMaxValue,
  hasPermission,
  isAdmin,
  isSuperAdmin,
  getUserInitials,
  validatePasswordStrength,
  generatePassword,
  copyToClipboard,
  downloadFile,
  exportToCSV,
  getBrowserInfo,
  isMobile,
  isTablet,
  isDesktop,
  getScreenSize,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
  storage,
  sessionStorage,
  theme,
  notification,
  api
};