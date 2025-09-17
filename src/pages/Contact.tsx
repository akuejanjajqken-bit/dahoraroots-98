import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "E-mail",
      value: "contato@dahoraroots.com",
      description: "Respondemos em até 24h"
    },
    {
      icon: Phone,
      title: "Telefone",
      value: "(11) 99999-9999",
      description: "WhatsApp disponível"
    },
    {
      icon: MapPin,
      title: "Endereço",
      value: "São Paulo, SP",
      description: "Entrega para todo Brasil"
    },
    {
      icon: Clock,
      title: "Horário",
      value: "Seg - Sex: 9h às 18h",
      description: "Sab: 9h às 15h"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-pine/5 to-sunset-orange/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-graffiti text-4xl md:text-5xl font-bold text-foreground mb-6">
            Entre em <span className="text-gradient-sunset">Contato</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Estamos aqui para ajudar com suas dúvidas, sugestões ou qualquer 
            informação que você precisar sobre nossos produtos.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h2 className="font-block text-2xl font-bold text-foreground mb-8">
              Fale conosco
            </h2>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-pine/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="h-6 w-6 text-pine" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {info.title}
                    </h3>
                    <p className="text-lg font-medium text-pine mb-1">
                      {info.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ Link */}
            <div className="mt-12 p-6 bg-light-bg rounded-xl">
              <h3 className="font-marker text-lg font-bold text-foreground mb-3">
                Perguntas Frequentes
              </h3>
              <p className="text-muted-foreground mb-4">
                Talvez sua dúvida já tenha resposta em nossa central de ajuda.
              </p>
              <button className="btn-cta">
                Ver FAQ
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-soft p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-graffiti text-2xl font-bold text-foreground mb-4">
                    Mensagem enviada com sucesso! 🎉
                  </h3>
                  <p className="text-muted-foreground">
                    Recebemos sua mensagem e responderemos em breve.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-block text-2xl font-bold text-foreground mb-2">
                    Envie sua mensagem
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Preencha o formulário abaixo e nossa equipe entrará em contato
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Nome completo *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent transition-colors"
                          placeholder="Seu nome"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent transition-colors"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Assunto *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent transition-colors"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="produto">Dúvida sobre produto</option>
                        <option value="pedido">Status do pedido</option>
                        <option value="devolucao">Troca ou devolução</option>
                        <option value="sugestao">Sugestão</option>
                        <option value="outro">Outro assunto</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pine focus:border-transparent transition-colors resize-none"
                        placeholder="Descreva sua dúvida ou mensagem..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        isSubmitting
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-pine hover:bg-pine/90 text-white hover:scale-105 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Enviar Mensagem
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-light-bg rounded-2xl p-8 text-center">
          <h2 className="font-graffiti text-2xl font-bold text-foreground mb-4">
            Nosso Showroom
          </h2>
          <p className="text-muted-foreground mb-6">
            Visite nosso espaço físico para conhecer nossos produtos de perto
          </p>
          <div className="aspect-video bg-gradient-to-br from-pine/20 to-sunset-orange/20 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-pine mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground">
                Em breve: Showroom físico em São Paulo
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}