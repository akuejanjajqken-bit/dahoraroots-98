import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoriesGrid from "@/components/sections/CategoriesGrid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Package, Star, Award } from "lucide-react";
import grabbaLeafProducts from "@/assets/grabba-leaf-products.jpg";
import slapwoodsWraps from "@/assets/slapwoods-wraps.jpg";

const Collections = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-nile-blue via-nile-blue/90 to-pine relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-32 h-32 border border-tangerine/30 rounded-full float-animation" />
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-sunset-orange/20 rounded-lg float-animation" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge className="bg-tangerine/20 text-tangerine border-tangerine/30 font-block uppercase tracking-wider mb-6">
              Nossas Coleções
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-graffiti text-white mb-8 leading-tight">
              Explore Nossas
              <span className="text-gradient-sunset block">Coleções Premium</span>
            </h1>
            <p className="text-xl text-white/80 font-urban leading-relaxed max-w-3xl mx-auto">
              Descubra nossa seleção cuidadosa de produtos premium, 
              desde blunts de tabaco natural até acessórios exclusivos.
            </p>
          </div>
        </section>

        {/* Blunts de Tabaco Collection */}
        <section id="blunts-tabaco" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-tangerine/20 text-tangerine border-tangerine/30 font-block uppercase tracking-wider mb-4">
                Coleção Especial
              </Badge>
              <h2 className="text-3xl md:text-5xl font-graffiti text-foreground mb-6">
                Blunts de <span className="text-gradient-sunset">Tabaco Premium</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nossa coleção exclusiva de blunts de tabaco natural e wraps premium
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Grabba Leaf Products */}
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={grabbaLeafProducts}
                      alt="Grabba Leaf Collection - Blunts de Tabaco Natural"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-tangerine text-black font-block mb-2">
                        GRABBA LEAF
                      </Badge>
                      <h3 className="text-white font-graffiti text-xl mb-1">Tabaco Natural Premium</h3>
                      <p className="text-white/80 text-sm">Folhas selecionadas e wraps de qualidade</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Leaf className="w-4 h-4 text-tangerine" />
                        <span className="text-sm text-muted-foreground">100% Natural</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-sunset-orange" />
                        <span className="text-sm text-muted-foreground">Premium Quality</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">A partir de R$ 12,90</span>
                      <button className="bg-tangerine text-black px-4 py-2 rounded-lg font-block hover:bg-tangerine/90 transition-colors">
                        Ver Produtos
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Slapwoods Wraps */}
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={slapwoodsWraps}
                      alt="Slapwoods Cigar Wraps Collection"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-sunset-orange text-white font-block mb-2">
                        SLAPWOODS
                      </Badge>
                      <h3 className="text-white font-graffiti text-xl mb-1">Cigar Wraps Premium</h3>
                      <p className="text-white/80 text-sm">Wraps de alta qualidade e sabores únicos</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-sunset-orange" />
                        <span className="text-sm text-muted-foreground">5 Wraps/Pack</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-tangerine" />
                        <span className="text-sm text-muted-foreground">Sabores Únicos</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-foreground">A partir de R$ 18,90</span>
                      <button className="bg-sunset-orange text-white px-4 py-2 rounded-lg font-block hover:bg-sunset-orange/90 transition-colors">
                        Ver Produtos
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Section */}
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-graffiti text-center mb-8">Por que escolher nossa coleção?</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-tangerine/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-tangerine" />
                  </div>
                  <h4 className="font-block text-lg mb-2">100% Natural</h4>
                  <p className="text-sm text-muted-foreground">Produtos sem aditivos químicos</p>
                </div>
                <div className="text-center">
                  <div className="bg-sunset-orange/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-sunset-orange" />
                  </div>
                  <h4 className="font-block text-lg mb-2">Qualidade Premium</h4>
                  <p className="text-sm text-muted-foreground">Marcas reconhecidas mundialmente</p>
                </div>
                <div className="text-center">
                  <div className="bg-pine/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-pine" />
                  </div>
                  <h4 className="font-block text-lg mb-2">Variedade</h4>
                  <p className="text-sm text-muted-foreground">Diversas opções e sabores</p>
                </div>
                <div className="text-center">
                  <div className="bg-tangerine/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-tangerine" />
                  </div>
                  <h4 className="font-block text-lg mb-2">Autenticidade</h4>
                  <p className="text-sm text-muted-foreground">Produtos originais garantidos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Collections */}
        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
