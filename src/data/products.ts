export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  products: Product[];
}

// Mock products organized by category
export const categoriesData: Category[] = [
  {
    name: "Blunts",
    slug: "blunts",
    description: "Blunts de tabaco premium e wraps artesanais para uma experiência única",
    iconName: "Heart",
    products: [
      {
        id: 1,
        name: "Blunts de Tabaco Premium",
        description: "Blunts artesanais de tabaco natural com sabores únicos",
        price: 45.99,
        originalPrice: 59.99,
        image: "/api/placeholder/300/300",
        category: "Blunts",
        rating: 4.9,
        reviews: 127,
        badge: "Bestseller"
      },
      {
        id: 2,
        name: "Kit Completo Iniciante",
        description: "Kit com todos os acessórios essenciais para começar",
        price: 199.99,
        originalPrice: 249.99,
        image: "/api/placeholder/300/300",
        category: "Blunts",
        rating: 4.8,
        reviews: 156,
        badge: "Oferta"
      },
      {
        id: 3,
        name: "Slap Woods Wraps",
        description: "Wraps premium com sabor natural de tabaco",
        price: 35.99,
        image: "/api/placeholder/300/300",
        category: "Blunts",
        rating: 4.7,
        reviews: 89,
        badge: "Novo"
      }
    ]
  },
  {
    name: "Cases",
    slug: "cases",
    description: "Cases protetores resistentes com design único para seus acessórios",
    iconName: "Shield",
    products: [
      {
        id: 4,
        name: "Coleção Sadhu Completa",
        description: "Produtos exclusivos da marca Sadhu para experiências autênticas",
        price: 189.99,
        image: "/api/placeholder/300/300",
        category: "Cases",
        rating: 4.8,
        reviews: 89,
        badge: "Novo"
      },
      {
        id: 5,
        name: "Case Protetor Sadhu",
        description: "Case resistente com design único da Sadhu",
        price: 89.99,
        image: "/api/placeholder/300/300",
        category: "Cases",
        rating: 4.5,
        reviews: 92
      }
    ]
  },
  {
    name: "Trituradores",
    slug: "trituradores",
    description: "Trituradores manuais e elétricos de alta qualidade",
    iconName: "Zap",
    products: [
      {
        id: 6,
        name: "Dixavadores Especiais",
        description: "Dixavadores únicos para uma experiência diferenciada",
        price: 24.99,
        originalPrice: 29.99,
        image: "/api/placeholder/300/300",
        category: "Trituradores",
        rating: 4.7,
        reviews: 234
      },
      {
        id: 7,
        name: "Triturador Elétrico Premium",
        description: "Triturador elétrico com potência e praticidade",
        price: 129.99,
        originalPrice: 159.99,
        image: "/api/placeholder/300/300",
        category: "Trituradores",
        rating: 4.6,
        reviews: 78,
        badge: "Lançamento"
      }
    ]
  },
  {
    name: "Acendedores",
    slug: "acendedores",
    description: "Acendedores e isqueiros de qualidade premium",
    iconName: "Star",
    products: [
      {
        id: 8,
        name: "Isqueiro Clipper Premium",
        description: "Isqueiro refilável com design clássico",
        price: 19.99,
        image: "/api/placeholder/300/300",
        category: "Acendedores",
        rating: 4.5,
        reviews: 156
      }
    ]
  },
  {
    name: "Sedas",
    slug: "sedas",
    description: "Papéis de enrolar de alta qualidade e diferentes tamanhos",
    iconName: "Package",
    products: [
      {
        id: 9,
        name: "Sedas Premium",
        description: "Papéis de enrolar de alta qualidade",
        price: 12.99,
        image: "/api/placeholder/300/300",
        category: "Sedas",
        rating: 4.4,
        reviews: 89
      }
    ]
  },
  {
    name: "Filtros Piteiras",
    slug: "filtros-piteiras",
    description: "Filtros e piteiras de papel para uma experiência mais suave",
    iconName: "Droplets",
    products: [
      {
        id: 10,
        name: "Piteiras de Papel Premium",
        description: "Piteiras de papel de alta qualidade",
        price: 8.99,
        image: "/api/placeholder/300/300",
        category: "Filtros Piteiras",
        rating: 4.3,
        reviews: 67
      }
    ]
  },
  {
    name: "Piteiras de Vidro",
    slug: "piteiras-vidro",
    description: "Piteiras de vidro artesanais feitas à mão",
    iconName: "Award",
    products: [
      {
        id: 11,
        name: "Piteiras de Vidro Artesanais",
        description: "Piteiras de vidro borossilicato feitas à mão por artesãos",
        price: 79.99,
        image: "/api/placeholder/300/300",
        category: "Piteiras de Vidro",
        rating: 4.9,
        reviews: 156,
        badge: "Premium"
      }
    ]
  },
  {
    name: "Cuias",
    slug: "cuias",
    description: "Cuias e bowls de diferentes materiais e designs",
    iconName: "Heart",
    products: [
      {
        id: 12,
        name: "Cuias de Vidro Premium",
        description: "Cuias de vidro borossilicato com design único",
        price: 65.99,
        image: "/api/placeholder/300/300",
        category: "Cuias",
        rating: 4.6,
        reviews: 98
      }
    ]
  },
  {
    name: "Tesouras",
    slug: "tesouras",
    description: "Tesouras especiais para triturar com precisão",
    iconName: "Scissors",
    products: [
      {
        id: 13,
        name: "Tesouras Premium",
        description: "Tesouras afiadas com design ergonômico",
        price: 25.99,
        image: "/api/placeholder/300/300",
        category: "Tesouras",
        rating: 4.4,
        reviews: 45
      }
    ]
  },
  {
    name: "Potes",
    slug: "potes",
    description: "Potes herméticos para armazenamento seguro",
    iconName: "Package",
    products: [
      {
        id: 14,
        name: "Potes Herméticos Premium",
        description: "Potes herméticos com vedação perfeita",
        price: 35.99,
        image: "/api/placeholder/300/300",
        category: "Potes",
        rating: 4.5,
        reviews: 78
      }
    ]
  },
  {
    name: "Cinzeiros",
    slug: "cinzeiros",
    description: "Cinzeiros e porta-cinzas com design moderno",
    iconName: "Clock",
    products: [
      {
        id: 15,
        name: "Cinzeiros Modernos",
        description: "Cinzeiros com design contemporâneo",
        price: 45.99,
        image: "/api/placeholder/300/300",
        category: "Cinzeiros",
        rating: 4.3,
        reviews: 34
      }
    ]
  },
  {
    name: "Reservatório",
    slug: "reservatorio",
    description: "Reservatórios e bongs de diferentes tamanhos",
    iconName: "Droplets",
    products: [
      {
        id: 16,
        name: "Bong Premium",
        description: "Bong de vidro borossilicato com percolador",
        price: 199.99,
        image: "/api/placeholder/300/300",
        category: "Reservatório",
        rating: 4.7,
        reviews: 123,
        badge: "Premium"
      }
    ]
  }
];

// Get all products
export const getAllProducts = (): Product[] => {
  return categoriesData.flatMap(category => category.products);
};

// Get products by category
export const getProductsByCategory = (categorySlug: string): Product[] => {
  const category = categoriesData.find(cat => cat.slug === categorySlug);
  return category ? category.products : [];
};

// Get category info
export const getCategoryInfo = (categorySlug: string) => {
  return categoriesData.find(cat => cat.slug === categorySlug);
};