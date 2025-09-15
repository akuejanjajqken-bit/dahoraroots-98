import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Envio Grátis",
    description: "Acima de R$ 150",
    detail: "Entrega rápida e segura"
  },
  {
    icon: Shield,
    title: "Pagamento Seguro",
    description: "100% Protegido",
    detail: "SSL e criptografia"
  },
  {
    icon: RotateCcw,
    title: "Garantia Total",
    description: "30 dias",
    detail: "Troca sem complicação"
  },
  {
    icon: Headphones,
    title: "Suporte 24/7",
    description: "Sempre online",
    detail: "Chat e WhatsApp"
  }
];

export default function TrustBadges() {
  return (
    <section className="benefits-section py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="benefit-card text-center group relative bg-white rounded-2xl p-8 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
            >
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sunset-orange to-tangerine transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              
              <div className="icon-wrapper mb-6 flex justify-center">
                <div className="relative w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center">
                  <badge.icon className="h-10 w-10 text-sunset-orange" />
                  <span className="pulse-effect absolute inset-0 rounded-full border-2 border-sunset-orange opacity-0 animate-pulse group-hover:opacity-50" />
                </div>
              </div>
              
              <h3 className="benefit-title font-block text-xl font-bold text-nile-blue mb-2 group-hover:text-sunset-orange transition-colors duration-300">
                {badge.title}
              </h3>
              
              <p className="benefit-highlight text-lg font-semibold text-sunset-orange mb-2">
                {badge.description}
              </p>
              
              <p className="benefit-description text-sm text-gray-600">
                {badge.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}