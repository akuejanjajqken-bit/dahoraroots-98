import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Star, Shield, Zap } from "lucide-react";
import slapwoodsWraps from "@/assets/slapwoods-wraps.jpg";

export default function BluntSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-nile-blue via-nile-blue/95 to-pine relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-tangerine/30 rounded-full float-animation" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-sunset-orange/20 rounded-lg float-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-tangerine/20 rounded-full float-animation" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <Badge className="bg-tangerine/20 text-tangerine border-tangerine/30 font-block uppercase tracking-wider mb-4">
                Exclusivo na Loja
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-graffiti text-white mb-6 leading-tight">
                Blunt de
                <span className="text-gradient-sunset block">Tabaco Premium</span>
              </h2>
              <p className="text-xl text-white/80 font-urban leading-relaxed mb-8">
                O diferencial da nossa loja! Blunts de tabaco natural, sem aditivos químicos. 
                Experiência autêntica para quem valoriza qualidade e tradição.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-tangerine/20 p-3 rounded-lg">
                  <Leaf className="w-6 h-6 text-tangerine" />
                </div>
                <div>
                  <h4 className="font-block text-white text-lg mb-2 uppercase">100% Natural</h4>
                  <p className="text-white/70 text-sm font-urban">Tabaco puro sem químicos</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-sunset-orange/20 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-sunset-orange" />
                </div>
                <div>
                  <h4 className="font-block text-white text-lg mb-2 uppercase">Premium Quality</h4>
                  <p className="text-white/70 text-sm font-urban">Seleção especial de folhas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-pine/20 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-block text-white text-lg mb-2 uppercase">Procedência</h4>
                  <p className="text-white/70 text-sm font-urban">Origem certificada</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-tangerine/20 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-tangerine" />
                </div>
                <div>
                  <h4 className="font-block text-white text-lg mb-2 uppercase">Exclusividade</h4>
                  <p className="text-white/70 text-sm font-urban">Só aqui na região</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-hero-primary flex-1 sm:flex-none">
                Ver Produtos
              </button>
              <button className="btn-hero-secondary flex-1 sm:flex-none">
                Saiba Mais
              </button>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            {/* Glassmorphism Card */}
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="aspect-square relative">
                  <img 
                    src={slapwoodsWraps}
                    alt="Slapwoods Cigar Wraps Premium"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-tangerine/90 text-black font-block mb-2 backdrop-blur-sm">
                      SLAPWOODS
                    </Badge>
                    <h3 className="text-xl font-graffiti text-white uppercase">Cigar Wraps</h3>
                    <p className="text-white/90 font-urban text-sm">Premium Quality</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Badge className="bg-tangerine text-nile-blue font-block">
                    A partir de R$ 15,90
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-tangerine rounded-full pulse-glow" />
            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-2 border-sunset-orange/50 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}