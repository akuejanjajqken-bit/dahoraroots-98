-- Database schema for Dahora Roots e-commerce
-- This is a SQLite database schema for development

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category_id INTEGER,
    image_url VARCHAR(255),
    stock_quantity INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    badge VARCHAR(50),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart items table (for persistent cart)
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample categories
INSERT OR IGNORE INTO categories (name, slug, description) VALUES
('Blunts', 'blunts', 'Blunts de tabaco premium e wraps'),
('Cases', 'cases', 'Cases protetores para acessórios'),
('Trituradores', 'trituradores', 'Trituradores manuais e elétricos'),
('Acendedores', 'acendedores', 'Acendedores e isqueiros'),
('Sedas', 'sedas', 'Papéis para enrolar'),
('Filtros Piteiras', 'filtros-piteiras', 'Filtros e piteiras de papel'),
('Piteiras de Vidro', 'piteiras-vidro', 'Piteiras de vidro artesanais'),
('Cuias', 'cuias', 'Cuias e bowls'),
('Tesouras', 'tesouras', 'Tesouras para triturar'),
('Potes', 'potes', 'Potes herméticos'),
('Cinzeiros', 'cinzeiros', 'Cinzeiros e porta-cinzas'),
('Reservatório', 'reservatorio', 'Reservatórios e bongs');

-- Insert sample products
INSERT OR IGNORE INTO products (name, description, price, original_price, category_id, image_url, stock_quantity, rating, review_count, badge) VALUES
('Blunts de Tabaco Premium', 'Blunts artesanais de tabaco natural com sabores únicos', 45.99, 59.99, 1, '/api/placeholder/300/300', 50, 4.9, 127, 'Bestseller'),
('Coleção Sadhu Completa', 'Produtos exclusivos da marca Sadhu para experiências autênticas', 189.99, NULL, 2, '/api/placeholder/300/300', 25, 4.8, 89, 'Novo'),
('Dixavadores Especiais', 'Dixavadores únicos para uma experiência diferenciada', 24.99, 29.99, 3, '/api/placeholder/300/300', 100, 4.7, 234, NULL),
('Piteiras de Vidro Artesanais', 'Piteiras de vidro borossilicato feitas à mão por artesãos', 79.99, NULL, 7, '/api/placeholder/300/300', 30, 4.9, 156, 'Premium'),
('Triturador Elétrico Premium', 'Triturador elétrico com potência e praticidade', 129.99, 159.99, 3, '/api/placeholder/300/300', 15, 4.6, 78, 'Lançamento'),
('Case Protetor Sadhu', 'Case resistente com design único da Sadhu', 89.99, NULL, 2, '/api/placeholder/300/300', 40, 4.5, 92, NULL),
('Kit Completo Iniciante', 'Kit com todos os acessórios essenciais para começar', 199.99, 249.99, 1, '/api/placeholder/300/300', 20, 4.8, 156, 'Oferta'),
('Sedas Premium', 'Papéis de enrolar de alta qualidade', 12.99, NULL, 5, '/api/placeholder/300/300', 200, 4.4, 89, NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);