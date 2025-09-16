import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import SpotlightCard from "@/components/ui/spotlight-card";
import { useCart } from "@/contexts/CartContext";
import stickersImage from "@/assets/stickers-collage.jpg";
import sadhuImage from "@/assets/sadhu-products.jpg";
import dixavadoresImage from "@/assets/dixavadores-collection.webp";
import piteirasImage from "@/assets/piteiras-vidro.jpg";

const featuredProducts = [
  {
    id: 1,
    name: "Blunts de Tabaco Premium",
    description: "Blunts artesanais de tabaco natural com sabores únicos",
    price: 45.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviews: 127,
    image: stickersImage,
    badge: "Bestseller",
    category: "Blunts"
  },
  {
    id: 2,
    name: "Coleção Sadhu Completa",
    description: "Produtos exclusivos da marca Sadhu para experiências autênticas",
    price: 189.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 89,
    image: sadhuImage,
    badge: "Novo",
    category: "Sadhu"
  },
  {
    id: 3,
    name: "Dixavadores Especiais",
    description: "Dixavadores únicos para uma experiência diferenciada",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.7,
    reviews: 234,
    image: dixavadoresImage,
    badge: null,
    category: "Dixavadores"
  },
  {
    id: 4,
    name: "Piteiras de Vidro Artesanais",
    description: "Piteiras de vidro borossilicato feitas à mão por artesãos",
    price: 79.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 156,
    image: piteirasImage,
    badge: "Premium",
    category: "Piteiras"
  }
];

export default function FeaturedProducts() {
  const { addItem } = useCart();

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

  const handleAddToCart = (product: any) => {
    addItem(product);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-nile-blue to-pine relative">
      {/* Glassmorphism Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-tangerine/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-sunset-orange/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Produtos em <span className="text-gradient-sunset">Destaque</span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Nossa seleção dos produtos mais populares e bem avaliados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <SpotlightCard 
              key={product.id} 
              className="group cursor-pointer p-0 border-white/10 hover:border-white/30"
              spotlightColor="hsla(var(--tangerine), 0.3)"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden rounded-2xl mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-tangerine text-nile-blue text-xs font-bold px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 border border-white/20 transition-colors duration-200">
                    <Heart className="h-4 w-4 text-white hover:text-tangerine transition-colors" />
                  </button>
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 border border-white/20 transition-colors duration-200">
                    <Eye className="h-4 w-4 text-white hover:text-pine transition-colors" />
                  </button>
                </div>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-white/20 backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="px-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-tangerine bg-tangerine/20 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="text-xs text-white/60 ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <Link
                  to={`/product/${product.id}`}
                  className="block hover:text-tangerine transition-colors duration-200"
                >
                  <h3 className="font-semibold text-lg mb-2 text-white line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-white/70 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                </Link>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-tangerine">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-white/50 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-tangerine text-tangerine font-semibold rounded-xl hover:bg-tangerine hover:text-nile-blue backdrop-blur-sm bg-white/10 transition-all duration-300"
          >
            Ver Todos os Produtos
          </Link>
        </div>
      </div>
    </section>
  );
}