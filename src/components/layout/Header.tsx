import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import CartSidebar from "@/components/cart/CartSidebar";

const navigation = [
  { name: "Shop", href: "/products" },
  { name: "Coleções", href: "/collections" },
  { name: "Sobre", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contato", href: "/contact" },
];

const shopCategories = [
  { name: "Blunts", href: "/products#blunts" },
  { name: "Cases", href: "/products#cases" },
  { name: "Trituradores", href: "/products#trituradores" },
  { name: "Acendedores", href: "/products#acendedores" },
  { name: "Sedas", href: "/products#sedas" },
  { name: "Filtros Piteiras", href: "/products#filtros" },
  { name: "Piteiras de Vidro", href: "/products#piteiras-vidro" },
  { name: "Cuias", href: "/products#cuias" },
  { name: "Tesouras", href: "/products#tesouras" },
  { name: "Potes", href: "/products#potes" },
  { name: "Cinzeiros", href: "/products#cinzeiros" },
  { name: "Reservatório", href: "/products#reservatorio" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const { state: cartState, toggleCart } = useCart();
  const { state: authState, logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-tangerine to-sunset-orange rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-sm">DR</span>
                </div>
                <span className="font-playfair font-bold text-xl text-white group-hover:text-tangerine transition-colors duration-300">
                  Dahora Roots
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              {navigation.map((item) => (
                item.name === "Shop" ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setIsShopDropdownOpen(true)}
                    onMouseLeave={() => setIsShopDropdownOpen(false)}
                  >
                    <Link
                      to={item.href}
                      className={`font-medium transition-all duration-300 relative group flex items-center gap-1 ${
                        isActive(item.href)
                          ? "text-tangerine"
                          : "text-white hover:text-tangerine"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tangerine group-hover:w-full transition-all duration-300" />
                    </Link>
                    
                    {/* Shop Dropdown */}
                    {isShopDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 py-4 z-50">
                        <div className="px-4 mb-3">
                          <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                            Categorias
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {shopCategories.map((category) => (
                            <Link
                              key={category.name}
                              to={category.href}
                              className="block px-4 py-2 text-sm text-foreground hover:text-tangerine hover:bg-white/10 transition-colors duration-200 rounded-lg mx-2"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`font-medium transition-all duration-300 relative group ${
                      isActive(item.href)
                        ? "text-tangerine"
                        : "text-white hover:text-tangerine"
                    }`}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tangerine group-hover:w-full transition-all duration-300" />
                  </Link>
                )
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white hover:text-tangerine transition-colors duration-300 hover:scale-110 transform"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-white hover:text-tangerine transition-colors duration-300 hover:scale-110 transform"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-tangerine text-nile-blue text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartState.itemCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              <div
                className="relative"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button
                  className="p-2 text-white hover:text-tangerine transition-colors duration-300 hover:scale-110 transform"
                  aria-label="User account"
                >
                  <User className="h-5 w-5" />
                </button>
                
                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 py-2 z-50">
                    {authState.isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-semibold text-foreground">
                            {authState.user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {authState.user?.email}
                          </p>
                        </div>
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-foreground hover:text-tangerine hover:bg-white/10 transition-colors duration-200"
                        >
                          Minha Conta
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sair
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-foreground hover:text-tangerine hover:bg-white/10 transition-colors duration-200"
                        >
                          Entrar
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-foreground hover:text-tangerine hover:bg-white/10 transition-colors duration-200"
                        >
                          Criar Conta
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-tangerine transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden glass-header border-t border-white/20">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <nav className="space-y-6">
                {/* Main Navigation */}
                <div className="space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block font-medium transition-colors duration-300 py-2 ${
                        isActive(item.href)
                          ? "text-tangerine border-l-4 border-tangerine pl-4"
                          : "text-white hover:text-tangerine pl-4"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Shop Categories */}
                <div className="border-t border-white/20 pt-6">
                  <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4 px-4">
                    Categorias
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {shopCategories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-300 text-sm text-white hover:text-tangerine"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* User Actions */}
                <div className="border-t border-white/20 pt-6">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-tangerine to-sunset-orange rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">DR</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Dahora Roots</p>
                        <p className="text-white/60 text-xs">Sua loja premium</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 text-white/60 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-tangerine focus:border-transparent"
                autoFocus
              />
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6" />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-white/60 hover:text-white transition-colors duration-300"
              >
                Press Esc to close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}