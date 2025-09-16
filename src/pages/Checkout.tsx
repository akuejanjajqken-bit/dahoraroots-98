import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';

export default function Checkout() {
  const { state, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cep: '',
    address: '',
    city: '',
    state: '',
    paymentMethod: 'pix'
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const shippingCost = state.total >= 150 ? 0 : 15.99;
  const finalTotal = state.total + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a integração com o gateway de pagamento
    alert('Pedido realizado com sucesso! (Simulação)');
    clearCart();
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-8 bg-light-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
              Carrinho Vazio
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Adicione alguns produtos ao seu carrinho antes de finalizar a compra.
            </p>
            <Link to="/products" className="btn-cta">
              Ver Produtos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="pt-20 pb-8 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/cart"
              className="flex items-center gap-2 text-pine hover:text-sunset-orange transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar ao Carrinho</span>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
              Finalizar <span className="text-gradient-sunset">Compra</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete seus dados para finalizar o pedido
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="h-6 w-6 text-pine" />
                <h2 className="text-xl font-bold text-nile-blue">Dados Pessoais</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-6 w-6 text-pine" />
                <h2 className="text-xl font-bold text-nile-blue">Endereço de Entrega</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pine focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="BA">Bahia</option>
                    <option value="GO">Goiás</option>
                    <option value="PE">Pernambuco</option>
                    <option value="CE">Ceará</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-pine" />
                <h2 className="text-xl font-bold text-nile-blue">Forma de Pagamento</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix"
                    checked={formData.paymentMethod === 'pix'}
                    onChange={handleInputChange}
                    className="text-pine"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">PIX</span>
                    </div>
                    <div>
                      <div className="font-semibold">PIX</div>
                      <div className="text-sm text-gray-500">Aprovação imediata</div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={formData.paymentMethod === 'credit'}
                    onChange={handleInputChange}
                    className="text-pine"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-semibold">Cartão de Crédito</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, Elo</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
              <h2 className="font-playfair text-2xl font-bold text-nile-blue mb-6">
                Resumo do Pedido
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-nile-blue truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                      <p className="text-sm font-semibold text-pine">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(state.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete:</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-nile-blue">Total:</span>
                    <span className="text-pine">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-cta mb-4"
              >
                Finalizar Pedido
              </button>

              {/* Security Notice */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🔒 Seus dados estão protegidos com criptografia SSL
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}