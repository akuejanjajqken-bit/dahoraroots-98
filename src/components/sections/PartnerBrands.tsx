import sadhuLogo from "@/assets/sadhu-logo.png";
import rawLogo from "@/assets/raw-logo.png";
import squadafumLogo from "@/assets/squadafum-logo.png";
import grabbaLeafLogo from "@/assets/grabba-leaf-logo.jpeg";

const partners = [
  {
    name: "Sadhu",
    logo: sadhuLogo,
    description: "Tudo para todos. Juntos."
  },
  {
    name: "RAW",
    logo: rawLogo,
    description: "Slow Burning Papers"
  },
  {
    name: "Squadafum",
    logo: squadafumLogo,
    description: "Lifestyle Cannabis"
  },
  {
    name: "Grabba Leaf",
    logo: grabbaLeafLogo,
    description: "Premium Tobacco Wraps"
  }
];

export default function PartnerBrands() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-light-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-block mb-4">
            Nossos <span className="text-gradient-sunset">Parceiros</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trabalhamos com as melhores marcas do mercado para trazer produtos de alta qualidade
          </p>
        </div>

        {/* Partner Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="group relative overflow-hidden rounded-2xl p-8 hover:scale-105 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Glassmorphism overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-tangerine/10 to-sunset-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                {/* Logo Container */}
                <div className="w-24 h-24 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden group-hover:shadow-glow transition-all duration-300">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`}
                    className="w-full h-full object-contain p-2 filter brightness-110"
                  />
                </div>
                
                {/* Brand Name */}
                <h3 className="font-block text-xl text-foreground group-hover:text-sunset-orange transition-colors duration-300">
                  {partner.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground font-urban">
                  {partner.description}
                </p>
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-8 h-8 border border-white/20 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-tangerine/20 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6 font-urban">
            Quer ser nosso parceiro? Entre em contato conosco
          </p>
          <button className="btn-cta">
            Seja um Parceiro
          </button>
        </div>
      </div>
    </section>
  );
}