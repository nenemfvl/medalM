import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  TrendingUp, 
  Clock, 
  Video, 
  Upload, 
  Settings,
  User,
  Search,
  Gamepad2,
  Tv,
  Zap,
  Target,
  Car,
  Sword,
  Puzzle,
  Cog
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const categories = [
    { icon: Zap, name: 'Action', path: '/category/action' },
    { icon: Gamepad2, name: 'Adventure', path: '/category/adventure' },
    { icon: User, name: 'RPG', path: '/category/rpg' },
    { icon: Target, name: 'Strategy', path: '/category/strategy' },
    { icon: Tv, name: 'Sports', path: '/category/sports' },
    { icon: Car, name: 'Racing', path: '/category/racing' },
    { icon: Sword, name: 'Fighting', path: '/category/fighting' },
    { icon: Puzzle, name: 'Puzzle', path: '/category/puzzle' },
    { icon: Cog, name: 'Simulation', path: '/category/simulation' },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -320,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="sidebar z-50 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-700">
            <h2 className="text-lg font-semibold text-secondary-100">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-secondary-400 hover:text-secondary-100 hover:bg-secondary-800 transition-colors lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-4 space-y-6">
              {/* Navegação Principal */}
              <div>
                <h3 className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-3">
                  Navegação
                </h3>
                <nav className="space-y-1">
                  <Link
                    to="/"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                    }`}
                    onClick={onClose}
                  >
                    <Home size={18} />
                    <span>Início</span>
                  </Link>

                  <Link
                    to="/trending"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/trending') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                    }`}
                    onClick={onClose}
                  >
                    <TrendingUp size={18} />
                    <span>Em Alta</span>
                  </Link>

                  <Link
                    to="/recent"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/recent') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                    }`}
                    onClick={onClose}
                  >
                    <Clock size={18} />
                    <span>Recentes</span>
                  </Link>

                  <Link
                    to="/search"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/search') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                    }`}
                    onClick={onClose}
                  >
                    <Search size={18} />
                    <span>Buscar</span>
                  </Link>
                </nav>
              </div>

              {/* Seção do Usuário */}
              {user && (
                <div>
                  <h3 className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-3">
                    Meus Vídeos
                  </h3>
                  <nav className="space-y-1">
                    <Link
                      to="/dashboard"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive('/dashboard') 
                          ? 'bg-primary-600 text-white' 
                          : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                      }`}
                      onClick={onClose}
                    >
                      <User size={18} />
                      <span>Meu Perfil</span>
                    </Link>

                    <Link
                      to="/upload"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive('/upload') 
                          ? 'bg-primary-600 text-white' 
                          : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                      }`}
                      onClick={onClose}
                    >
                      <Upload size={18} />
                      <span>Upload</span>
                    </Link>

                    <Link
                      to="/recording"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive('/recording') 
                          ? 'bg-primary-600 text-white' 
                          : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                      }`}
                      onClick={onClose}
                    >
                      <Video size={18} />
                      <span>Gravação</span>
                    </Link>

                    <Link
                      to="/settings"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive('/settings') 
                          ? 'bg-primary-600 text-white' 
                          : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                      }`}
                      onClick={onClose}
                    >
                      <Settings size={18} />
                      <span>Configurações</span>
                    </Link>
                  </nav>
                </div>
              )}

              {/* Categorias */}
              <div>
                <h3 className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-3">
                  Categorias
                </h3>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(category.path) 
                          ? 'bg-primary-600 text-white' 
                          : 'text-secondary-300 hover:text-secondary-100 hover:bg-secondary-800'
                      }`}
                      onClick={onClose}
                    >
                      <category.icon size={18} />
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-secondary-700">
            <p className="text-xs text-secondary-500 text-center">
              © 2024 MedalM<br />
              Compartilhe seus momentos épicos
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
