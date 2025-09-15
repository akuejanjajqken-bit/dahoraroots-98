import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-md mx-auto">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-playfair font-black text-gradient-sunset mb-4">
              404
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-pine to-sunset-orange mx-auto rounded-full" />
          </div>

          {/* Error Message */}
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-4">
            Página não encontrada
          </h1>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Parece que esta página saiu para uma sessão e não voltou ainda. 
            Que tal explorar nossa coleção premium?
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="btn-cta flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Voltar ao Início
            </Link>
            
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 border-2 border-pine text-pine font-semibold rounded-xl hover:bg-pine hover:text-white transition-all duration-300"
            >
              <Search className="h-4 w-4" />
              Ver Produtos
            </Link>
          </div>

          {/* Popular Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="font-semibold text-foreground mb-4">
              Páginas populares:
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/about"
                className="text-muted-foreground hover:text-pine transition-colors duration-300"
              >
                Sobre Nós
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-pine transition-colors duration-300"
              >
                Contato
              </Link>
              <Link
                to="/collections"
                className="text-muted-foreground hover:text-pine transition-colors duration-300"
              >
                Coleções
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
