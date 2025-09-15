import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const launches = [
  {
    id: 1,
    name: "Sticker Pack Urban Vibes",
    price: "R$ 25,90",
    image: "/placeholder.svg?height=300&width=300",
    badge: "NOVO",
    description: "Pack exclusivo com 15 stickers únicos"
  },
  {
    id: 2,
    name: "Arte Graffiti Collection",
    price: "R$ 45,90", 
    image: "/placeholder.svg?height=300&width=300",
    badge: "HOT",
    description: "Coleção limitada de arte urbana"
  },
  {
    id: 3,
    name: "Street Art Decals",
    price: "R$ 35,90",
    image: "/placeholder.svg?height=300&width=300", 
    badge: "LIMITADO",
    description: "Adesivos premium para decoração"
  },
  {
    id: 4,
    name: "Underground Series",
    price: "R$ 55,90",
    image: "/placeholder.svg?height=300&width=300",
    badge: "EXCLUSIVE",
    description: "Série especial cultura underground"
  }
];

export default function LaunchSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-graffiti text-gradient-sunset mb-4 uppercase tracking-wider">
            Lançamentos
          </h2>
          <p className="text-lg text-muted-foreground font-urban max-w-2xl mx-auto">
            Os drops mais frescos da cultura urbana. Arte autêntica que acabou de chegar na quebrada!
          </p>
        </div>

        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {launches.map((launch) => (
              <CarouselItem key={launch.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="group hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50 hover:border-sunset-orange/30">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={launch.image} 
                        alt={launch.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge 
                        variant="secondary" 
                        className="absolute top-3 left-3 bg-sunset-orange text-white font-block text-xs uppercase tracking-wider"
                      >
                        {launch.badge}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="font-marker text-xl mb-2 text-foreground group-hover:text-sunset-orange transition-colors">
                        {launch.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 font-urban">
                        {launch.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-block text-pine font-bold">
                          {launch.price}
                        </span>
                        <button className="btn-cta text-sm px-4 py-2">
                          Ver Mais
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 bg-white/20 border-white/30 text-pine hover:bg-white/30 backdrop-blur-sm" />
          <CarouselNext className="right-0 bg-white/20 border-white/30 text-pine hover:bg-white/30 backdrop-blur-sm" />
        </Carousel>
      </div>
    </section>
  );
}