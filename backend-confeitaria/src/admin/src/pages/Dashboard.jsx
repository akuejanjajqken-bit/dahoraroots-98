import React from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatNumber } from '../services/api';

const Dashboard = () => {
  const { stats, recentOrders, topProducts, salesChart, loading } = useAdmin();
  const { user } = useAuth();

  const statCards = [
    {
      title: 'Vendas Hoje',
      value: formatCurrency(stats.vendasHoje),
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'primary'
    },
    {
      title: 'Pedidos',
      value: formatNumber(stats.pedidosHoje),
      change: '+5 novos',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'secondary'
    },
    {
      title: 'Produtos',
      value: formatNumber(stats.produtosTotal),
      change: `${stats.produtosSemEstoque} sem estoque`,
      changeType: stats.produtosSemEstoque > 0 ? 'negative' : 'neutral',
      icon: Package,
      color: 'accent'
    },
    {
      title: 'Clientes',
      value: formatNumber(stats.clientesTotal),
      change: '+23 novos',
      changeType: 'positive',
      icon: Users,
      color: 'dark'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pendente': { color: 'warning', text: 'Pendente' },
      'confirmado': { color: 'info', text: 'Confirmado' },
      'processando': { color: 'info', text: 'Processando' },
      'preparando': { color: 'info', text: 'Preparando' },
      'pronto': { color: 'info', text: 'Pronto' },
      'enviado': { color: 'info', text: 'Enviado' },
      'entregue': { color: 'success', text: 'Entregue' },
      'cancelado': { color: 'danger', text: 'Cancelado' },
      'reembolsado': { color: 'danger', text: 'Reembolsado' }
    };

    const config = statusConfig[status] || { color: 'info', text: status };
    
    return (
      <span className={`badge badge-${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold font-display mb-2">
          Bem-vindo, {user?.nome_completo || 'Administrador'}! 👋
        </h1>
        <p className="text-white/80">
          Aqui está um resumo das atividades da sua confeitaria hoje.
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card stat-card-${stat.color} animate-fade-in-up`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                  <Icon className={`h-6 w-6 text-${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico de Vendas e Pedidos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vendas */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Vendas dos Últimos 7 Dias
            </h3>
          </div>
          <div className="card-body">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de vendas</p>
                <p className="text-sm text-gray-400">Em desenvolvimento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Pedidos Recentes
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        #{order.numero_pedido}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.usuario?.nome_completo || 'Cliente'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(order.valor_total)}
                      </p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhum pedido recente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Mais Vendidos e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos Mais Vendidos */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Produtos Mais Vendidos
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {product.nome}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.vendas} vendas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(product.preco)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhum produto vendido</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
              Alertas
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {stats.produtosSemEstoque > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Produtos sem estoque
                    </p>
                    <p className="text-sm text-yellow-600">
                      {stats.produtosSemEstoque} produtos precisam de reposição
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-800">
                    Relatório mensal
                    </p>
                  <p className="text-sm text-blue-600">
                    Gere o relatório de vendas do mês
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">
                    Crescimento positivo
                  </p>
                  <p className="text-sm text-green-600">
                    Vendas aumentaram 12% em relação ao mês anterior
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;