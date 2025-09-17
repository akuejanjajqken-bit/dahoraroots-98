import { useState, useEffect } from "react";
import { Filter, Grid, List, ChevronDown, Search, Heart, Shield, Zap, Star, Package, Droplets, Award, Scissors, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import CategorySection from "@/components/shop/CategorySection";
import { categoriesData, getAllProducts, getProductsByCategory, getCategoryInfo } from "@/data/products";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { addItem } = useCart();

  // Get category from URL params
  const categoryFromUrl = searchParams.get('category') || '';

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const categories = [
    { name: "Todos", slug: "" },
    ...categoriesData.map(cat => ({ name: cat.name, slug: cat.slug }))
  ];

  const priceRanges = [
    "Todos os preços",
    "Até R$ 50",
    "R$ 50 - R$ 100", 
    "R$ 100 - R$ 200",
    "Acima de R$ 200"
  ];

  // Get products based on selected category
  const getCurrentProducts = () => {
    if (selectedCategory) {
      return getProductsByCategory(selectedCategory);
    }
    return getAllProducts();
  };

  const currentProducts = getCurrentProducts();
  const currentCategory = selectedCategory ? getCategoryInfo(selectedCategory) : null;

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

  // If no specific category is selected, show all categories
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Page Header */}
        <div className="pt-20 pb-8 bg-gradient-to-br from-nile-blue to-pine relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-tangerine/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-sunset-orange/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="font-graffiti text-4xl md:text-5xl font-bold text-white mb-6">
                Nossa <span className="text-gradient-sunset">Coleção</span>
              </h1>
              <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
                Descubra produtos premium cuidadosamente selecionados para elevar sua experiência. 
                Cada categoria foi pensada para atender suas necessidades específicas.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-block text-3xl font-bold text-nile-blue mb-4">
                Explore por <span className="text-gradient-sunset">Categorias</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Navegue pelas nossas categorias e encontre exatamente o que você procura
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoriesData.map((category) => (
                <div
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className="group cursor-pointer bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-tangerine/20"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-tangerine to-sunset-orange rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {getIcon(category.iconName)}
                  </div>
                  <h3 className="text-lg font-semibold text-nile-blue mb-2 group-hover:text-tangerine transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.products.length} produtos
                    </span>
                    <span className="text-tangerine text-sm font-medium group-hover:translate-x-1 transition-transform">
                      Ver todos →
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
      <div className="pt-20 pb-8 bg-gradient-to-br from-nile-blue to-pine relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-tangerine/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-sunset-orange/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="font-graffiti text-4xl md:text-5xl font-bold text-white mb-6">
              {currentCategory?.name}
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              {currentCategory?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-soft p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-nile-blue">Filtros</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-500 hover:text-tangerine"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar produtos..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tangerine focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categorias
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-tangerine text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Faixa de Preço
                  </label>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {currentProducts.length} produtos encontrados
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Ordenar:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tangerine focus:border-transparent"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                    <option value="rating">Melhor Avaliado</option>
                    <option value="newest">Mais Recente</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-tangerine text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-tangerine text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-tangerine/20 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Product Image */}
                  <div className={`relative overflow-hidden bg-gray-100 ${
                    viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'
                  }`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-tangerine text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}

                    {/* Quick Add Button */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => addItem(product)}
                        className="opacity-0 hover:opacity-100 transform translate-y-4 hover:translate-y-0 transition-all duration-300 bg-tangerine text-white px-4 py-2 rounded-lg font-semibold hover:bg-sunset-orange"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-pine bg-pine/10 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(product.rating)
                                ? "text-tangerine"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 text-nile-blue line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-pine">
                          R$ {product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Products Message */}
            {currentProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-500 mb-6">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="bg-tangerine text-white px-6 py-3 rounded-lg font-semibold hover:bg-sunset-orange transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}