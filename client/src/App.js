import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import VideoUpload from './pages/VideoUpload';
import VideoPlayer from './pages/VideoPlayer';
import VideoEdit from './pages/VideoEdit';
import Search from './pages/Search';
import Recording from './pages/Recording';
import Settings from './pages/Settings';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

// API
import { verifyToken } from './api/auth';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const { user, setUser, logout } = useAuth();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024); // Sempre aberto em telas grandes
  const [isLoading, setIsLoading] = useState(true);

  // Verificar token na inicialização
  const { data: authData, isLoading: authLoading } = useQuery(
    'verifyToken',
    verifyToken,
    {
      enabled: !!localStorage.getItem('token'),
      retry: false,
      onSuccess: (data) => {
        setUser(data.user);
        setIsLoading(false);
      },
      onError: () => {
        logout();
        setIsLoading(false);
      },
    }
  );

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Listener para redimensionamento da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-900 text-secondary-100">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="pt-16 min-h-screen lg:ml-64">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user/:username" element={<Profile />} />
            
            {/* Rotas protegidas */}
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/upload" element={user ? <VideoUpload /> : <Navigate to="/login" />} />
            <Route path="/edit/:id" element={user ? <VideoEdit /> : <Navigate to="/login" />} />
            <Route path="/recording" element={user ? <Recording /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            
            {/* Rota 404 */}
            <Route path="*" element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
                  <p className="text-xl text-secondary-400 mb-6">Página não encontrada</p>
                  <p className="text-secondary-500 mb-8">
                    A página que você está procurando não existe ou foi movida.
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="btn-primary"
                  >
                    Voltar
                  </button>
                </div>
              </motion.div>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#1f2937',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
