import { useState } from "react";
import { ChevronLeft, ChevronRight, Music, Palette, Users } from "lucide-react";

const artists = [
  {
    id: 1,
    name: "MC Rimas",
    type: "Rapper",
    description: "Colaboração exclusiva com piteiras customizadas",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    collaboration: "Piteiras Signature Series",
    status: "Disponível Agora"
  },
  {
    id: 2,
    name: "Arte Urbana Crew",
    type: "Grafiteiros",
    description: "Designs únicos em dixavadores limitados",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    collaboration: "Edição Street Art",
    status: "Lançamento em Breve"
  },
  {
    id: 3,
    name: "DJ Flow",
    type: "Producer",
    description: "Mix exclusivo + kit premium da casa",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    collaboration: "Beats & Blunts Pack",
    status: "Pré-venda"
  },
  {
    id: 4,
    name: "Poeta da Quebrada",
    type: "Spoken Word",
    description: "Sessão exclusiva + produtos personalizados",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    collaboration: "Poetry & Smoke Sessions",
    status: "Em Desenvolvimento"
  }
];

export default function ArtistCollabs() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, artists.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, artists.length - 2)) % Math.max(1, artists.length - 2));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível Agora":
        return "text-green-400 bg-green-400/10";
      case "Lançamento em Breve":
        return "text-tangerine bg-tangerine/10";
      case "Pré-venda":
        return "text-sunset-orange bg-sunset-orange/10";
      default:
        return "text-muted-foreground bg-muted/20";
    }
  };

  const getArtistIcon = (type: string) => {
    switch (type) {
      case "Rapper":
        return <Music className="h-5 w-5" />;
      case "Grafiteiros":
        return <Palette className="h-5 w-5" />;
      case "Producer":
        return <Users className="h-5 w-5" />;
      default:
        return <Music className="h-5 w-5" />;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient-sunset">Collabs</span> com os{" "}
            <span className="font-street">Artistas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Unidos pela cultura urbana, criamos produtos únicos com os melhores artistas da cena.
            Da música ao grafite, cada collab traz a essência da rua para sua experiência.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 50}%)` }}
            >
              {artists.map((artist, index) => (
                <div
                  key={artist.id}
                  className="w-1/2 md:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="artist-collab-card group">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-t-xl h-48 bg-muted">
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-nile-blue/80 to-transparent" />
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(artist.status)}`}>
                        {artist.status}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-pine/10 rounded-lg text-pine">
                          {getArtistIcon(artist.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{artist.name}</h3>
                          <p className="text-sm text-muted-foreground">{artist.type}</p>
                        </div>
                      </div>

                      <h4 className="text-lg font-semibold text-sunset-orange mb-2">
                        {artist.collaboration}
                      </h4>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {artist.description}
                      </p>

                      <button className="btn-cta w-full">
                        Ver Collab
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-pine/10 hover:bg-pine/20 rounded-full backdrop-blur-sm transition-all duration-300 text-pine hover:scale-110"
            aria-label="Artista anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-pine/10 hover:bg-pine/20 rounded-full backdrop-blur-sm transition-all duration-300 text-pine hover:scale-110"
            aria-label="Próximo artista"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.max(1, artists.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-sunset-orange scale-125'
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}