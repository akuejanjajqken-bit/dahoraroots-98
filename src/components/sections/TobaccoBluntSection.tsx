import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShoppingBag, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";
import grabbaLeafProducts from "@/assets/grabba-leaf-products.jpg";

export default function TobaccoBluntSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-tangerine/30 rounded-full float-animation" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-sunset-orange/20 rounded-lg float-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-tangerine/20 rounded-full float-animation" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <Card className="overflow-hidden border-0 shadow-2xl">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={grabbaLeafProducts}
                    alt="Blunts de Tabaco Premium - Grabba Leaf Collection"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-tangerine text-black font-block mb-2">
                      EXCLUSIVO
                    </Badge>
                    <h3 className="text-white font-graffiti text-xl">Grabba Leaf Collection</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <Badge className="bg-tangerine/20 text-tangerine border-tangerine/30 font-block uppercase tracking-wider mb-4">
                Blunts Premium
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-graffiti text-foreground mb-6 leading-tight">
                Blunts de
                <span className="text-gradient-sunset block">Tabaco Natural</span>
              </h2>
              <p className="text-xl text-muted-foreground font-urban leading-relaxed mb-8">
                Descubra nossa exclusiva coleção de blunts de tabaco natural. 
                Produtos premium como Grabba Leaf e outras marcas renomadas 
                que garantem a melhor experiência autêntica.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-tangerine/20 p-3 rounded-lg">
                  <Leaf className="w-6 h-6 text-tangerine" />
                </div>
                <div>
                  <h4 className="font-block text-foreground text-lg mb-2 uppercase">Tabaco Natural</h4>
                  <p className="text-muted-foreground text-sm font-urban">Folhas selecionadas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-sunset-orange/20 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-sunset-orange" />
                </div>
                <div>
                  <h4 className="font-block text-foreground text-lg mb-2 uppercase">Qualidade Premium</h4>
                  <p className="text-muted-foreground text-sm font-urban">Marcas reconhecidas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-pine/20 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-pine" />
                </div>
                <div>
                  <h4 className="font-block text-foreground text-lg mb-2 uppercase">Autenticidade</h4>
                  <p className="text-muted-foreground text-sm font-urban">Produtos originais</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-tangerine/20 p-3 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-tangerine" />
                </div>
                <div>
                  <h4 className="font-block text-foreground text-lg mb-2 uppercase">Variedade</h4>
                  <p className="text-muted-foreground text-sm font-urban">Diversas opções</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/collections/blunts-tabaco" 
                className="btn-hero-primary flex-1 sm:flex-none inline-flex items-center justify-center"
              >
                Ver Coleção Completa
              </Link>
              <button className="btn-hero-secondary flex-1 sm:flex-none">
                Saiba Mais
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}