import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import kitExclusivo1 from "@/assets/kit-exclusivo-1.jpg";
import kitExclusivo2 from "@/assets/kit-exclusivo-2.jpg";
import bluntsTabacoHero from "@/assets/blunts-tabaco-hero.jpg";
import trituradorEletricoHero from "@/assets/triturador-eletrico-hero.png";

const heroSlides = [
  {
    image: kitExclusivo1,
    alt: "Kit Exclusivo 1 - Acessórios Premium",
    title: "SEUS RITUAIS,",
    subtitle: "SEU KIT COMPLETO",
    description: "Tesouras afiadas, cuias estilosas e trituradores de qualidade. Tudo o que você precisa para deixar sua sessão impecável, do início ao fim.",
    cta: "Montar meu setup",
    link: "/products#kits",
  },
  {
    image: kitExclusivo2,
    alt: "Kit Exclusivo 2 - Produtos Premium",
    title: "PROTEÇÃO",
    subtitle: "COM ESTILO",
    description: "Os cases da Sadhu unem resistência e design único para manter seus acessórios sempre seguros e com aquela cara de lifestyle.",
    cta: "Explorar os cases",
    link: "/products#cases",
  },
  {
    image: bluntsTabacoHero,
    alt: "Blunts de Tabaco Premium - Grabba Leaf",
    title: "ENVOLVE, ACENDE,",
    subtitle: "RELAXA",
    description: "Descubra os blunts de tabaco premium, como o famoso Slap Wodds, que elevam sua experiência a outro nível de sabor e intensidade.",
    cta: "Quero experimentar",
    link: "/collections/blunts-tabaco",
  },
  {
    image: trituradorEletricoHero,
    alt: "Triturador Elétrico - Novo Lançamento",
    title: "POTÊNCIA NA PALMA",
    subtitle: "DA SUA MÃO",
    description: "Nosso lançamento chegou: o triturador elétrico que transforma sua sessão em segundos. Mais praticidade, zero esforço.",
    cta: "Quero o meu agora",
    link: "/products#trituradores",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Carousel */}
      <div className="absolute inset-0">
        <Carousel className="w-full h-full">
          <CarouselContent className="h-screen">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative w-full h-full">
                  {/* Background Image */}
                  <img 
                    src={slide.image} 
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  
                  {/* Dark Overlay for Better Text Contrast */}
                  <div className="absolute inset-0 bg-black/60 z-10" />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-nile-blue/40 via-transparent to-nile-blue/40 z-20" />
                  
                  {/* Content Container */}
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="text-center px-4 max-w-4xl mx-auto">
                      {/* Title with better styling */}
                      <div className="mb-6">
                        <h1 className="text-white font-graffiti font-black text-4xl md:text-6xl lg:text-7xl leading-tight drop-shadow-2xl">
                          {slide.title}
                          <span className="block text-gradient-sunset mt-2 drop-shadow-lg">{slide.subtitle}</span>
                        </h1>
                      </div>
                      
                      {/* Subtitle with background for better readability */}
                      <div className="mb-8">
                        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mx-auto max-w-3xl">
                          <p className="text-white text-lg md:text-xl font-urban font-medium leading-relaxed drop-shadow-lg">
                            {slide.description}
                          </p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div>
                        <Link 
                          to={slide.link} 
                          className="star-border-button text-lg px-10 py-4 inline-block drop-shadow-lg"
                        >
                          {slide.cta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/30 text-white" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/30 text-white" />
        </Carousel>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full float-animation opacity-50" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-tangerine/20 rounded-lg float-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 border-2 border-sunset-orange/30 rounded-full float-animation" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/10 rounded-full float-animation" style={{ animationDelay: '1s' }} />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2 font-urban uppercase tracking-wider">Scroll para descobrir</span>
          <ChevronDown className="h-6 w-6" />
        </div>
      </div>

      {/* Gradient Overlay for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}