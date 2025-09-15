import sadhuLogo from "@/assets/sadhu-logo.png";
import rawLogo from "@/assets/raw-logo.png";
import squadafumLogo from "@/assets/squadafum-logo.png";
import grabbaLeafLogo from "@/assets/grabba-leaf-logo.jpeg";
import LogoLoop from "@/components/ui/LogoLoop";

const partnerLogos = [
  {
    src: sadhuLogo,
    alt: "Sadhu - Tudo para todos. Juntos.",
    href: "https://sadhu.com.br"
  },
  {
    src: rawLogo,
    alt: "RAW - Slow Burning Papers",
    href: "https://rawthentic.com"
  },
  {
    src: squadafumLogo,
    alt: "Squadafum - Lifestyle Cannabis",
    href: "https://squadafum.com"
  },
  {
    src: grabbaLeafLogo,
    alt: "Grabba Leaf - Premium Tobacco Wraps",
    href: "https://grabbaleaf.com"
  }
];

export default function PartnerBrands() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-graffiti font-black mb-4 text-nile-blue">
            Nossos <span className="text-gradient-sunset">Parceiros</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-urban">
            Trabalhamos com as melhores marcas do mercado para trazer produtos de alta qualidade
          </p>
        </div>

        {/* Logo Loop */}
        <LogoLoop
          logos={partnerLogos}
          speed={50}
          direction="left"
          logoHeight={80}
          gap={60}
          pauseOnHover={true}
          fadeOut={true}
          fadeOutColor="#FFFFFF"
          scaleOnHover={true}
          className="my-8"
        />

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 font-urban">
            Quer ser nosso parceiro? Entre em contato conosco
          </p>
          <button className="star-border-button">
            Seja um Parceiro
          </button>
        </div>
      </div>
    </section>
  );
}