import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, Play, Eye, Heart, Clock } from 'lucide-react';
import { getVideos } from '../api/videos';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'recent',
    duration: ''
  });

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, filters]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const response = await getVideos({
        search: query,
        category: filters.category,
        sort: filters.sortBy,
        duration: filters.duration
      });
      setVideos(response.videos || []);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-secondary-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Resultados da busca para "{query}"
          </h1>
          <p className="text-secondary-400">
            {videos.length} vídeos encontrados
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-secondary-400" />
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">
                Categoria
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input w-full"
              >
                <option value="">Todas as categorias</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="RPG">RPG</option>
                <option value="Strategy">Strategy</option>
                <option value="Sports">Sports</option>
                <option value="Racing">Racing</option>
                <option value="Fighting">Fighting</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Simulation">Simulation</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input w-full"
              >
                <option value="recent">Mais recentes</option>
                <option value="popular">Mais populares</option>
                <option value="views">Mais visualizados</option>
                <option value="likes">Mais curtidos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-200 mb-2">
                Duração
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="input w-full"
              >
                <option value="">Qualquer duração</option>
                <option value="short">Curto (0-4 min)</option>
                <option value="medium">Médio (4-20 min)</option>
                <option value="long">Longo (20+ min)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : videos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {videos.map((video) => (
              <div key={video._id} className="card hover:scale-105 transition-transform cursor-pointer">
                <div className="aspect-video bg-secondary-700 rounded-lg mb-4 flex items-center justify-center relative">
                  <Play className="w-12 h-12 text-secondary-400" />
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  )}
                </div>
                
                <h3 className="text-white font-semibold mb-2 line-clamp-2">
                  {video.title}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-secondary-400 mb-3">
                  <span className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{video.views || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart size={14} />
                    <span>{video.likes || 0}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <img
                    src={video.user?.avatar || 'https://via.placeholder.com/24/6366f1/ffffff?text=U'}
                    alt={video.user?.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-secondary-400">
                    {video.user?.username}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
                         <SearchIcon className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum resultado encontrado</h3>
            <p className="text-secondary-400">
              Tente ajustar os filtros ou usar termos de busca diferentes
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;
