import React, { useState } from 'react';
import AddToCartButton from './AddToCartButton';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
}

const AddToCartButtonDemo: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // Sample products
  const products: Product[] = [
    {
      id: '1',
      name: 'Sedinha Morning Flix X-Large',
      price: 12.99,
      image: '/placeholder.svg',
      stock: 50
    },
    {
      id: '2',
      name: 'Filtro de Carvão Ativado',
      price: 24.50,
      image: '/placeholder.svg',
      stock: 25
    },
    {
      id: '3',
      name: 'Dixavador de Metal Premium',
      price: 89.00,
      image: '/placeholder.svg',
      stock: 10
    }
  ];

  const handleAddToCart = async (product: Product) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: (item as any).quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div style={{ 
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#043E52',
          marginBottom: '16px'
        }}>
          🛒 Add to Cart Button Demo
        </h1>
        <p style={{ 
          fontSize: '1.125rem',
          color: '#6B7280',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Demonstração do componente premium "Add to Cart" com animações fluidas, 
          efeitos de ripple e feedback visual completo.
        </p>
      </div>

      {/* Product Cards */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '60px'
      }}>
        {products.map((product) => (
          <div key={product.id} style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E7EB',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <div style={{
              width: '100%',
              height: '200px',
              background: '#F3F4F6',
              borderRadius: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                />
              ) : (
                'Imagem do Produto'
              )}
            </div>
            
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#043E52',
              marginBottom: '8px'
            }}>
              {product.name}
            </h3>
            
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#E16A3D',
              marginBottom: '16px'
            }}>
              R$ {product.price.toFixed(2)}
            </p>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              marginBottom: '20px'
            }}>
              Estoque: {product.stock} unidades
            </p>
            
            <AddToCartButton
              product={product}
              variant="primary"
              size="medium"
              onAddToCart={handleAddToCart}
            />
          </div>
        ))}
      </div>

      {/* Button Variants Demo */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#043E52',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Variantes do Botão
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Primary Variant */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#043E52' }}>Primary</h3>
            <AddToCartButton
              product={products[0]}
              variant="primary"
              size="medium"
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Secondary Variant */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#043E52' }}>Secondary</h3>
            <AddToCartButton
              product={products[0]}
              variant="secondary"
              size="medium"
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Minimal Variant */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#043E52' }}>Minimal</h3>
            <AddToCartButton
              product={products[0]}
              variant="minimal"
              size="medium"
              onAddToCart={handleAddToCart}
            />
          </div>

          {/* Floating Variant */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            position: 'relative',
            minHeight: '120px'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#043E52' }}>Floating</h3>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '16px' }}>
              Botão flutuante para mobile
            </p>
            <AddToCartButton
              product={products[0]}
              variant="floating"
              size="medium"
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>

      {/* Size Variants */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#043E52',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Tamanhos
        </h2>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center'
        }}>
          <AddToCartButton
            product={products[0]}
            variant="primary"
            size="small"
            onAddToCart={handleAddToCart}
          />
          <AddToCartButton
            product={products[0]}
            variant="primary"
            size="medium"
            onAddToCart={handleAddToCart}
          />
          <AddToCartButton
            product={products[0]}
            variant="primary"
            size="large"
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Full Width Demo */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#043E52',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Largura Completa
        </h2>
        
        <AddToCartButton
          product={products[0]}
          variant="primary"
          size="large"
          fullWidth
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Cart Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF9F5 0%, #FEF3E7 100%)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #E16A3D'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#043E52',
          marginBottom: '16px'
        }}>
          🛒 Carrinho ({cartItems.length} itens)
        </h2>
        
        {cartItems.length === 0 ? (
          <p style={{ color: '#6B7280' }}>Seu carrinho está vazio</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid #E5E7EB'
              }}>
                <span style={{ color: '#043E52' }}>{item.name}</span>
                <span style={{ color: '#E16A3D', fontWeight: '600' }}>
                  R$ {item.price.toFixed(2)}
                </span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0 0 0',
              borderTop: '2px solid #E16A3D',
              marginTop: '16px'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#043E52' }}>
                Total:
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#E16A3D' }}>
                R$ {cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Features List */}
      <div style={{
        marginTop: '60px',
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#043E52',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          ✨ Funcionalidades Premium
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ color: '#E16A3D', marginBottom: '12px' }}>🎨 Design</h3>
            <ul style={{ color: '#6B7280', lineHeight: '1.6' }}>
              <li>Gradientes vibrantes</li>
              <li>Sombras dinâmicas</li>
              <li>Bordas arredondadas</li>
              <li>Tipografia premium</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: '#E16A3D', marginBottom: '12px' }}>⚡ Animações</h3>
            <ul style={{ color: '#6B7280', lineHeight: '1.6' }}>
              <li>Efeito ripple no clique</li>
              <li>Rotacionação do ícone</li>
              <li>Transições suaves</li>
              <li>Feedback visual completo</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: '#E16A3D', marginBottom: '12px' }}>♿ Acessibilidade</h3>
            <ul style={{ color: '#6B7280', lineHeight: '1.6' }}>
              <li>Navegação por teclado</li>
              <li>ARIA labels</li>
              <li>Alto contraste</li>
              <li>Suporte a leitores de tela</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ color: '#E16A3D', marginBottom: '12px' }}>📱 Mobile</h3>
            <ul style={{ color: '#6B7280', lineHeight: '1.6' }}>
              <li>Touch-friendly (44px+)</li>
              <li>Largura completa opcional</li>
              <li>Botão flutuante</li>
              <li>Otimizado para toque</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartButtonDemo;