import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Eye, 
  Heart, 
  Upload, 
  TrendingUp, 
  Users, 
  Settings,
  Plus,
  Play,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getVideosByUser } from '../api/videos';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    subscribers: 0
  });

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const response = await getVideosByUser(user.id);
        setVideos(response.videos || []);
        
        // Calcular estatísticas
        const totalViews = response.videos?.reduce((sum, video) => sum + (video.views || 0), 0) || 0;
        const totalLikes = response.videos?.reduce((sum, video) => sum + (video.likes || 0), 0) || 0;
        
        setStats({
          totalVideos: response.videos?.length || 0,
          totalViews,
          totalLikes,
          subscribers: user.subscribers?.length || 0
        });
      } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  const recentVideos = videos.slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta, {user?.username}! 🎮
          </h1>
          <p className="text-secondary-400">
            Gerencie seus vídeos e acompanhe seu progresso na comunidade
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Total de Vídeos</p>
                <p className="text-2xl font-bold text-white">{stats.totalVideos}</p>
              </div>
              <Video className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-r from-green-600 to-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Total de Visualizações</p>
                <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-r from-pink-600 to-pink-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-200 text-sm font-medium">Total de Likes</p>
                <p className="text-2xl font-bold text-white">{stats.totalLikes.toLocaleString()}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-r from-purple-600 to-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Inscritos</p>
                <p className="text-2xl font-bold text-white">{stats.subscribers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <button className="card bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Upload de Vídeo</h3>
                <p className="text-primary-200 text-sm">Compartilhe um novo momento</p>
              </div>
            </div>
          </button>

          <button className="card bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 transition-all duration-200 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Gravar Tela</h3>
                <p className="text-accent-200 text-sm">Capture gameplay em tempo real</p>
              </div>
            </div>
          </button>

          <button className="card bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 transition-all duration-200 group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Configurações</h3>
                <p className="text-secondary-200 text-sm">Personalize sua conta</p>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Recent Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Vídeos Recentes</h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus size={16} />
              <span>Ver Todos</span>
            </button>
          </div>

          {recentVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVideos.map((video) => (
                <div key={video._id} className="card hover:scale-105 transition-transform cursor-pointer">
                  <div className="aspect-video bg-secondary-700 rounded-lg mb-4 flex items-center justify-center">
                    <Play className="w-12 h-12 text-secondary-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-secondary-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{video.views || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart size={14} />
                        <span>{video.likes || 0}</span>
                      </span>
                    </div>
                    <span className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{video.duration || '0:00'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Video className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum vídeo ainda</h3>
              <p className="text-secondary-400 mb-6">
                Comece a compartilhar seus melhores momentos de gameplay!
              </p>
              <button className="btn-primary">
                <Upload size={16} className="mr-2" />
                Fazer Primeiro Upload
              </button>
            </div>
          )}
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Performance</h2>
            <TrendingUp className="w-6 h-6 text-primary-400" />
          </div>
          
          <div className="h-32 bg-secondary-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-secondary-400">Gráfico de performance em desenvolvimento</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
