import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, User, ChevronDown, 
  Menu, X, Sparkles, TrendingUp, Package,
  Heart, Star, Zap, ArrowRight, LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartSidebar from '@/components/cart/CartSidebar';

const EnhancedHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { state: cartState, toggleCart } = useCart();
  const { state: authState, logout } = useAuth();

  // Scroll effect with parallax
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for gradient effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setMousePosition({ 
        x: ((e.clientX - rect.left) / rect.width) * 100, 
        y: ((e.clientY - rect.top) / rect.height) * 100 
      });
    }
  };

  // Submenu categories
  const shopSubmenu = [
    { 
      title: 'Papéis', 
      icon: '📜', 
      items: ['King Size', '1 1/4', 'Slim', 'Brown'], 
      highlight: true 
    },
    { 
      title: 'Sedas', 
      icon: '🍃', 
      items: ['Premium', 'Flavored', 'Transparente', 'Colorida'] 
    },
    { 
      title: 'Filtros', 
      icon: '🎯', 
      items: ['Tips', 'Carvão Ativado', 'Slim', 'Vidro'] 
    },
    { 
      title: 'Acessórios', 
      icon: '💼', 
      items: ['Dichavadores', 'Cases', 'Bandejas', 'Isqueiros'] 
    }
  ];

  const navigation = [
    { name: "Shop", href: "/products" },
    { name: "Coleções", href: "/collections" },
    { name: "Sobre", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contato", href: "/contact" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Main Navigation */}
      <nav 
        ref={navRef} 
        onMouseMove={handleMouseMove}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: isScrolled ? '70px' : '90px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 249, 245, 1) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(225, 106, 61, 0.08)' 
            : '0 4px 20px rgba(0, 0, 0, 0.03)',
          borderBottom: '1px solid rgba(225, 106, 61, 0.1)',
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        } as React.CSSProperties & { '--mouse-x': string; '--mouse-y': string }}
      >
        {/* Animated Background Gradient */}
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(225, 106, 61, 0.03) 0%,
            transparent 40%
          )`,
          pointerEvents: 'none',
          opacity: isScrolled ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Logo */}
          <Link 
            to="/" 
            style={{
              fontSize: isScrolled ? '24px' : '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #E16A3D 0%, #016A6D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              transition: 'all 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transform: isScrolled ? 'scale(0.95)' : 'scale(1)'
            }}
          >
            <span style={{
              display: 'inline-block',
              animation: 'float 3s ease-in-out infinite'
            }}>🍃</span>
            Dahora Roots
          </Link>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '100%'
          }}>
            
            {/* Shop with Mega Menu */}
            <div 
              className="menu-item"
              onMouseEnter={() => setActiveMenu('shop')}
              onMouseLeave={() => setActiveMenu(null)}
              style={{ position: 'relative', height: '100%' }}
            >
              <Link
                to="/products"
                style={{
                  height: '100%',
                  padding: '0 20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: activeMenu === 'shop' ? '#E16A3D' : '#043E52',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  textDecoration: 'none'
                }}
              >
                Shop
                <ChevronDown 
                  size={16} 
                  style={{
                    transform: activeMenu === 'shop' ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Active Indicator */}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: activeMenu === 'shop' ? '80%' : '0',
                  height: '3px',
                  backgroundColor: '#E16A3D',
                  borderRadius: '3px 3px 0 0',
                  transition: 'width 0.3s ease'
                }} />
              </Link>

              {/* Mega Dropdown Menu */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '800px',
                maxWidth: '90vw',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                opacity: activeMenu === 'shop' ? 1 : 0,
                visibility: activeMenu === 'shop' ? 'visible' : 'hidden',
                transform: `translateX(-50%) translateY(${activeMenu === 'shop' ? '10px' : '0'})`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden'
              }}>
                {/* Gradient Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #E16A3D 0%, #FEA450 100%)',
                  padding: '16px 24px',
                  color: 'white'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>
                      🔥 Ofertas Especiais
                    </span>
                    <span style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}>
                      Até 40% OFF
                    </span>
                  </div>
                </div>

                {/* Categories Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '24px',
                  padding: '24px'
                }}>
                  {shopSubmenu.map((category, idx) => (
                    <div key={idx}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        paddingBottom: '12px',
                        borderBottom: '2px solid #F5F5F5'
                      }}>
                        <span style={{ fontSize: '20px' }}>{category.icon}</span>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#043E52',
                          margin: 0
                        }}>
                          {category.title}
                        </h3>
                        {category.highlight && (
                          <span style={{
                            backgroundColor: '#FFE5E5',
                            color: '#E16A3D',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            HOT
                          </span>
                        )}
                      </div>
                      {category.items.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          to={`/products?category=${category.title.toLowerCase()}&subcategory=${item.toLowerCase().replace(' ', '-')}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            color: '#666',
                            textDecoration: 'none',
                            fontSize: '14px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF9F5';
                            e.currentTarget.style.color = '#E16A3D';
                            e.currentTarget.style.paddingLeft = '16px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#666';
                            e.currentTarget.style.paddingLeft = '12px';
                          }}
                        >
                          {item}
                          <ArrowRight size={14} style={{ opacity: 0.5 }} />
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Bottom Banner */}
                <div style={{
                  background: 'linear-gradient(90deg, #FFF9F5 0%, #FFE5E5 100%)',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Zap size={20} color="#E16A3D" />
                    <span style={{ fontSize: '14px', color: '#043E52' }}>
                      <strong>Frete Grátis</strong> em compras acima de R$ 99
                    </span>
                  </div>
                  <Link to="/promocoes" style={{
                    color: '#E16A3D',
                    fontWeight: '600',
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}>
                    Ver Todas as Promoções →
                  </Link>
                </div>
              </div>
            </div>

            {/* Other Menu Items */}
            {navigation.slice(1).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  padding: '0 20px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive(item.href) ? '#E16A3D' : '#043E52',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  position: 'relative',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.color = '#E16A3D';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.color = '#043E52';
                  }
                }}
              >
                {item.name}
                {item.name === 'Coleções' && (
                  <span style={{
                    position: 'absolute',
                    top: '20px',
                    right: '10px',
                    backgroundColor: '#22C55E',
                    color: 'white',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: '600'
                  }}>
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {/* Search with animation */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#FFF9F5',
                color: '#043E52',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E16A3D';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFF9F5';
                e.currentTarget.style.color = '#043E52';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Search size={20} />
            </button>

            {/* User Account */}
            <div
              className="relative"
              onMouseEnter={() => setIsUserDropdownOpen(true)}
              onMouseLeave={() => setIsUserDropdownOpen(false)}
            >
              <button style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#FFF9F5',
                color: '#043E52',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#016A6D';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFF9F5';
                e.currentTarget.style.color = '#043E52';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <User size={20} />
            </button>
            
            {/* User Dropdown */}
            {isUserDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '240px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                padding: '16px',
                zIndex: 1000
              }}>
                {authState.isAuthenticated ? (
                  <>
                    <div style={{
                      paddingBottom: '12px',
                      borderBottom: '1px solid #F5F5F5',
                      marginBottom: '12px'
                    }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#043E52', margin: 0 }}>
                        {authState.user?.firstName} {authState.user?.lastName}
                      </p>
                      <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                        {authState.user?.email}
                      </p>
                    </div>
                    <Link
                      to="/account"
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        color: '#043E52',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFF9F5';
                        e.currentTarget.style.color = '#E16A3D';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#043E52';
                      }}
                    >
                      Minha Conta
                    </Link>
                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        color: '#EF4444',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        marginTop: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEF2F2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        color: '#043E52',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFF9F5';
                        e.currentTarget.style.color = '#E16A3D';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#043E52';
                      }}
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/register"
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        color: '#043E52',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        marginTop: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFF9F5';
                        e.currentTarget.style.color = '#E16A3D';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#043E52';
                      }}
                    >
                      Criar Conta
                    </Link>
                  </>
                )}
              </div>
            )}
            </div>

            {/* Cart with Badge */}
            <button 
              onClick={toggleCart}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#E16A3D',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(225, 106, 61, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(-10deg)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(225, 106, 61, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(225, 106, 61, 0.3)';
              }}
            >
              <ShoppingCart size={20} />
              {cartState.itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#22C55E',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  border: '2px solid white',
                  minWidth: '20px',
                  animation: 'pulse 2s infinite'
                }}>
                  {cartState.itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{
                display: 'none',
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                border: '2px solid #E5E5E5',
                backgroundColor: 'white',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '20px',
                height: '14px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#043E52',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  transform: isMobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                }} />
                <span style={{
                  width: '70%',
                  height: '2px',
                  backgroundColor: '#043E52',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  opacity: isMobileOpen ? 0 : 1
                }} />
                <span style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#043E52',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  transform: isMobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
                }} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 999,
        transform: isMobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto'
      }}>
        {/* Mobile Header */}
        <div style={{
          padding: '20px',
          borderBottom: '2px solid #F5F5F5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #E16A3D 0%, #FEA450 100%)',
          color: 'white'
        }}>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>Menu</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} color="white" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div style={{ padding: '20px' }}>
          {/* Shop with Accordion Submenu */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#FFF9F5',
                border: '2px solid #FEA450',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#043E52',
                cursor: 'pointer'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#E16A3D" />
                Shop
              </span>
              <ChevronDown 
                size={20} 
                style={{
                  transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease',
                  color: '#E16A3D'
                }}
              />
            </button>
            
            {/* Submenu Items */}
            <div style={{
              maxHeight: isSubmenuOpen ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease',
              marginTop: isSubmenuOpen ? '12px' : '0'
            }}>
              {shopSubmenu.map((category, idx) => (
                <div key={idx} style={{
                  marginBottom: '12px',
                  padding: '12px',
                  backgroundColor: '#FAFAFA',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#E16A3D',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>{category.icon}</span>
                    {category.title}
                  </div>
                  {category.items.map((item, itemIdx) => (
                    <Link
                      key={itemIdx}
                      to={`/products?category=${category.title.toLowerCase()}&subcategory=${item.toLowerCase()}`}
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        color: '#666',
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Other Mobile Menu Items */}
          {navigation.slice(1).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              style={{
                display: 'block',
                padding: '16px',
                backgroundColor: '#FAFAFA',
                borderRadius: '12px',
                marginBottom: '12px',
                color: '#043E52',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setIsMobileOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Login Button */}
          <Link
            to="/login"
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '24px',
              backgroundColor: '#E16A3D',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(225, 106, 61, 0.3)',
              textDecoration: 'none'
            }}
            onClick={() => setIsMobileOpen(false)}
          >
            <User size={20} />
            Fazer Login
          </Link>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '120px'
        }}>
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar produtos..."
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  fontSize: '18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  outline: 'none'
                }}
                autoFocus
              />
              <Search style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.6)',
                width: '24px',
                height: '24px'
              }} />
            </div>
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                onClick={() => setIsSearchOpen(false)}
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Pressione Esc para fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          .desktop-menu {
            display: flex;
          }

          .mobile-menu-toggle {
            display: none !important;
          }

          @media (max-width: 768px) {
            .desktop-menu {
              display: none !important;
            }
            
            .mobile-menu-toggle {
              display: flex !important;
            }
          }

          /* Smooth scrollbar for mobile menu */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f5f5f5;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #E16A3D;
            border-radius: 3px;
          }
        `}
      </style>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default EnhancedHeader;
