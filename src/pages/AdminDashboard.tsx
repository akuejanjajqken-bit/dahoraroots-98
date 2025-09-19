import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, ShoppingCart, Package, DollarSign, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (state.user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchStats();
  }, [state.user, navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('dahora-roots-token');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pine mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="font-graffiti text-3xl text-foreground">
                Admin <span className="text-gradient-sunset">Dashboard</span>
              </h1>
              <p className="text-sm text-muted-foreground font-urban">
                Bem-vindo, {state.profile?.name || state.user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-deep transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-urban">Total de Usuários</p>
                <p className="text-3xl font-bold text-foreground font-block">{stats.totalUsers}</p>
              </div>
              <div className="h-12 w-12 bg-pine/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-pine" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-deep transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-urban">Total de Pedidos</p>
                <p className="text-3xl font-bold text-foreground font-block">{stats.totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-sunset-orange/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-sunset-orange" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-deep transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-urban">Total de Produtos</p>
                <p className="text-3xl font-bold text-foreground font-block">{stats.totalProducts}</p>
              </div>
              <div className="h-12 w-12 bg-tangerine/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-tangerine" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-deep transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground font-urban">Receita Total</p>
                <p className="text-3xl font-bold text-foreground font-block">
                  R$ {stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="h-12 w-12 bg-nile-blue/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-nile-blue" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="font-graffiti text-2xl text-foreground mb-4">Ações <span className="text-gradient-sunset">Administrativas</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-sunset-orange/30 rounded-lg hover:border-sunset-orange hover:bg-sunset-orange/5 transition-colors group">
              <Package className="h-8 w-8 text-sunset-orange/60 group-hover:text-sunset-orange mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground font-urban">Gerenciar Produtos</p>
            </button>
            <button className="p-4 border-2 border-dashed border-pine/30 rounded-lg hover:border-pine hover:bg-pine/5 transition-colors group">
              <Users className="h-8 w-8 text-pine/60 group-hover:text-pine mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground font-urban">Gerenciar Usuários</p>
            </button>
            <button className="p-4 border-2 border-dashed border-tangerine/30 rounded-lg hover:border-tangerine hover:bg-tangerine/5 transition-colors group">
              <ShoppingCart className="h-8 w-8 text-tangerine/60 group-hover:text-tangerine mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground font-urban">Gerenciar Pedidos</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}