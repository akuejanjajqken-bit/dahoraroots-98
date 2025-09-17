import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, Settings, LogOut, Edit3 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function Account() {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'orders', name: 'Pedidos', icon: ShoppingBag },
    { id: 'wishlist', name: 'Favoritos', icon: Heart },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="pt-20 pb-8 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
              Minha <span className="text-gradient-sunset">Conta</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Gerencie suas informações e pedidos
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-tangerine to-sunset-orange rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {state.user?.firstName?.[0]}{state.user?.lastName?.[0]}
                  </span>
                </div>
                <h2 className="font-semibold text-lg text-nile-blue">
                  {state.user?.firstName} {state.user?.lastName}
                </h2>
                <p className="text-sm text-gray-500">{state.user?.email}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-pine text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 mt-6 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-soft p-6">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-nile-blue">Informações Pessoais</h2>
                    <button className="flex items-center gap-2 text-pine hover:text-sunset-orange transition-colors">
                      <Edit3 className="h-4 w-4" />
                      <span className="text-sm font-medium">Editar</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">
                            {state.user?.firstName} {state.user?.lastName}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{state.user?.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">
                            {state.user?.phone || 'Não informado'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Membro desde
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-900">
                            {new Date(state.user?.createdAt || '').toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-nile-blue mb-6">Meus Pedidos</h2>
                  
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      Nenhum pedido encontrado
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Quando você fizer um pedido, ele aparecerá aqui.
                    </p>
                    <Link to="/products" className="btn-cta">
                      Ver Produtos
                    </Link>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-nile-blue mb-6">Lista de Desejos</h2>
                  
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      Sua lista de desejos está vazia
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Adicione produtos que você gostaria de comprar mais tarde.
                    </p>
                    <Link to="/products" className="btn-cta">
                      Explorar Produtos
                    </Link>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-nile-blue mb-6">Configurações</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Notificações</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Escolha como você gostaria de ser notificado sobre ofertas e novidades.
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-pine focus:ring-pine border-gray-300 rounded" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">E-mail promocional</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-pine focus:ring-pine border-gray-300 rounded" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">Novos produtos</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-pine focus:ring-pine border-gray-300 rounded" />
                          <span className="ml-2 text-sm text-gray-700">SMS</span>
                        </label>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Privacidade</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Controle como suas informações são usadas.
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-pine focus:ring-pine border-gray-300 rounded" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">Permitir análise de dados</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-pine focus:ring-pine border-gray-300 rounded" />
                          <span className="ml-2 text-sm text-gray-700">Compartilhar dados com parceiros</span>
                        </label>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Conta</h3>
                      <div className="space-y-3">
                        <button className="text-pine hover:text-sunset-orange text-sm font-medium">
                          Alterar senha
                        </button>
                        <br />
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Excluir conta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}