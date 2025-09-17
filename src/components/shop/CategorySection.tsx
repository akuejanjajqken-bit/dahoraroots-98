import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Zap, Award, Package, Droplets, Scissors, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/data/products';

interface CategorySectionProps {
  categoryName: string;
  categorySlug: string;
  products: Product[];
  description: string;
  iconName: string;
}

export default function CategorySection({ 
  categoryName, 
  categorySlug, 
  products, 
  description, 
  iconName 
}: CategorySectionProps) {
  const { addItem } = useCart();

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Heart: <Heart className="h-8 w-8 text-white" />,
      Shield: <Shield className="h-8 w-8 text-white" />,
      Zap: <Zap className="h-8 w-8 text-white" />,
      Star: <Star className="h-8 w-8 text-white" />,
      Package: <Package className="h-8 w-8 text-white" />,
      Droplets: <Droplets className="h-8 w-8 text-white" />,
      Award: <Award className="h-8 w-8 text-white" />,
      Scissors: <Scissors className="h-8 w-8 text-white" />,
      Clock: <Clock className="h-8 w-8 text-white" />,
    };
    return icons[iconName] || <Package className="h-8 w-8 text-white" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-tangerine text-tangerine"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (products.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {getIcon(iconName)}
            </div>
            <h2 className="font-playfair text-3xl font-bold text-nile-blue mb-4">
              {categoryName}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            <div className="bg-gray-50 rounded-xl p-8">
              <p className="text-gray-500">
                Em breve, produtos incríveis desta categoria estarão disponíveis!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-tangerine to-sunset-orange rounded-full flex items-center justify-center mx-auto mb-6">
            {getIcon(iconName)}
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-nile-blue mb-4">
            {categoryName}
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {description}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-tangerine to-sunset-orange rounded-full mx-auto"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-tangerine/20"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-tangerine text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}

                {/* Quick Add Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => addItem(product)}
                    className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-tangerine text-white px-6 py-3 rounded-lg font-semibold hover:bg-sunset-orange"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-pine bg-pine/10 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="block hover:text-tangerine transition-colors duration-200"
                >
                  <h3 className="font-semibold text-lg mb-2 text-nile-blue line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-pine">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to={`/products?category=${categorySlug}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-tangerine to-sunset-orange text-white px-8 py-3 rounded-xl font-semibold hover:from-sunset-orange hover:to-tangerine transition-all duration-300 hover:scale-105"
          >
            Ver Todos os {categoryName}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}