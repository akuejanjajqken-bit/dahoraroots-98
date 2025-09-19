export interface Product {
  id: string;
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

// Mock products organized by category - will be replaced by Supabase data
export const categoriesData: Category[] = [
  {
    name: "Blunts",
    slug: "blunts",
    description: "Blunts de tabaco premium e wraps artesanais para uma experiência única",
    iconName: "Heart",
    products: [
      {
        id: '1',
        name: "Blunts de Tabaco Premium",
        description: "Blunts artesanais de tabaco natural com sabores únicos",
        price: 45.99,
        originalPrice: 59.99,
        image: "/src/assets/blunts-tabaco-hero.jpg",
        category: "Blunts",
        rating: 4.9,
        reviews: 127,
        badge: "Bestseller"
      },
      {
        id: '2',
        name: "Kit Completo Iniciante",
        description: "Kit com todos os acessórios essenciais para começar",
        price: 199.99,
        originalPrice: 249.99,
        image: "/src/assets/kit-exclusivo-1.jpg",
        category: "Blunts",
        rating: 4.8,
        reviews: 156,
        badge: "Oferta"
      },
      {
        id: '3',
        name: "Slap Woods Wraps",
        description: "Wraps premium com sabor natural de tabaco",
        price: 35.99,
        image: "/src/assets/slapwoods-wraps.jpg",
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
        id: '4',
        name: "Coleção Sadhu Completa",
        description: "Produtos exclusivos da marca Sadhu para experiências autênticas",
        price: 189.99,
        image: "/src/assets/sadhu-products.jpg",
        category: "Cases",
        rating: 4.8,
        reviews: 89,
        badge: "Novo"
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
        id: '6',
        name: "Dixavadores Especiais",
        description: "Dixavadores únicos para uma experiência diferenciada",
        price: 24.99,
        originalPrice: 29.99,
        image: "/src/assets/dixavadores-collection.webp",
        category: "Trituradores",
        rating: 4.7,
        reviews: 234
      },
      {
        id: '7',
        name: "Triturador Elétrico Premium",
        description: "Triturador elétrico com potência e praticidade",
        price: 129.99,
        originalPrice: 159.99,
        image: "/src/assets/triturador-eletrico-hero.png",
        category: "Trituradores",
        rating: 4.6,
        reviews: 78,
        badge: "Lançamento"
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
        id: '11',
        name: "Piteiras de Vidro Artesanais",
        description: "Piteiras de vidro borossilicato feitas à mão por artesãos",
        price: 79.99,
        image: "/src/assets/piteiras-vidro.jpg",
        category: "Piteiras de Vidro",
        rating: 4.9,
        reviews: 156,
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