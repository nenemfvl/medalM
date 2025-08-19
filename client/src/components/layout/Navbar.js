import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Search, 
  Video, 
  User, 
  Settings, 
  LogOut,
  Bell,
  Home,
  Upload
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary-900/95 backdrop-blur-lg border-b border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-secondary-400 hover:text-secondary-100 hover:bg-secondary-800 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎮</span>
              </div>
              <span className="font-bold text-xl gradient-text hidden sm:block">
                MedalM
              </span>
            </Link>
          </div>

          {/* Barra de Pesquisa */}
          <div className="flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vídeos, usuários..."
                className="w-full pl-10 pr-4 py-2 bg-secondary-800 border border-secondary-600 rounded-lg text-secondary-100 placeholder-secondary-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" 
              />
            </form>
          </div>

          {/* Menu Direita */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Navegação Principal */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link
                    to="/"
                    className="p-2 rounded-lg text-secondary-400 hover:text-secondary-100 hover:bg-secondary-800 transition-colors"
                    title="Início"
                  >
                    <Home size={20} />
                  </Link>
                  
                  <Link
                    to="/upload"
                    className="p-2 rounded-lg text-secondary-400 hover:text-secondary-100 hover:bg-secondary-800 transition-colors"
                    title="Upload"
                  >
                    <Upload size={20} />
                  </Link>
                  
                  <Link
                    to="/recording"
                    className="p-2 rounded-lg text-secondary-400 hover:text-secondary-100 hover:bg-secondary-800 transition-colors"
                    title="Gravação"
                  >
                    <Video size={20} />
                  </Link>

                  <button className="p-2 rounded-lg text-secondary-400 hover:text-secondary-100 hover:bg-secondary-800 transition-colors relative">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                  </button>
                </div>

                {/* Menu do Usuário */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-secondary-800 transition-colors"
                  >
                    <img
                      src={user.avatar || 'https://via.placeholder.com/32/6366f1/ffffff?text=U'}
                      alt={user.username}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <span className="hidden sm:block text-secondary-100 font-medium">
                      {user.username}
                    </span>
                  </button>

                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-secondary-800 border border-secondary-700 rounded-lg shadow-xl py-1 z-50"
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-secondary-100 hover:bg-secondary-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} />
                        <span>Meu Perfil</span>
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-secondary-100 hover:bg-secondary-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={16} />
                        <span>Configurações</span>
                      </Link>
                      
                      <hr className="border-secondary-700 my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-red-400 hover:bg-secondary-700 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sair</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="btn-ghost"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
