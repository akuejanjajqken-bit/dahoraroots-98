import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Glass & Bongs",
    count: 127,
    image: "/api/placeholder/400/300",
    href: "/category/glass-bongs",
    gradient: "from-pine/80 to-nile-blue/80"
  },
  {
    id: 2,
    name: "Vaporizers",
    count: 89,
    image: "/api/placeholder/400/300",
    href: "/category/vaporizers",
    gradient: "from-sunset-orange/80 to-tangerine/80"
  },
  {
    id: 3,
    name: "Grinders",
    count: 156,
    image: "/api/placeholder/400/300",
    href: "/category/grinders",
    gradient: "from-tangerine/80 to-sunset-orange/80"
  },
  {
    id: 4,
    name: "Papers & Wraps",
    count: 234,
    image: "/api/placeholder/400/300",
    href: "/category/papers-wraps",
    gradient: "from-nile-blue/80 to-pine/80"
  },
  {
    id: 5,
    name: "Accessories",
    count: 98,
    image: "/api/placeholder/400/300",
    href: "/category/accessories",
    gradient: "from-pine/80 to-sunset-orange/80"
  },
  {
    id: 6,
    name: "Lifestyle",
    count: 67,
    image: "/api/placeholder/400/300",
    href: "/category/lifestyle",
    gradient: "from-sunset-orange/80 to-pine/80"
  }
];

export default function CategoriesGrid() {
  return (
    <section className="py-16 bg-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore por <span className="text-gradient-sunset">Categoria</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o que você procura em nossa ampla seleção
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="category-card block h-64 relative"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} group-hover:opacity-90 transition-all duration-300`} />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-between p-6 text-white">
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <h3 className="font-playfair text-2xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <p className="text-white/90 font-medium">
                    {category.count} produtos
                  </p>
                </div>
                
                {/* Hover Effect - Arrow */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all duration-300">
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow rounded-xl" />
            </Link>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 bg-white rounded-2xl shadow-soft p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-pine mb-2">500+</div>
              <div className="text-muted-foreground">Produtos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sunset-orange mb-2">50K+</div>
              <div className="text-muted-foreground">Clientes Felizes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tangerine mb-2">24/7</div>
              <div className="text-muted-foreground">Suporte</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pine mb-2">4.9★</div>
              <div className="text-muted-foreground">Avaliação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}