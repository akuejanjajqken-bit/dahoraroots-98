import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  Package, ShoppingCart, Users, TrendingUp, 
  Plus, Edit, Trash2, Tag, Search, Calendar,
  DollarSign, Box, AlertCircle, CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });

  // Check if user has admin role
  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
  }, []);

  async function checkAdminAccess() {
    if (!state.user) {
      navigate('/login');
      return;
    }

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', state.user.id)
      .single();

    if (roleData?.role !== 'admin' && state.user.email !== 'arrkkhecorp@gmail.com') {
      navigate('/');
      return;
    }
  }

  async function loadDashboardData() {
    try {
      // Load all data in parallel
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*', { count: 'exact' })
      ]);

      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      setCustomers(customersRes.data || []);

      // Calculate stats
      const totalSales = ordersRes.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      setStats({
        totalSales,
        totalOrders: ordersRes.data?.length || 0,
        totalProducts: productsRes.data?.length || 0,
        totalCustomers: customersRes.count || 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-sunset-orange to-tangerine text-white">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold font-graffiti">Painel Administrativo</h1>
          <p className="mt-2 font-urban">Bem-vindo, {state.profile?.name || state.user?.email}</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<DollarSign />}
            title="Vendas Totais"
            value={`R$ ${stats.totalSales.toFixed(2)}`}
            color="bg-green-500"
          />
          <StatCard
            icon={<ShoppingCart />}
            title="Pedidos"
            value={stats.totalOrders}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Package />}
            title="Produtos"
            value={stats.totalProducts}
            color="bg-purple-500"
          />
          <StatCard
            icon={<Users />}
            title="Clientes"
            value={stats.totalCustomers}
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 mt-8">
        <div className="flex space-x-6 border-b border-border">
          {[
            { key: 'overview', label: 'Visão Geral' },
            { key: 'products', label: 'Produtos' },
            { key: 'orders', label: 'Pedidos' },
            { key: 'customers', label: 'Clientes' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-4 font-urban ${
                activeTab === tab.key 
                  ? 'border-b-2 border-sunset-orange text-sunset-orange' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 mt-8">
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'products' && <ProductsManager products={products} onUpdate={loadDashboardData} />}
        {activeTab === 'orders' && <OrdersManager orders={orders} />}
        {activeTab === 'customers' && <CustomersManager customers={customers} />}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-card rounded-lg shadow-soft p-6 hover:shadow-deep transition-all duration-300">
      <div className="flex items-center">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-muted-foreground text-sm font-urban">{title}</p>
          <p className="text-2xl font-bold font-block">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats }) {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg shadow-soft p-6">
        <h2 className="text-xl font-bold font-graffiti mb-4">Resumo do Negócio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg font-urban mb-2">Vendas Recentes</h3>
            <p className="text-3xl font-bold text-pine">R$ {stats.totalSales.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total de vendas realizadas</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg font-urban mb-2">Crescimento</h3>
            <p className="text-3xl font-bold text-tangerine">+{stats.totalOrders}</p>
            <p className="text-sm text-muted-foreground">Pedidos processados</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Products Manager Component
function ProductsManager({ products, onUpdate }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: ''
  });

  async function handleSaveProduct() {
    try {
      if (editingProduct) {
        // Update existing product
        await supabase
          .from('products')
          .update({
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock) || 0
          })
          .eq('id', editingProduct.id);
      } else {
        // Create new product
        await supabase.from('products').insert({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          created_at: new Date().toISOString()
        });
      }

      setShowAddModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image_url: ''
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto');
    }
  }

  async function handleDeleteProduct(id) {
    if (confirm('Confirma a exclusão deste produto?')) {
      try {
        await supabase.from('products').delete().eq('id', id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erro ao excluir produto');
      }
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-soft">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-xl font-bold font-graffiti">Gerenciar Produtos</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-sunset-orange text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sunset-orange/90 font-urban"
        >
          <Plus size={20} />
          Adicionar Produto
        </button>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-urban">Imagem</th>
                <th className="text-left py-3 font-urban">Nome</th>
                <th className="text-left py-3 font-urban">Categoria</th>
                <th className="text-left py-3 font-urban">Preço</th>
                <th className="text-left py-3 font-urban">Estoque</th>
                <th className="text-left py-3 font-urban">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-border">
                  <td className="py-3">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="py-3 font-urban">{product.name}</td>
                  <td className="py-3 font-urban">{product.category}</td>
                  <td className="py-3 font-block">R$ {product.price.toFixed(2)}</td>
                  <td className="py-3 font-urban">{product.stock}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setFormData(product);
                          setShowAddModal(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold font-graffiti mb-4">
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome do produto"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-border rounded-lg bg-background font-urban"
              />
              <textarea
                placeholder="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-border rounded-lg bg-background font-urban"
                rows={3}
              />
              <input
                type="number"
                placeholder="Preço"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-3 border border-border rounded-lg bg-background font-urban"
              />
              <input
                type="number"
                placeholder="Estoque"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full p-3 border border-border rounded-lg bg-background font-urban"
              />
              <input
                type="text"
                placeholder="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border border-border rounded-lg bg-background font-urban"
              />
              <input
                type="text"
                placeholder="URL da imagem"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full p-3 border border-border rounded-lg bg-background font-urban"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveProduct}
                className="flex-1 bg-sunset-orange text-white py-2 rounded-lg hover:bg-sunset-orange/90 font-urban"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
                className="flex-1 bg-muted py-2 rounded-lg hover:bg-muted/80 font-urban"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Orders Manager Component
function OrdersManager({ orders }) {
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

  async function updateOrderStatus(orderId, newStatus) {
    try {
      await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      // Refresh the page or update local state
      window.location.reload();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erro ao atualizar status do pedido');
    }
  }

  return (
    <div className="bg-card rounded-lg shadow-soft">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold font-graffiti">Gerenciar Pedidos</h2>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-urban">Pedido</th>
                <th className="text-left py-3 font-urban">Data</th>
                <th className="text-left py-3 font-urban">Total</th>
                <th className="text-left py-3 font-urban">Status</th>
                <th className="text-left py-3 font-urban">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border">
                  <td className="py-3 font-urban">#{order.id.slice(0, 8)}</td>
                  <td className="py-3 font-urban">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 font-block">R$ {order.total?.toFixed(2) || '0.00'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border border-border rounded px-2 py-1 text-sm bg-background font-urban"
                    >
                      <option value="pending">Pendente</option>
                      <option value="processing">Processando</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregue</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Customers Manager Component
function CustomersManager({ customers }) {
  return (
    <div className="bg-card rounded-lg shadow-soft">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold font-graffiti">Gerenciar Clientes</h2>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-urban">Nome</th>
                <th className="text-left py-3 font-urban">Email</th>
                <th className="text-left py-3 font-urban">Telefone</th>
                <th className="text-left py-3 font-urban">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} className="border-b border-border">
                  <td className="py-3 font-urban">{customer.name || 'N/A'}</td>
                  <td className="py-3 font-urban">{customer.user_id}</td>
                  <td className="py-3 font-urban">{customer.phone || 'N/A'}</td>
                  <td className="py-3 font-urban">
                    {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}