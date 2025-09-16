const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dahora-roots-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
const fs = require('fs');
const sqlPath = path.join(__dirname, 'database.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');
db.exec(sql);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso necessário' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
      }

      if (row) {
        return res.status(400).json({ message: 'E-mail já cadastrado' });
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert user
      db.run(
        'INSERT INTO users (first_name, last_name, email, password_hash, phone) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, passwordHash, phone],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Erro ao criar usuário' });
          }

          const userId = this.lastID;
          const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

          res.json({
            user: {
              id: userId,
              firstName,
              lastName,
              email,
              phone,
              createdAt: new Date().toISOString()
            },
            token
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        createdAt: user.created_at
      },
      token
    });
  });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      createdAt: user.created_at
    });
  });
});

// Products routes
app.get('/api/products', (req, res) => {
  const { category, search, limit = 20, offset = 0 } = req.query;
  
  let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1';
  let params = [];

  if (category) {
    query += ' AND c.slug = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
    res.json(products);
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.get(
    'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? AND p.is_active = 1',
    [id],
    (err, product) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar produto' });
      }
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      res.json(product);
    }
  );
});

// Categories routes
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar categorias' });
    }
    res.json(categories);
  });
});

// Cart routes
app.get('/api/cart', authenticateToken, (req, res) => {
  const query = `
    SELECT ci.*, p.name, p.price, p.image_url, p.original_price, p.category_id, c.name as category_name
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ci.user_id = ?
  `;
  
  db.all(query, [req.user.userId], (err, items) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar carrinho' });
    }
    res.json(items);
  });
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { productId, quantity } = req.body;
  
  // Check if item already exists in cart
  db.get('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.userId, productId], (err, existingItem) => {
    if (err) {
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }

    if (existingItem) {
      // Update quantity
      db.run(
        'UPDATE cart_items SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?',
        [quantity, req.user.userId, productId],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao atualizar carrinho' });
          }
          res.json({ message: 'Item atualizado no carrinho' });
        }
      );
    } else {
      // Add new item
      db.run(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.userId, productId, quantity],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao adicionar ao carrinho' });
          }
          res.json({ message: 'Item adicionado ao carrinho' });
        }
      );
    }
  });
});

app.put('/api/cart/:productId', authenticateToken, (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  
  if (quantity <= 0) {
    // Remove item
    db.run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.userId, productId], (err) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao remover item' });
      }
      res.json({ message: 'Item removido do carrinho' });
    });
  } else {
    // Update quantity
    db.run(
      'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?',
      [quantity, req.user.userId, productId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao atualizar carrinho' });
        }
        res.json({ message: 'Carrinho atualizado' });
      }
    );
  }
});

app.delete('/api/cart/:productId', authenticateToken, (req, res) => {
  const { productId } = req.params;
  
  db.run('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.userId, productId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao remover item' });
    }
    res.json({ message: 'Item removido do carrinho' });
  });
});

app.delete('/api/cart', authenticateToken, (req, res) => {
  db.run('DELETE FROM cart_items WHERE user_id = ?', [req.user.userId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao limpar carrinho' });
    }
    res.json({ message: 'Carrinho limpo' });
  });
});

// Orders routes
app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, totalAmount, shippingCost, shippingAddress, paymentMethod } = req.body;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Create order
    db.run(
      'INSERT INTO orders (user_id, total_amount, shipping_cost, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, totalAmount, shippingCost, JSON.stringify(shippingAddress), paymentMethod],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ message: 'Erro ao criar pedido' });
        }
        
        const orderId = this.lastID;
        
        // Add order items
        const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
        let completed = 0;
        
        items.forEach((item, index) => {
          stmt.run([orderId, item.id, item.quantity, item.price], (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ message: 'Erro ao adicionar itens ao pedido' });
            }
            
            completed++;
            if (completed === items.length) {
              stmt.finalize();
              db.run('COMMIT');
              
              // Clear cart
              db.run('DELETE FROM cart_items WHERE user_id = ?', [req.user.userId]);
              
              res.json({ orderId, message: 'Pedido criado com sucesso' });
            }
          });
        });
      }
    );
  });
});

app.get('/api/orders', authenticateToken, (req, res) => {
  const query = `
    SELECT o.*, 
           GROUP_CONCAT(
             json_object(
               'id', oi.id,
               'product_id', oi.product_id,
               'quantity', oi.quantity,
               'price', oi.price,
               'name', p.name,
               'image_url', p.image_url
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  
  db.all(query, [req.user.userId], (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar pedidos' });
    }
    
    // Parse items JSON
    orders.forEach(order => {
      if (order.items) {
        order.items = order.items.split(',').map(item => JSON.parse(item));
      }
    });
    
    res.json(orders);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err.message);
    } else {
      console.log('✅ Banco de dados fechado com sucesso');
    }
    process.exit(0);
  });
});