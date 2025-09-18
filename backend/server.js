const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: 'http://localhost:5173', // Your React app URL
  credentials: true 
}));
app.use(express.json());

// Create/Connect to SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize Database Tables
function initializeDatabase() {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      phone TEXT,
      cpf TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('✅ Users table ready');
      createAdminAccount();
    }
  });

  // Create sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      token TEXT UNIQUE,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Create orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      total REAL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create cart table
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);
}

// Create Admin Account if not exists
async function createAdminAccount() {
  const adminEmail = 'arrkkhecorp@gmail.com';
  const adminPassword = 'Dahoraroots2025*';

  db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, user) => {
    if (!user) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      db.run(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
        [adminEmail, hashedPassword, 'Administrador Master', 'admin'],
        (err) => {
          if (err) {
            console.error('Error creating admin:', err);
          } else {
            console.log('✅ Admin account created successfully');
            console.log('   Email: arrkkhecorp@gmail.com');
            console.log('   Password: Dahoraroots2025*');
          }
        }
      );
    } else {
      console.log('✅ Admin account already exists');
    }
  });

  // Add sample products
  addSampleProducts();
}

// Add sample products
function addSampleProducts() {
  const sampleProducts = [
    {
      name: 'Seda OCB Premium',
      description: 'Papel de seda premium para enrolar',
      price: 12.90,
      stock: 50,
      category: 'papéis',
      image_url: '/api/placeholder/300/300'
    },
    {
      name: 'Triturador Elétrico',
      description: 'Triturador elétrico de alta qualidade',
      price: 89.90,
      stock: 20,
      category: 'acessórios',
      image_url: '/api/placeholder/300/300'
    },
    {
      name: 'Blunt de Tabaco',
      description: 'Blunt de tabaco natural premium',
      price: 18.90,
      stock: 30,
      category: 'blunts',
      image_url: '/api/placeholder/300/300'
    },
    {
      name: 'Kit Completo',
      description: 'Kit completo com todos os acessórios',
      price: 149.90,
      stock: 15,
      category: 'kits',
      image_url: '/api/placeholder/300/300'
    }
  ];

  sampleProducts.forEach(product => {
    db.get('SELECT * FROM products WHERE name = ?', [product.name], (err, existing) => {
      if (!existing) {
        db.run(
          'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.stock, product.category, product.image_url],
          (err) => {
            if (err) {
              console.error('Error adding sample product:', err);
            } else {
              console.log(`✅ Sample product added: ${product.name}`);
            }
          }
        );
      }
    });
  });
}

// ================== AUTH ROUTES ==================

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  console.log('Login attempt:', req.body.email);
  const { email, password } = req.body;

  try {
    // Find user in database
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Erro no servidor' 
        });
      }

      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ 
          success: false, 
          message: 'Email ou senha incorretos' 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password for:', email);
        return res.status(401).json({ 
          success: false, 
          message: 'Email ou senha incorretos' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '7d' }
      );

      // Update last login
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

      // Send response
      console.log('Login successful:', email, 'Role:', user.role);
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/'
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar login' 
    });
  }
});

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, cpf } = req.body;

  try {
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email já cadastrado' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert new user
      db.run(
        'INSERT INTO users (email, password, name, phone, cpf, role) VALUES (?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, name, phone, cpf, 'user'],
        function(err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Erro ao criar conta' 
            });
          }

          // Generate token
          const token = jwt.sign(
            { 
              id: this.lastID, 
              email, 
              role: 'user' 
            },
            process.env.JWT_SECRET || 'your-secret-key-change-this',
            { expiresIn: '7d' }
          );

          res.status(201).json({
            success: true,
            token,
            user: {
              id: this.lastID,
              email,
              name,
              role: 'user'
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao criar conta' 
    });
  }
});

// VERIFY TOKEN ROUTE
app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token não fornecido' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');

    db.get('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err || !user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        });
      }

      res.json({
        success: true,
        user
      });
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
});

// ================== PRODUCT ROUTES ==================

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY created_at DESC', (err, products) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar produtos' 
      });
    }
    res.json({ success: true, products });
  });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar produto' 
      });
    }
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produto não encontrado' 
      });
    }
    res.json({ success: true, product });
  });
});

// ================== CART ROUTES ==================

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
}

// Get user cart
app.get('/api/cart', isAuthenticated, (req, res) => {
  db.all(`
    SELECT c.*, p.name, p.price, p.image_url 
    FROM cart c 
    JOIN products p ON c.product_id = p.id 
    WHERE c.user_id = ?
  `, [req.user.id], (err, items) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar carrinho' 
      });
    }
    res.json({ success: true, items });
  });
});

// Add item to cart
app.post('/api/cart', isAuthenticated, (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  // Check if product exists
  db.get('SELECT * FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produto não encontrado' 
      });
    }

    // Check if item already in cart
    db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', 
      [req.user.id, product_id], (err, existingItem) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Erro ao verificar carrinho' 
        });
      }

      if (existingItem) {
        // Update quantity
        db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', 
          [quantity, existingItem.id], (err) => {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: 'Erro ao atualizar carrinho' 
            });
          }
          res.json({ success: true, message: 'Item atualizado no carrinho' });
        });
      } else {
        // Add new item
        db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', 
          [req.user.id, product_id, quantity], (err) => {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: 'Erro ao adicionar ao carrinho' 
            });
          }
          res.json({ success: true, message: 'Item adicionado ao carrinho' });
        });
      }
    });
  });
});

// ================== ADMIN ROUTES ==================

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado - Admin apenas' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
}

// Admin Dashboard Stats
app.get('/api/admin/stats', isAdmin, (req, res) => {
  const stats = {};

  // Get total users
  db.get('SELECT COUNT(*) as total FROM users', (err, row) => {
    stats.totalUsers = row.total;

    // Get total orders
    db.get('SELECT COUNT(*) as total FROM orders', (err, row) => {
      stats.totalOrders = row.total || 0;
      
      // Get total revenue
      db.get('SELECT SUM(total) as revenue FROM orders WHERE status = "completed"', (err, row) => {
        stats.totalRevenue = row.revenue || 0;
        
        // Get total products
        db.get('SELECT COUNT(*) as total FROM products', (err, row) => {
          stats.totalProducts = row.total || 0;
          
          res.json({
            success: true,
            stats
          });
        });
      });
    });
  });
});

// Get all users (admin only)
app.get('/api/admin/users', isAdmin, (req, res) => {
  db.all('SELECT id, email, name, role, created_at, last_login FROM users', (err, users) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
    res.json({ success: true, users });
  });
});

// ================== TEST ROUTE ==================
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is running!', 
    timestamp: new Date().toISOString() 
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is healthy',
    timestamp: new Date().toISOString() 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║                                        ║
║  🚀 Server running on port ${PORT}        ║
║  📡 API: http://localhost:${PORT}         ║
║  🔐 Admin: arrkkhecorp@gmail.com       ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});