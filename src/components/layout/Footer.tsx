import { Link } from "react-router-dom";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Smartphone
} from "lucide-react";

const footerLinks = {
  company: [
    { name: "Sobre Nós", href: "/about" },
    { name: "Nossa História", href: "/story" },
    { name: "Carreiras", href: "/careers" },
    { name: "Sustentabilidade", href: "/sustainability" },
  ],
  help: [
    { name: "Central de Ajuda", href: "/help" },
    { name: "Rastreamento", href: "/tracking" },
    { name: "Devoluções", href: "/returns" },
    { name: "Guia de Tamanhos", href: "/size-guide" },
  ],
  legal: [
    { name: "Política de Privacidade", href: "/privacy" },
    { name: "Termos de Uso", href: "/terms" },
    { name: "Cookies", href: "/cookies" },
    { name: "Conformidade", href: "/compliance" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/dahoraroots" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/dahoraroots" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/dahoraroots" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/dahoraroots" },
];

export default function Footer() {
  return (
    <footer className="bg-nile-blue text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-tangerine to-sunset-orange rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">DR</span>
              </div>
              <span className="font-playfair font-bold text-2xl">Dahora Roots</span>
            </Link>
            
            <p className="text-white/70 mb-6 leading-relaxed">
              Sua loja premium de acessórios para cannabis e lifestyle. 
              Qualidade superior e experiência única desde 2020.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="h-4 w-4 text-tangerine" />
                <span>contato@dahoraroots.com</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="h-4 w-4 text-tangerine" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="h-4 w-4 text-tangerine" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-playfair font-semibold text-lg mb-6">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-tangerine transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-playfair font-semibold text-lg mb-6">Ajuda</h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-tangerine transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-playfair font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-tangerine transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/20 mt-12 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-playfair text-2xl font-bold mb-2">
                Fique por dentro das novidades
              </h3>
              <p className="text-white/70">
                Ofertas exclusivas, novos produtos e conteúdo premium
              </p>
            </div>
            
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-tangerine"
              />
              <button className="btn-cta">
                Inscrever
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-white/70">
                © 2024 <span className="text-gradient-sunset font-semibold">Dahora Roots</span>. 
                Todos os direitos reservados.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-white/70 text-sm">Siga-nos:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-tangerine hover:scale-110 transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-white/70 group-hover:text-white" />
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-white/70 text-sm">Pagamento:</span>
              <div className="flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-white/50" />
                <Smartphone className="h-6 w-6 text-white/50" />
                <div className="w-8 h-6 bg-white/20 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">PIX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}