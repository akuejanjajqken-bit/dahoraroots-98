import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Package, ShoppingCart, Clock, MapPin, 
  ChevronRight, Truck, CheckCircle, XCircle,
  User, Mail, Phone, CreditCard, Calendar
} from 'lucide-react';

export default function CustomerDashboard() {
  const { state } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: state.profile?.name || '',
    phone: state.profile?.phone || '',
    cpf: state.profile?.cpf || ''
  });

  useEffect(() => {
    if (state.user) {
      loadUserData();
    }
  }, [state.user]);

  useEffect(() => {
    if (state.profile) {
      setFormData({
        name: state.profile.name || '',
        phone: state.profile.phone || '',
        cpf: state.profile.cpf || ''
      });
    }
  }, [state.profile]);

  async function loadUserData() {
    try {
      // Load orders
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', state.user.id)
        .order('created_at', { ascending: false });

      setOrders(data || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <Clock size={16} />,
      'processing': <Package size={16} />,
      'shipped': <Truck size={16} />,
      'delivered': <CheckCircle size={16} />,
      'cancelled': <XCircle size={16} />
    };
    return icons[status] || null;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pendente',
      'processing': 'Processando',
      'shipped': 'Enviado',
      'delivered': 'Entregue',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  };

  async function handleSaveProfile() {
    try {
      await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          cpf: formData.cpf,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', state.user.id);

      setEditMode(false);
      alert('Dados atualizados com sucesso!');
      // Refresh profile data would be handled by auth context
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erro ao atualizar dados');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-soft border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-foreground font-graffiti">
            Minha Conta
          </h1>
          <p className="text-muted-foreground mt-1 font-urban">
            Olá, {state.profile?.name || state.user?.email}
          </p>
        </div>
      </header>

      {/* Navigation */}
      <div className="container mx-auto px-6 mt-6">
        <div className="flex space-x-6 border-b border-border">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 font-urban ${
              activeTab === 'orders'
                ? 'border-b-2 border-sunset-orange text-sunset-orange'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Meus Pedidos
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 font-urban ${
              activeTab === 'profile'
                ? 'border-b-2 border-sunset-orange text-sunset-orange'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Meus Dados
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 mt-8">
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-card rounded-lg p-12 text-center shadow-soft">
                <Package size={64} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground font-graffiti">
                  Nenhum pedido ainda
                </h3>
                <p className="text-muted-foreground mt-2 font-urban">
                  Quando você fizer seu primeiro pedido, ele aparecerá aqui.
                </p>
                <a
                  href="/products"
                  className="inline-block mt-6 bg-sunset-orange text-white px-6 py-3 rounded-lg hover:bg-sunset-orange/90 font-urban"
                >
                  Começar a Comprar
                </a>
              </div>
            ) : (
              orders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getStatusLabel={getStatusLabel}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileSection 
            profile={state.profile} 
            user={state.user}
            editMode={editMode}
            setEditMode={setEditMode}
            formData={formData}
            setFormData={setFormData}
            handleSaveProfile={handleSaveProfile}
          />
        )}
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ order, getStatusColor, getStatusIcon, getStatusLabel }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow-soft border border-border">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground font-urban">
              Pedido #{order.id.slice(0, 8)}
            </p>
            <p className="text-lg font-semibold mt-1 font-block">
              R$ {order.total?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-urban">
              {new Date(order.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {getStatusLabel(order.status)}
          </span>
        </div>

        {/* Order Tracking */}
        {order.status === 'shipped' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800">
              <Truck size={20} />
              <span className="font-semibold font-urban">Em trânsito</span>
            </div>
            <p className="text-sm text-blue-600 mt-2 font-urban">
              Previsão de entrega: 5-7 dias úteis
            </p>
            {order.tracking_code && (
              <p className="text-sm text-blue-600 mt-1 font-urban">
                Código de rastreamento: {order.tracking_code}
              </p>
            )}
          </div>
        )}

        {order.status === 'delivered' && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle size={20} />
              <span className="font-semibold font-urban">Pedido entregue</span>
            </div>
            <p className="text-sm text-green-600 mt-2 font-urban">
              Obrigado pela sua compra! Esperamos que tenha gostado dos produtos.
            </p>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sunset-orange text-sm font-semibold flex items-center gap-1 font-urban"
        >
          Ver detalhes
          <ChevronRight size={16} className={expanded ? 'rotate-90 transition-transform' : 'transition-transform'} />
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold font-urban">Status do Pedido</h4>
                <p className="text-sm text-muted-foreground font-urban">
                  {getStatusLabel(order.status)}
                </p>
              </div>
              <div>
                <h4 className="font-semibold font-urban">Total do Pedido</h4>
                <p className="text-sm text-muted-foreground font-urban">
                  R$ {order.total?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Profile Section
function ProfileSection({ profile, user, editMode, setEditMode, formData, setFormData, handleSaveProfile }) {
  return (
    <div className="bg-card rounded-lg shadow-soft border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold font-graffiti">Informações Pessoais</h2>
        <button
          onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
          className="bg-sunset-orange text-white px-4 py-2 rounded-lg hover:bg-sunset-orange/90 font-urban"
        >
          {editMode ? 'Salvar' : 'Editar'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2 font-urban">
            <Mail size={16} />
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full p-3 border border-border rounded-lg bg-muted font-urban"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2 font-urban">
            <User size={16} />
            Nome
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            disabled={!editMode}
            className="w-full p-3 border border-border rounded-lg bg-background font-urban disabled:bg-muted"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2 font-urban">
            <Phone size={16} />
            Telefone
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            disabled={!editMode}
            placeholder="(11) 99999-9999"
            className="w-full p-3 border border-border rounded-lg bg-background font-urban disabled:bg-muted"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2 font-urban">
            <CreditCard size={16} />
            CPF
          </label>
          <input
            type="text"
            value={formData.cpf}
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
            disabled={!editMode}
            placeholder="000.000.000-00"
            className="w-full p-3 border border-border rounded-lg bg-background font-urban disabled:bg-muted"
          />
        </div>

        {profile?.created_at && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2 font-urban">
              <Calendar size={16} />
              Membro desde
            </label>
            <input
              type="text"
              value={new Date(profile.created_at).toLocaleDateString('pt-BR')}
              disabled
              className="w-full p-3 border border-border rounded-lg bg-muted font-urban"
            />
          </div>
        )}
      </div>
    </div>
  );
}