import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Target, Award, Heart } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Qualidade Premium",
      description: "Selecionamos apenas os melhores produtos do mercado para oferecer uma experiência superior."
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Construímos uma comunidade de entusiastas que compartilham conhecimento e experiências."
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Comprometidos com a excelência em produtos, atendimento e experiência do cliente."
    },
    {
      icon: Heart,
      title: "Paixão",
      description: "Nossa paixão pela cultura cannabis reflete em cada produto que oferecemos."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-pine/5 to-sunset-orange/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-graffiti text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nossa <span className="text-gradient-sunset">História</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Desde 2020, conectamos entusiastas da cannabis com produtos premium 
            e experiências únicas, sempre com foco na qualidade e comunidade.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-block text-3xl font-bold text-foreground mb-6">
                Como tudo começou
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A Dahora Roots nasceu da paixão por criar experiências autênticas 
                  e conectar pessoas através da cultura cannabis. Começamos pequenos, 
                  mas sempre com grandes sonhos e valores sólidos.
                </p>
                <p>
                  Nossa missão sempre foi clara: oferecer produtos de qualidade superior 
                  que elevem a experiência dos nossos clientes, combinando tradição 
                  com inovação em cada item do nosso catálogo.
                </p>
                <p>
                  Hoje, somos mais que uma loja - somos uma comunidade que celebra 
                  a cultura, educa sobre uso responsável e promove experiências 
                  memoráveis para todos os entusiastas.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-light-bg">
                <img
                  src="/api/placeholder/500/500"
                  alt="Nossa história"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-tangerine rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">2020</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-light-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-graffiti text-3xl font-bold text-foreground mb-4">
              Nossos <span className="text-gradient-sunset">Valores</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Os princípios que guiam cada decisão e definem quem somos como empresa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-soft hover:shadow-deep transition-all duration-300">
                <div className="w-16 h-16 bg-pine/10 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="h-8 w-8 text-pine" />
                </div>
                
                <h3 className="font-marker text-xl font-bold text-foreground mb-4">
                  {value.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-pine to-nile-blue rounded-3xl p-12 text-white text-center">
            <h2 className="font-graffiti text-3xl font-bold mb-12">
              Crescendo juntos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-tangerine mb-2">50K+</div>
                <div className="text-white/80">Clientes atendidos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-tangerine mb-2">500+</div>
                <div className="text-white/80">Produtos únicos</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-tangerine mb-2">4.9</div>
                <div className="text-white/80">Avaliação média</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-tangerine mb-2">4+</div>
                <div className="text-white/80">Anos de experiência</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-light-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-graffiti text-3xl font-bold text-foreground mb-4">
              Nosso <span className="text-gradient-sunset">Time</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              As pessoas apaixonadas que fazem a Dahora Roots acontecer todos os dias
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Carlos Silva", role: "Founder & CEO", image: "/api/placeholder/300/400" },
              { name: "Ana Costa", role: "Head of Products", image: "/api/placeholder/300/400" },
              { name: "Bruno Santos", role: "Customer Success", image: "/api/placeholder/300/400" }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-light-bg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <h3 className="font-marker text-xl font-bold text-foreground mb-2">
                  {member.name}
                </h3>
                
                <p className="text-sunset-orange font-medium">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}