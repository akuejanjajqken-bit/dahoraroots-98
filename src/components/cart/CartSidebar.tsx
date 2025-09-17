import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

export default function CartSidebar() {
  const { state, removeItem, updateQuantity, clearCart, toggleCart } = useCart();

  const handleQuantityChange = (id: string, newQuantity: number) => {
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

  return (
    <>
      {/* Overlay */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={toggleCart}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-pine" />
              <h2 className="text-xl font-bold text-nile-blue">
                Carrinho ({state.itemCount})
              </h2>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-gray-400 mb-6">
                  Adicione alguns produtos incríveis para começar!
                </p>
                <Link
                  to="/products"
                  onClick={toggleCart}
                  className="btn-cta"
                >
                  Ver Produtos
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-nile-blue truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {item.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-pine">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-nile-blue">Total:</span>
                <span className="text-pine">{formatPrice(state.total)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="w-full btn-cta text-center block"
                >
                  Finalizar Compra
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full py-3 text-gray-500 hover:text-red-500 transition-colors font-medium"
                >
                  Limpar Carrinho
                </button>
              </div>

              {/* Free Shipping Notice */}
              {state.total < 150 && (
                <div className="bg-tangerine/10 border border-tangerine/20 rounded-lg p-3 text-center">
                  <p className="text-sm text-tangerine font-medium">
                    Adicione mais {formatPrice(150 - state.total)} para ganhar frete grátis!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}