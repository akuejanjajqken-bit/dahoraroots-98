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
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-pine/10 rounded-2xl flex items-center justify-center group-hover:bg-sunset-orange/20 transition-all duration-300">
                  <badge.icon className="h-8 w-8 text-pine group-hover:text-sunset-orange transition-colors duration-300" />
                </div>
              </div>
              
              <h3 className="font-playfair text-xl font-bold text-foreground mb-2 group-hover:text-pine transition-colors duration-300">
                {badge.title}
              </h3>
              
              <p className="text-lg font-semibold text-sunset-orange mb-1">
                {badge.description}
              </p>
              
              <p className="text-sm text-muted-foreground">
                {badge.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}