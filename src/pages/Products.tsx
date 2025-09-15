import { useState } from "react";
import { Filter, Grid, List, ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Products() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "Todos", 
    "Blunts", 
    "Cases", 
    "Trituradores", 
    "Acendedores", 
    "Sedas", 
    "Filtros Piteiras", 
    "Piteiras de Vidro", 
    "Cuias", 
    "Tesouras", 
    "Potes", 
    "Cinzeiros", 
    "Reservatório"
  ];

  // Mock products data organized by category
  const productsByCategory = {
    "Blunts": Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      name: `Blunt Premium ${i + 1}`,
      price: 15.99 + (i * 5),
      originalPrice: i % 2 === 0 ? 19.99 + (i * 5) : null,
      rating: 4.5 + (Math.random() * 0.5),
      reviews: 30 + Math.floor(Math.random() * 50),
      image: "/api/placeholder/300/300",
      category: "Blunts",
      badge: i === 0 ? "Bestseller" : null,
    })),
    "Cases": Array.from({ length: 3 }, (_, i) => ({
      id: i + 10,
      name: `Case Protetor ${i + 1}`,
      price: 45.99 + (i * 10),
      originalPrice: null,
      rating: 4.3 + (Math.random() * 0.4),
      reviews: 25 + Math.floor(Math.random() * 30),
      image: "/api/placeholder/300/300",
      category: "Cases",
      badge: i === 1 ? "Novo" : null,
    })),
    "Trituradores": Array.from({ length: 2 }, (_, i) => ({
      id: i + 20,
      name: `Triturador Premium ${i + 1}`,
      price: 89.99 + (i * 20),
      originalPrice: i === 0 ? 109.99 : null,
      rating: 4.7 + (Math.random() * 0.3),
      reviews: 40 + Math.floor(Math.random() * 40),
      image: "/api/placeholder/300/300",
      category: "Trituradores",
      badge: null,
    })),
  };

  // Flatten all products for display
  const allProducts = Object.values(productsByCategory).flat();
  const priceRanges = [
    "Todos os preços",
    "Até R$ 50",
    "R$ 50 - R$ 100", 
    "R$ 100 - R$ 200",
    "Acima de R$ 200"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <div className="pt-20 pb-8 bg-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-playfair text-4xl font-bold text-foreground mb-4">
              Nossa <span className="text-gradient-sunset">Coleção</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra produtos premium cuidadosamente selecionados para elevar sua experiência
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h3 className="font-playfair text-lg font-bold mb-4">Filtros</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Categoria</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" className="text-pine" />
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Faixa de Preço</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="price" className="text-pine" />
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {range}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Avaliação</h4>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="text-pine" />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: rating }, (_, i) => (
                          <span key={i} className="text-tangerine text-sm">★</span>
                        ))}
                        <span className="text-sm text-muted-foreground">e acima</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden btn-cta flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                </button>
                 <span className="text-muted-foreground">
                  {allProducts.length} produtos encontrados
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="price-low">Menor Preço</option>
                    <option value="price-high">Maior Preço</option>
                    <option value="newest">Mais Recentes</option>
                    <option value="rating">Melhor Avaliados</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-pine text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-pine text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products by Category */}
            <div className="space-y-12">
              {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
                <div key={categoryName} id={categoryName.toLowerCase().replace(/\s+/g, '-')}>
                  {/* Category Header */}
                  <div className="mb-8">
                    <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">
                      {categoryName}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-tangerine to-sunset-orange rounded-full"></div>
                  </div>

                  {/* Category Products */}
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="product-card">
                        <div className="relative aspect-square overflow-hidden bg-light-bg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {product.badge && (
                            <span className="absolute top-3 left-3 bg-tangerine text-nile-blue text-xs font-bold px-2 py-1 rounded-full">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <span className="text-xs font-medium text-pine bg-pine/10 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                          
                          <h3 className="font-semibold text-lg mt-2 mb-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center gap-1 mb-2">
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
                            <span className="text-xs text-muted-foreground ml-1">
                              ({product.reviews})
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-pine">
                              R$ {product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                R$ {product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          <button className="w-full btn-cta mt-4">
                            Adicionar ao Carrinho
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-light-bg transition-colors">
                  Anterior
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === 1 
                        ? "bg-pine text-white" 
                        : "border border-border hover:bg-light-bg"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-light-bg transition-colors">
                  Próximo
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}