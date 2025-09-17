import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Tag, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isSuperAdmin, isAdmin, canEdit, canDelete } = useAuth();
  const { stats, refreshStats } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
    { name: 'Produtos', href: '/produtos', icon: Package, current: location.pathname === '/produtos' },
    { name: 'Cupons', href: '/cupons', icon: Tag, current: location.pathname === '/cupons' },
    { name: 'Pedidos', href: '/pedidos', icon: ShoppingCart, current: location.pathname === '/pedidos' },
    { name: 'Clientes', href: '/clientes', icon: Users, current: location.pathname === '/clientes' },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart3, current: location.pathname === '/relatorios' },
    { name: 'Configurações', href: '/configuracoes', icon: Settings, current: location.pathname === '/configuracoes' },
  ];

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/login');
    }
  };

  const handleNavigation = (href) => {
    navigate(href);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-light-bg">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DR</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-secondary">Admin Panel</h2>
              <p className="text-xs text-white/60">Dahora Roots</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.nome_completo?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.nome_completo || 'Administrador'}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user?.email || 'admin@dahoraroots.com'}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                {user?.tipo_usuario === 'super_admin' ? 'Super Admin' : 
                 user?.tipo_usuario === 'admin' ? 'Admin' : 'Moderador'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  item.current
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <LogOut size={20} className="mr-3" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-soft border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <Menu size={24} />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Refresh Button */}
              <button
                onClick={refreshStats}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Atualizar dados"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative">
                <Bell size={20} />
                {stats.pedidosHoje > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.pedidosHoje}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.nome_completo || 'Administrador'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.tipo_usuario === 'super_admin' ? 'Super Admin' : 
                     user?.tipo_usuario === 'admin' ? 'Admin' : 'Moderador'}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.nome_completo?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;