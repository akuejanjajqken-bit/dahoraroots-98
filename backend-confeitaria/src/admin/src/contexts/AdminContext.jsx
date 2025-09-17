import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AdminContext = createContext({});

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin deve ser usado dentro de um AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState({
    vendasHoje: 0,
    pedidosHoje: 0,
    produtosTotal: 0,
    clientesTotal: 0,
    produtosSemEstoque: 0,
    cuponsAtivos: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carrega estatísticas do dashboard
  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats');
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega pedidos recentes
  const loadRecentOrders = async () => {
    try {
      const response = await api.get('/admin/dashboard/recent-orders');
      
      if (response.data.success) {
        setRecentOrders(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos recentes:', error);
    }
  };

  // Carrega produtos mais vendidos
  const loadTopProducts = async () => {
    try {
      const response = await api.get('/admin/dashboard/top-products');
      
      if (response.data.success) {
        setTopProducts(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos top:', error);
    }
  };

  // Carrega dados do gráfico de vendas
  const loadSalesChart = async (period = '7d') => {
    try {
      const response = await api.get(`/admin/dashboard/sales-chart?period=${period}`);
      
      if (response.data.success) {
        setSalesChart(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar gráfico de vendas:', error);
    }
  };

  // Carrega todos os dados do dashboard
  const loadDashboardData = async () => {
    await Promise.all([
      loadDashboardStats(),
      loadRecentOrders(),
      loadTopProducts(),
      loadSalesChart()
    ]);
  };

  // Atualiza estatísticas em tempo real
  const refreshStats = () => {
    loadDashboardStats();
  };

  // Formata valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formata números
  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  // Calcula percentual de crescimento
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Obtém cor baseada no status
  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'warning',
      'confirmado': 'info',
      'processando': 'info',
      'preparando': 'info',
      'pronto': 'info',
      'enviado': 'info',
      'entregue': 'success',
      'cancelado': 'danger',
      'reembolsado': 'danger'
    };
    return colors[status] || 'info';
  };

  // Obtém ícone baseado no status
  const getStatusIcon = (status) => {
    const icons = {
      'pendente': '⏳',
      'confirmado': '✅',
      'processando': '🔄',
      'preparando': '👨‍🍳',
      'pronto': '📦',
      'enviado': '🚚',
      'entregue': '🎉',
      'cancelado': '❌',
      'reembolsado': '💰'
    };
    return icons[status] || '❓';
  };

  // Carrega dados iniciais
  useEffect(() => {
    loadDashboardData();
    
    // Atualiza dados a cada 5 minutos
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    stats,
    recentOrders,
    topProducts,
    salesChart,
    loading,
    loadDashboardData,
    refreshStats,
    formatCurrency,
    formatNumber,
    calculateGrowth,
    getStatusColor,
    getStatusIcon
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};