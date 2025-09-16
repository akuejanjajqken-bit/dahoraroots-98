import { Truck, Shield, RotateCcw, Headphones, Clock, Award, Zap, Heart } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Envio Grátis",
    description: "Acima de R$ 150",
    detail: "Entrega rápida e segura",
    highlight: "Frete grátis",
    stats: "2-5 dias úteis",
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    icon: Shield,
    title: "Pagamento Seguro",
    description: "100% Protegido",
    detail: "SSL e criptografia",
    highlight: "Segurança total",
    stats: "256-bit SSL",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    icon: RotateCcw,
    title: "Garantia Total",
    description: "30 dias",
    detail: "Troca sem complicação",
    highlight: "Garantia estendida",
    stats: "30 dias para troca",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    icon: Headphones,
    title: "Suporte 24/7",
    description: "Sempre online",
    detail: "Chat e WhatsApp",
    highlight: "Suporte premium",
    stats: "Resposta em 1h",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    icon: Clock,
    title: "Entrega Express",
    description: "Same Day",
    detail: "Para São Paulo",
    highlight: "Entrega no mesmo dia",
    stats: "Até 18h",
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600"
  },
  {
    icon: Award,
    title: "Qualidade Premium",
    description: "Produtos originais",
    detail: "Certificados e autênticos",
    highlight: "100% original",
    stats: "Certificado de autenticidade",
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600"
  }
];

export default function TrustBadges() {
  return (
    <section className="py-20 bg-gradient-to-br from-nile-blue via-nile-blue/95 to-pine relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-tangerine/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-sunset-orange/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
            Por que escolher a <span className="text-gradient-sunset">Dahora Roots</span>?
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            Nossa missão é oferecer a melhor experiência possível, desde a compra até a entrega. 
            Cada detalhe foi pensado para garantir sua satisfação total.
          </p>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:rotate-1 border border-white/20 hover:border-white/40 overflow-hidden"
            >
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{ animationDelay: `${index * 0.5}s` }} />
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: `${index * 0.3}s` }} />
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 ${badge.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <badge.icon className={`h-8 w-8 ${badge.iconColor} group-hover:rotate-12 transition-transform duration-300`} />
                </div>
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-tangerine transition-colors duration-300">
                    {badge.title}
                  </h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white`}>
                    {badge.highlight}
                  </span>
                </div>
                
                <p className="text-white/70 mb-2 font-medium">
                  {badge.description}
                </p>
                
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  {badge.detail}
                </p>
                
                {/* Stats */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50 font-medium">
                    {badge.stats}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-white/30 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20">
            <Heart className="h-6 w-6 text-tangerine animate-pulse" />
            <span className="text-white font-semibold">
              Mais de 10.000 clientes satisfeitos
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-tangerine text-lg">★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}