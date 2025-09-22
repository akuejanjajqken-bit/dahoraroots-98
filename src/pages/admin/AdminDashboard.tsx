import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { adminService } from '@/services/admin';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, 
  Tag, Search, Calendar, DollarSign, Box, AlertCircle, CheckCircle,
  Eye, Settings, Download, Filter, MoreHorizontal, Activity,
  ShoppingBag, UserPlus, Percent, Clock, Star
} from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import TypewriterText from '@/components/animations/TypewriterText';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
}

interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  cpf: string;
  created_at: string;
  last_login: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  product_id: string;
  valid_until: string;
  max_uses: number;
  current_uses: number;
  active: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { state } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: ''
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_percentage: '',
    product_id: '',
    valid_until: '',
    max_uses: '1'
  });

  // Check admin access
  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user is admin by email
    const isAdmin = state.user?.email === 'arkkhecorp@gmail.com';
    if (!isAdmin) {
      navigate('/');
      return;
    }

    loadDashboardData();
  }, [state.isAuthenticated, state.user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsRes, productsRes, ordersRes, customersRes, couponsRes] = await Promise.all([
        adminService.getStats(),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('coupons').select('*').order('created_at', { ascending: false })
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (customersRes.data) setCustomers(customersRes.data);
      if (couponsRes.data) setCoupons(couponsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      };

      if (editingProduct) {
        await supabase.from('products').update(productData).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert(productData);
      }

      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', stock: '', category: '', image_url: '' });
      loadDashboardData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleSaveCoupon = async () => {
    try {
      const couponData = {
        ...couponForm,
        discount_percentage: parseInt(couponForm.discount_percentage),
        max_uses: parseInt(couponForm.max_uses),
        code: couponForm.code.toUpperCase()
      };

      if (editingCoupon) {
        await supabase.from('coupons').update(couponData).eq('id', editingCoupon.id);
      } else {
        await supabase.from('coupons').insert(couponData);
      }

      setShowCouponModal(false);
      setEditingCoupon(null);
      setCouponForm({ code: '', discount_percentage: '', product_id: '', valid_until: '', max_uses: '1' });
      loadDashboardData();
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Confirma a exclusão deste produto?')) {
      await supabase.from('products').delete().eq('id', id);
      loadDashboardData();
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (confirm('Confirma a exclusão deste cupom?')) {
      await supabase.from('coupons').delete().eq('id', id);
      loadDashboardData();
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    loadDashboardData();
  };

  // Chart data preparation
  const salesChartData = orders.reduce((acc, order) => {
    const month = new Date(order.created_at).toLocaleDateString('pt-BR', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.vendas += (order.total || 0);
    } else {
      acc.push({ month, vendas: (order.total || 0) });
    }
    return acc;
  }, [] as { month: string; vendas: number }[]);

  const categoryData = products.reduce((acc, product) => {
    const category = product.category || 'Sem categoria';
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#E16A3D', '#FEA450', '#016A6D', '#22C55E', '#8B5CF6', '#F59E0B'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-primary via-primary to-secondary text-white shadow-2xl"
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <TypewriterText 
                text="Dashboard Administrativo"
                className="text-3xl font-graffiti font-black"
                speed={80}
              />
              <p className="mt-2 text-white/90">Bem-vindo de volta, {state.user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm">Online</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal direction="up" delay={0.1}>
            <StatCard
              icon={<DollarSign />}
              title="Receita Total"
              value={`R$ ${stats.totalRevenue.toFixed(2)}`}
              change="+12%"
              color="from-green-500 to-green-600"
            />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <StatCard
              icon={<ShoppingCart />}
              title="Pedidos"
              value={stats.totalOrders.toString()}
              change="+8%"
              color="from-blue-500 to-blue-600"
            />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <StatCard
              icon={<Package />}
              title="Produtos"
              value={stats.totalProducts.toString()}
              change="+3%"
              color="from-purple-500 to-purple-600"
            />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.4}>
            <StatCard
              icon={<Users />}
              title="Clientes"
              value={stats.totalUsers.toString()}
              change="+15%"
              color="from-orange-500 to-orange-600"
            />
          </ScrollReveal>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 mt-12">
        <div className="flex flex-wrap gap-2 border-b border-border">
          {[
            { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
            { id: 'products', label: 'Produtos', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
            { id: 'coupons', label: 'Cupons', icon: Tag },
            { id: 'customers', label: 'Clientes', icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-6 py-2 rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 mt-8 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab 
                stats={stats} 
                salesData={salesChartData} 
                categoryData={categoryData} 
                colors={COLORS}
              />
            )}
            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setProductForm({
                    name: product.name,
                    description: product.description || '',
                    price: product.price.toString(),
                    stock: product.stock.toString(),
                    category: product.category || '',
                    image_url: product.image_url || ''
                  });
                  setShowProductModal(true);
                }}
                onDelete={handleDeleteProduct}
                onAdd={() => setShowProductModal(true)}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
            )}
            {activeTab === 'coupons' && (
              <CouponsTab
                coupons={coupons}
                products={products}
                onEdit={(coupon) => {
                  setEditingCoupon(coupon);
                  setCouponForm({
                    code: coupon.code,
                    discount_percentage: coupon.discount_percentage.toString(),
                    product_id: coupon.product_id || '',
                    valid_until: coupon.valid_until.split('T')[0],
                    max_uses: coupon.max_uses.toString()
                  });
                  setShowCouponModal(true);
                }}
                onDelete={handleDeleteCoupon}
                onAdd={() => setShowCouponModal(true)}
              />
            )}
            {activeTab === 'customers' && <CustomersTab customers={customers} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setEditingProduct(null);
          setProductForm({ name: '', description: '', price: '', stock: '', category: '', image_url: '' });
        }}
        product={productForm}
        onProductChange={setProductForm}
        onSave={handleSaveProduct}
        isEditing={!!editingProduct}
      />

      <CouponModal
        isOpen={showCouponModal}
        onClose={() => {
          setShowCouponModal(false);
          setEditingCoupon(null);
          setCouponForm({ code: '', discount_percentage: '', product_id: '', valid_until: '', max_uses: '1' });
        }}
        coupon={couponForm}
        onCouponChange={setCouponForm}
        onSave={handleSaveCoupon}
        products={products}
        isEditing={!!editingCoupon}
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  color: string;
}

function StatCard({ icon, title, value, change, color }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-card rounded-2xl shadow-lg p-6 border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white shadow-lg`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
          {change}
        </span>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
}

function OverviewTab({ stats, salesData, categoryData, colors }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sales Chart */}
      <ScrollReveal direction="left">
        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Vendas por Mês
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="vendas" stroke="#E16A3D" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ScrollReveal>

      {/* Category Distribution */}
      <ScrollReveal direction="right">
        <div className="bg-card rounded-2xl shadow-lg p-6 border border-border/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Produtos por Categoria
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

// ProductsTab component
function ProductsTab({ products, onEdit, onDelete, onAdd }: { products: Product[], onEdit: (product: Product) => void, onDelete: (id: string) => void, onAdd: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <button
          onClick={onAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Adicionar Produto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-border rounded-lg">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="border border-border px-4 py-2 text-left">Nome</th>
              <th className="border border-border px-4 py-2 text-left">Categoria</th>
              <th className="border border-border px-4 py-2 text-right">Preço</th>
              <th className="border border-border px-4 py-2 text-right">Estoque</th>
              <th className="border border-border px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-muted/20">
                <td className="border border-border px-4 py-2">{product.name}</td>
                <td className="border border-border px-4 py-2">{product.category}</td>
                <td className="border border-border px-4 py-2 text-right">R$ {product.price.toFixed(2)}</td>
                <td className="border border-border px-4 py-2 text-right">{product.stock}</td>
                <td className="border border-border px-4 py-2 text-center flex justify-center gap-2">
                  <button onClick={() => onEdit(product)} className="btn-secondary p-1 rounded" title="Editar">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => onDelete(product.id)} className="btn-danger p-1 rounded" title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">Nenhum produto encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// OrdersTab component
function OrdersTab({ orders, onUpdateStatus }: { orders: Order[], onUpdateStatus: (orderId: string, newStatus: string) => void }) {
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pedidos</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-border rounded-lg">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="border border-border px-4 py-2 text-left">ID</th>
              <th className="border border-border px-4 py-2 text-left">Cliente</th>
              <th className="border border-border px-4 py-2 text-right">Total</th>
              <th className="border border-border px-4 py-2 text-left">Status</th>
              <th className="border border-border px-4 py-2 text-left">Data</th>
              <th className="border border-border px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-muted/20">
                <td className="border border-border px-4 py-2">{order.id.slice(0, 8)}</td>
                <td className="border border-border px-4 py-2">{order.user_id}</td>
                <td className="border border-border px-4 py-2 text-right">R$ {order.total.toFixed(2)}</td>
                <td className="border border-border px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                    className="bg-muted rounded px-2 py-1"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="border border-border px-4 py-2">{new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="border border-border px-4 py-2 text-center">
                  <button className="btn-secondary p-1 rounded" title="Ver detalhes">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted-foreground">Nenhum pedido encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// CouponsTab component
function CouponsTab({ coupons, products, onEdit, onDelete, onAdd }: { coupons: Coupon[], products: Product[], onEdit: (coupon: Coupon) => void, onDelete: (id: string) => void, onAdd: () => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cupons</h2>
        <button
          onClick={onAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Adicionar Cupom
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-border rounded-lg">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="border border-border px-4 py-2 text-left">Código</th>
              <th className="border border-border px-4 py-2 text-left">Desconto (%)</th>
              <th className="border border-border px-4 py-2 text-left">Produto</th>
              <th className="border border-border px-4 py-2 text-left">Validade</th>
              <th className="border border-border px-4 py-2 text-right">Usos</th>
              <th className="border border-border px-4 py-2 text-center">Ativo</th>
              <th className="border border-border px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => {
              const product = products.find(p => p.id === coupon.product_id);
              return (
                <tr key={coupon.id} className="hover:bg-muted/20">
                  <td className="border border-border px-4 py-2">{coupon.code}</td>
                  <td className="border border-border px-4 py-2">{coupon.discount_percentage}%</td>
                  <td className="border border-border px-4 py-2">{product ? product.name : 'N/A'}</td>
                  <td className="border border-border px-4 py-2">{new Date(coupon.valid_until).toLocaleDateString('pt-BR')}</td>
                  <td className="border border-border px-4 py-2 text-right">{coupon.current_uses} / {coupon.max_uses}</td>
                  <td className="border border-border px-4 py-2 text-center">
                    {coupon.active ? <CheckCircle className="text-green-500 mx-auto" /> : <AlertCircle className="text-red-500 mx-auto" />}
                  </td>
                  <td className="border border-border px-4 py-2 text-center flex justify-center gap-2">
                    <button onClick={() => onEdit(coupon)} className="btn-secondary p-1 rounded" title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(coupon.id)} className="btn-danger p-1 rounded" title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted-foreground">Nenhum cupom encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// CustomersTab component
function CustomersTab({ customers }: { customers: Customer[] }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Clientes</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-border rounded-lg">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="border border-border px-4 py-2 text-left">Nome</th>
              <th className="border border-border px-4 py-2 text-left">Email</th>
              <th className="border border-border px-4 py-2 text-left">Telefone</th>
              <th className="border border-border px-4 py-2 text-left">CPF</th>
              <th className="border border-border px-4 py-2 text-left">Último Login</th>
              <th className="border border-border px-4 py-2 text-left">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="hover:bg-muted/20">
                <td className="border border-border px-4 py-2">{customer.name}</td>
                <td className="border border-border px-4 py-2">{customer.email}</td>
                <td className="border border-border px-4 py-2">{customer.phone}</td>
                <td className="border border-border px-4 py-2">{customer.cpf}</td>
                <td className="border border-border px-4 py-2">{customer.last_login ? new Date(customer.last_login).toLocaleDateString('pt-BR') : '-'}</td>
                <td className="border border-border px-4 py-2">{new Date(customer.created_at).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted-foreground">Nenhum cliente encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ProductModal component
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    price: string;
    stock: string;
    category: string;
    image_url: string;
  };
  onProductChange: (product: any) => void;
  onSave: () => void;
  isEditing: boolean;
}

function ProductModal({ isOpen, onClose, product, onProductChange, onSave, isEditing }: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Nome</label>
            <input
              type="text"
              value={product.name}
              onChange={e => onProductChange({ ...product, name: e.target.value })}
              className="input-primary w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Descrição</label>
            <textarea
              value={product.description}
              onChange={e => onProductChange({ ...product, description: e.target.value })}
              className="input-primary w-full"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={product.price}
                onChange={e => onProductChange({ ...product, price: e.target.value })}
                className="input-primary w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Estoque</label>
              <input
                type="number"
                value={product.stock}
                onChange={e => onProductChange({ ...product, stock: e.target.value })}
                className="input-primary w-full"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Categoria</label>
            <input
              type="text"
              value={product.category}
              onChange={e => onProductChange({ ...product, category: e.target.value })}
              className="input-primary w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">URL da Imagem</label>
            <input
              type="url"
              value={product.image_url}
              onChange={e => onProductChange({ ...product, image_url: e.target.value })}
              className="input-primary w-full"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">{isEditing ? 'Salvar' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// CouponModal component
interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: {
    code: string;
    discount_percentage: string;
    product_id: string;
    valid_until: string;
    max_uses: string;
  };
  onCouponChange: (coupon: any) => void;
  onSave: () => void;
  products: Product[];
  isEditing: boolean;
}

function CouponModal({ isOpen, onClose, coupon, onCouponChange, onSave, products, isEditing }: CouponModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Editar Cupom' : 'Adicionar Cupom'}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Código</label>
            <input
              type="text"
              value={coupon.code}
              onChange={e => onCouponChange({ ...coupon, code: e.target.value })}
              className="input-primary w-full"
              required
              maxLength={20}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Desconto (%)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={coupon.discount_percentage}
              onChange={e => onCouponChange({ ...coupon, discount_percentage: e.target.value })}
              className="input-primary w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Produto</label>
            <select
              value={coupon.product_id}
              onChange={e => onCouponChange({ ...coupon, product_id: e.target.value })}
              className="input-primary w-full"
            >
              <option value="">Todos os produtos</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Validade</label>
            <input
              type="date"
              value={coupon.valid_until}
              onChange={e => onCouponChange({ ...coupon, valid_until: e.target.value })}
              className="input-primary w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Máximo de usos</label>
            <input
              type="number"
              min={1}
              value={coupon.max_uses}
              onChange={e => onCouponChange({ ...coupon, max_uses: e.target.value })}
              className="input-primary w-full"
              required
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">{isEditing ? 'Salvar' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
