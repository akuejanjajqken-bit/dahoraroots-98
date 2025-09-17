import axios from 'axios';
import toast from 'react-hot-toast';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Trata erros de autenticação
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      toast.error('Sessão expirada. Faça login novamente.');
    }
    
    // Trata erros de permissão
    if (error.response?.status === 403) {
      toast.error('Acesso negado. Você não tem permissão para esta ação.');
    }
    
    // Trata erros de servidor
    if (error.response?.status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente mais tarde.');
    }
    
    // Trata erros de rede
    if (!error.response) {
      toast.error('Erro de conexão. Verifique sua internet.');
    }
    
    return Promise.reject(error);
  }
);

// Funções auxiliares para upload de arquivos
export const uploadFile = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Funções auxiliares para download
export const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    toast.error('Erro ao baixar arquivo');
    throw error;
  }
};

// Funções auxiliares para exportação
export const exportToCSV = async (endpoint, filename) => {
  try {
    const response = await api.get(endpoint, {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv',
      },
    });
    
    const blob = new Blob([response.data], { type: 'text/csv' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    toast.success('Arquivo exportado com sucesso!');
  } catch (error) {
    toast.error('Erro ao exportar arquivo');
    throw error;
  }
};

export const exportToExcel = async (endpoint, filename) => {
  try {
    const response = await api.get(endpoint, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
    
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'export.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    toast.success('Arquivo exportado com sucesso!');
  } catch (error) {
    toast.error('Erro ao exportar arquivo');
    throw error;
  }
};

// Funções auxiliares para paginação
export const createPaginationParams = (page = 1, limit = 20, filters = {}) => {
  return {
    page,
    limit,
    ...filters,
  };
};

// Funções auxiliares para formatação de dados
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Funções auxiliares para validação
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

export const validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;
  
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cnpj.charAt(13))) return false;
  
  return true;
};

// Funções de formatação
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('pt-BR');
};

export default api;