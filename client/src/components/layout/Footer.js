import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Twitter, 
  MessageCircle, 
  Youtube, 
  Heart,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: MessageCircle, href: 'https://discord.gg', label: 'Discord' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const footerLinks = {
    'Produto': [
      { name: 'Download', href: '/download' },
      { name: 'Funcionalidades', href: '/features' },
      { name: 'Preços', href: '/pricing' },
      { name: 'Changelog', href: '/changelog' },
    ],
    'Desenvolvedores': [
      { name: 'API', href: '/api' },
      { name: 'Documentação', href: '/docs' },
      { name: 'SDK', href: '/sdk' },
      { name: 'Status', href: '/status' },
    ],
    'Suporte': [
      { name: 'Central de Ajuda', href: '/help' },
      { name: 'Contato', href: '/contact' },
      { name: 'Bug Report', href: '/bug-report' },
      { name: 'Feature Request', href: '/feature-request' },
    ],
    'Legal': [
      { name: 'Termos de Uso', href: '/terms' },
      { name: 'Privacidade', href: '/privacy' },
      { name: 'Cookies', href: '/cookies' },
      { name: 'DMCA', href: '/dmca' },
    ],
  };

  return (
    <footer className="bg-secondary-900 border-t border-secondary-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎮</span>
              </div>
              <span className="font-bold text-xl gradient-text">
                MedalM
              </span>
            </Link>
            
            <p className="text-secondary-400 text-sm mb-6 max-w-sm">
              A plataforma definitiva para gravação e compartilhamento de seus melhores momentos de gameplay. 
              Capture, edite e compartilhe seus clipes épicos com a comunidade gamer.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-secondary-400 hover:text-secondary-100 hover:bg-secondary-800 rounded-lg transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-secondary-100 font-semibold mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-secondary-400 hover:text-secondary-100 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-secondary-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-secondary-400">
            <span>© {currentYear} MedalM. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1 text-secondary-400">
              <span>Feito com</span>
              <Heart size={14} className="text-red-500" />
              <span>para gamers</span>
            </div>
            
            <a
              href="https://github.com/medalm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-secondary-400 hover:text-secondary-100 transition-colors"
            >
              <span>Open Source</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-secondary-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-secondary-500">
            <div>
              <h4 className="text-secondary-300 font-medium mb-2">
                Formatos Suportados
              </h4>
              <p>MP4, AVI, MOV, MKV, WMV, FLV, WebM</p>
            </div>
            
            <div>
              <h4 className="text-secondary-300 font-medium mb-2">
                Qualidade Máxima
              </h4>
              <p>4K@120fps, bitrate até 50Mbps</p>
            </div>
            
            <div>
              <h4 className="text-secondary-300 font-medium mb-2">
                Compatibilidade
              </h4>
              <p>Windows, macOS, Linux, Web</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
