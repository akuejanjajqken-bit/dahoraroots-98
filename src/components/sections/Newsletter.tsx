import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-br from-pine/5 to-sunset-orange/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-pine rounded-full -translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sunset-orange rounded-full translate-x-48 translate-y-48" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="animate-scale-in">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
              Obrigado por se inscrever! 🎉
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Você receberá nossas novidades e ofertas exclusivas em breve.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-pine/5 to-sunset-orange/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pine rounded-full -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sunset-orange rounded-full translate-x-48 translate-y-48" />
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-tangerine rounded-lg rotate-45 float-animation" />
        <div className="absolute top-3/4 right-1/4 w-12 h-12 border border-pine rounded-full float-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-3/4 w-6 h-6 bg-sunset-orange/20 rounded-full float-animation" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="mb-8">
          <div className="w-16 h-16 bg-tangerine/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-tangerine" />
          </div>
          
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fique por dentro das <span className="text-gradient-sunset">novidades</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Receba primeiro as novidades, ofertas exclusivas e dicas sobre cannabis lifestyle
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-pine focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-foreground placeholder-muted-foreground"
              required
            />
            
            <button
              type="submit"
              disabled={isLoading || !email}
              className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-semibold transition-all duration-300 ${
                isLoading || !email
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-pine hover:bg-pine/90 text-white hover:scale-105 shadow-md hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                "Inscrever"
              )}
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Ao se inscrever, você concorda em receber e-mails promocionais. 
            Você pode cancelar a qualquer momento.
          </p>
        </form>

        {/* Social Proof */}
        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-tangerine rounded-full animate-pulse" />
            <span>+5.000 inscritos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pine rounded-full animate-pulse" />
            <span>Newsletter semanal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-sunset-orange rounded-full animate-pulse" />
            <span>Ofertas exclusivas</span>
          </div>
        </div>
      </div>
    </section>
  );
}