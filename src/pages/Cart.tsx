import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';

export default function Cart() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const shippingCost = state.total >= 150 ? 0 : 15.99;
  const finalTotal = state.total + shippingCost;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="pt-20 pb-8 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/products"
              className="flex items-center gap-2 text-pine hover:text-sunset-orange transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continuar Comprando</span>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
              Seu <span className="text-gradient-sunset">Carrinho</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {state.itemCount} {state.itemCount === 1 ? 'item' : 'itens'} no seu carrinho
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-500 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Que tal adicionar alguns produtos incríveis? Temos uma seleção especial esperando por você!
            </p>
            <Link
              to="/products"
              className="btn-cta inline-flex items-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-soft p-6 flex gap-6"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-nile-blue mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {item.category}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xl text-pine">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">Qtd:</span>
                          <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Subtotal:</span>
                          <span className="font-bold text-lg text-nile-blue">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={clearCart}
                  className="text-gray-500 hover:text-red-500 transition-colors font-medium"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
                <h2 className="font-playfair text-2xl font-bold text-nile-blue mb-6">
                  Resumo do Pedido
                </h2>

                <div className="space-y-4 mb-6">
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

                  {state.total < 150 && (
                    <div className="bg-tangerine/10 border border-tangerine/20 rounded-lg p-3">
                      <p className="text-sm text-tangerine font-medium text-center">
                        Adicione mais {formatPrice(150 - state.total)} para ganhar frete grátis!
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-nile-blue">Total:</span>
                      <span className="text-pine">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full btn-cta text-center block mb-4"
                >
                  Finalizar Compra
                </Link>

                <Link
                  to="/products"
                  className="w-full py-3 border border-pine text-pine rounded-lg text-center block hover:bg-pine hover:text-white transition-colors"
                >
                  Continuar Comprando
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="text-xs text-gray-500">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <span>Pagamento Seguro</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 font-bold">🚚</span>
                      </div>
                      <span>Entrega Rápida</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}