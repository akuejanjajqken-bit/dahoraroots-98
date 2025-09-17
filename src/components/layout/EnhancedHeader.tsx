import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingCart, User, ChevronDown, 
  Menu, X, LogIn
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
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const submenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { state: cartState, toggleCart } = useCart();
  const { state: authState, logout } = useAuth();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (submenuTimeout.current) {
        clearTimeout(submenuTimeout.current);
      }
    };
  }, []);

  // Handle submenu hover with delay
  const handleMenuEnter = (menu: string) => {
    if (submenuTimeout.current) {
      clearTimeout(submenuTimeout.current);
    }
    setActiveMenu(menu);
    setIsSubmenuHovered(true);
  };

  const handleMenuLeave = () => {
    submenuTimeout.current = setTimeout(() => {
      if (!isSubmenuHovered) {
        setActiveMenu(null);
      }
    }, 100);
  };

  const handleSubmenuEnter = () => {
    if (submenuTimeout.current) {
      clearTimeout(submenuTimeout.current);
    }
    setIsSubmenuHovered(true);
  };

  const handleSubmenuLeave = () => {
    setIsSubmenuHovered(false);
    submenuTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  };

  // Submenu categories - NO EMOJIS
  const shopSubmenu = [
    { 
      title: 'Papéis', 
      items: ['King Size', '1 1/4', 'Slim', 'Brown'], 
      highlight: true 
    },
    { 
      title: 'Sedas', 
      items: ['Premium', 'Flavored', 'Transparente', 'Colorida'] 
    },
    { 
      title: 'Filtros', 
      items: ['Tips', 'Carvão Ativado', 'Slim', 'Vidro'] 
    },
    { 
      title: 'Acessórios', 
      items: ['Dichavadores', 'Cases', 'Bandejas', 'Isqueiros'] 
    }
  ];

  const navigation = [
    { name: "Shop", href: "/products" },
    { name: "Coleções", href: "/collections" },
    { name: "Sobre", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contato", href: "/contact" }
  ];

  return (
    <>
      {/* Navigation Header */}
      <nav 
        ref={navRef}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: isScrolled ? '70px' : '80px',
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: isScrolled ? '1px solid rgba(225, 106, 61, 0.1)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.1)' : '0 2px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
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
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #E16A3D 0%, #FEA450 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            DAHORA ROOTS
          </Link>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            height: '100%'
          }}>
            
            {/* Shop with Mega Menu */}
            <div 
              className="menu-item"
              onMouseEnter={() => handleMenuEnter('shop')}
              onMouseLeave={handleMenuLeave}
              style={{ position: 'relative', height: '100%' }}
            >
              <Link
                to="/products"
                style={{
                  height: '100%',
                  padding: '0 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: activeMenu === 'shop' ? '#E16A3D' : '#043E52',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  position: 'relative'
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
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: activeMenu === 'shop' ? '100%' : '0%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #E16A3D 0%, #FEA450 100%)',
                  borderRadius: '3px 3px 0 0',
                  transition: 'width 0.3s ease'
                }} />
              </Link>

              {/* Mega Dropdown Menu */}
              {activeMenu === 'shop' && (
                <div 
                  onMouseEnter={handleSubmenuEnter}
                  onMouseLeave={handleSubmenuLeave}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '800px',
                    maxWidth: '90vw',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    marginTop: '0',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden'
                  }}
                >
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
                        Ofertas Especiais
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
                          marginBottom: '16px',
                          paddingBottom: '8px',
                          borderBottom: '2px solid #F5F5F5'
                        }}>
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
                              backgroundColor: '#E16A3D',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              textTransform: 'uppercase'
                            }}>
                              HOT
                            </span>
                          )}
                        </div>
                        {category.items.map((item, itemIdx) => (
                          <Link
                            key={itemIdx}
                            to={`/products/${category.title.toLowerCase()}/${item.toLowerCase().replace(' ', '-')}`}
                            style={{
                              display: 'block',
                              padding: '8px 0',
                              color: '#666',
                              textDecoration: 'none',
                              fontSize: '14px',
                              transition: 'all 0.2s ease',
                              borderRadius: '6px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#E16A3D';
                              e.currentTarget.style.paddingLeft = '8px';
                              e.currentTarget.style.backgroundColor = '#FFF9F5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#666';
                              e.currentTarget.style.paddingLeft = '0';
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Banner */}
                  <div style={{
                    background: '#FFF9F5',
                    padding: '16px 24px',
                    borderTop: '1px solid #F5F5F5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#043E52', fontWeight: '600' }}>
                        Frete Grátis para pedidos acima de R$ 99
                      </span>
                    </div>
                    <Link
                      to="/products"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '8px',
                        color: '#E16A3D',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      Ver Todas as Promoções →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other Menu Items */}
            {navigation.slice(1).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  height: '100%',
                  padding: '0 20px',
                  display: 'flex',
                  alignItems: 'center',
                  color: location.pathname === item.href ? '#E16A3D' : '#043E52',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {item.name}
                {item.name === 'Coleções' && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#22C55E',
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}>
                    NEW
                  </span>
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: location.pathname === item.href ? '100%' : '0%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #E16A3D 0%, #FEA450 100%)',
                  borderRadius: '3px 3px 0 0',
                  transition: 'width 0.3s ease'
                }} />
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Search */}
            <button 
              onClick={() => setIsSearchOpen(true)}
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
              <Search size={20} />
            </button>

            {/* Login Button */}
            {!authState.isAuthenticated ? (
              <Link 
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#FFF9F5',
                  borderRadius: '8px',
                  color: '#043E52',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E16A3D';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFF9F5';
                  e.currentTarget.style.color = '#043E52';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            ) : (
              <div
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
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  padding: '12px',
                  minWidth: '200px',
                  zIndex: 1001
                }}>
                  <Link 
                    to="/account" 
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      color: '#043E52',
                      textDecoration: 'none',
                      fontSize: '14px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFF9F5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Minha Conta
                  </Link>
                  <Link 
                    to="/orders" 
                    style={{
                      display: 'block',
                      padding: '10px 16px',
                      color: '#043E52',
                      textDecoration: 'none',
                      fontSize: '14px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFF9F5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Meus Pedidos
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      color: '#EF4444',
                      textDecoration: 'none',
                      fontSize: '14px',
                      borderRadius: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF2F2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
            )}

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
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#016A6D';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#E16A3D';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ShoppingCart size={20} />
              {cartState.items.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#22C55E',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {cartState.items.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: '#043E52'
              }}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
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
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto'
      }}>
        {/* Mobile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #E16A3D 0%, #FEA450 100%)',
          padding: '20px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
            Menu
          </h2>
          <button
            onClick={() => setIsMobileOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={20} color="white" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div style={{ padding: '20px' }}>
          {/* Mobile Login Button */}
          {!authState.isAuthenticated && (
            <Link
              to="/login"
              onClick={() => setIsMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '16px',
                backgroundColor: '#E16A3D',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(225, 106, 61, 0.3)'
              }}
            >
              <LogIn size={20} />
              Entrar / Cadastrar
            </Link>
          )}

          {/* Shop with Accordion Submenu */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: '#FAFAFA',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#043E52'
              }}
            >
              Shop
              <ChevronDown 
                size={20}
                style={{
                  transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            </button>
            
            {isSubmenuOpen && (
              <div style={{
                padding: '0 0 0 20px',
                marginTop: '10px'
              }}>
                {shopSubmenu.map((category, idx) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#E16A3D',
                      marginBottom: '8px'
                    }}>
                      {category.title}
                    </h4>
                    {category.items.map((item, itemIdx) => (
                      <Link
                        key={itemIdx}
                        to={`/products/${category.title.toLowerCase()}/${item.toLowerCase()}`}
                        onClick={() => setIsMobileOpen(false)}
                        style={{
                          display: 'block',
                          padding: '6px 0',
                          color: '#666',
                          textDecoration: 'none',
                          fontSize: '14px'
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Mobile Menu Items */}
          {navigation.slice(1).map((item) => (
            <Link 
              key={item.name}
              to={item.href} 
              onClick={() => setIsMobileOpen(false)}
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
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile User Menu if Authenticated */}
          {authState.isAuthenticated && (
            <>
              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #F5F5F5' }} />
              <Link 
                to="/account" 
                onClick={() => setIsMobileOpen(false)}
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
              >
                Minha Conta
              </Link>
              <Link 
                to="/orders" 
                onClick={() => setIsMobileOpen(false)}
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
              >
                Meus Pedidos
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#FAFAFA',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  color: '#EF4444',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar produtos..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '20px 60px 20px 20px',
                  fontSize: '18px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                onClick={() => setIsSearchOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
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