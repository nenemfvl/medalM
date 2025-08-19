import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { getVideo } from '../api/videos';
import { toggleVideoLike, addComment } from '../api/videos';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await getVideo(id);
        setVideo(response);
        setIsLiked(response.likes?.includes(user?.id) || false);
      } catch (error) {
        console.error('Erro ao buscar vídeo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return;
    
    try {
      await toggleVideoLike(id);
      setIsLiked(!isLiked);
      setVideo(prev => ({
        ...prev,
        likes: isLiked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (error) {
      console.error('Erro ao curtir vídeo:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    try {
      await addComment(id, { content: comment });
      setComment('');
      // Recarregar comentários
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Vídeo não encontrado</h2>
          <p className="text-secondary-400">O vídeo que você está procurando não existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card p-0 overflow-hidden"
            >
              {/* Video Container */}
              <div className="relative aspect-video bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-20 h-20 text-white/80" />
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-primary-400 transition-colors"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-primary-400 transition-colors"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    
                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div className="bg-primary-500 h-1 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
                    </div>
                    
                    <button className="text-white hover:text-primary-400 transition-colors">
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card mt-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-secondary-400">
                    <span className="flex items-center space-x-1">
                      <Eye size={16} />
                      <span>{video.views || 0} visualizações</span>
                    </span>
                    <span>•</span>
                    <span>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? 'bg-red-600 text-white'
                        : 'bg-secondary-700 text-secondary-300 hover:bg-secondary-600'
                    }`}
                  >
                    <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                    <span>{video.likes || 0}</span>
                  </button>
                  
                  <button className="btn-outline flex items-center space-x-2">
                    <Share2 size={16} />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>

              {video.description && (
                <p className="text-secondary-300 mb-4">{video.description}</p>
              )}

              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary-700 text-secondary-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card mt-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Comentários ({video.comments?.length || 0})
              </h3>

              {user && (
                <form onSubmit={handleComment} className="mb-6">
                  <div className="flex space-x-3">
                    <img
                      src={user.avatar || 'https://via.placeholder.com/32/6366f1/ffffff?text=U'}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Adicione um comentário..."
                        className="input w-full resize-none"
                        rows={2}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="btn-primary px-6"
                    >
                      Comentar
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {video.comments?.map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    <img
                      src={comment.user?.avatar || 'https://via.placeholder.com/32/6366f1/ffffff?text=U'}
                      alt={comment.user?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-secondary-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-white">
                            {comment.user?.username}
                          </span>
                          <span className="text-xs text-secondary-400">
                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-secondary-300">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Author Info */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={video.user?.avatar || 'https://via.placeholder.com/48/6366f1/ffffff?text=U'}
                    alt={video.user?.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{video.user?.username}</h4>
                    <p className="text-sm text-secondary-400">
                      {video.user?.subscribers?.length || 0} inscritos
                    </p>
                  </div>
                </div>
                
                <button className="w-full btn-outline">
                  Inscrever-se
                </button>
              </div>

              {/* Related Videos */}
              <div className="card">
                <h4 className="font-semibold text-white mb-4">Vídeos Relacionados</h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex space-x-3">
                      <div className="w-24 h-16 bg-secondary-700 rounded flex items-center justify-center">
                        <Play size={16} className="text-secondary-400" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-white line-clamp-2">
                          Vídeo relacionado {i}
                        </h5>
                        <p className="text-xs text-secondary-400">
                          Nome do Canal
                        </p>
                        <p className="text-xs text-secondary-400">
                          {Math.floor(Math.random() * 100)}K visualizações
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
