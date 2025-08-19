import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Video, Image, Tag, X, Play, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { uploadVideo, uploadThumbnail } from '../api/upload';
import { createVideo } from '../api/videos';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const VideoUpload = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    isPublic: true
  });

  const onVideoDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('Vídeo muito grande. Máximo 100MB.');
        return;
      }
      setVideoFile(file);
    }
  }, []);

  const onThumbnailDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Thumbnail muito grande. Máximo 5MB.');
        return;
      }
      setThumbnailFile(file);
    }
  }, []);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
    onDrop: onVideoDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm']
    },
    multiple: false
  });

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error('Selecione um vídeo para upload');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Digite um título para o vídeo');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload do vídeo
      const videoResponse = await uploadVideo(videoFile, (progress) => {
        setUploadProgress(progress * 0.7); // Vídeo representa 70% do progresso
      });

      // Upload da thumbnail (se houver)
      let thumbnailUrl = '';
      if (thumbnailFile) {
        const thumbnailResponse = await uploadThumbnail(thumbnailFile, (progress) => {
          setUploadProgress(70 + (progress * 0.3)); // Thumbnail representa 30% do progresso
        });
        thumbnailUrl = thumbnailResponse.url;
      }

      // Criar vídeo no banco
      const videoData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        videoUrl: videoResponse.url,
        thumbnailUrl: thumbnailUrl || videoResponse.thumbnailUrl,
        isPublic: formData.isPublic
      };

      await createVideo(videoData);
      
      toast.success('Vídeo enviado com sucesso!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar vídeo. Tente novamente.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setUploadProgress(0);
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
  };

  const categories = [
    'Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Fighting', 'Puzzle', 'Simulation'
  ];

  return (
    <div className="min-h-screen bg-secondary-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Upload de Vídeo</h1>
          <p className="text-secondary-400">
            Compartilhe seus melhores momentos de gameplay com a comunidade
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Video Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Vídeo</h3>
            
            {!videoFile ? (
              <div
                {...getVideoRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isVideoDragActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-secondary-600 hover:border-secondary-500'
                }`}
              >
                <input {...getVideoInputProps()} />
                <Video className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-white mb-2">
                  {isVideoDragActive ? 'Solte o vídeo aqui' : 'Arraste e solte um vídeo'}
                </p>
                <p className="text-secondary-400">
                  ou clique para selecionar um arquivo
                </p>
                <p className="text-sm text-secondary-500 mt-2">
                  MP4, AVI, MOV, MKV, WMV, FLV, WebM • Máx. 100MB
                </p>
              </div>
            ) : (
              <div className="bg-secondary-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Play className="w-8 h-8 text-primary-400" />
                    <div>
                      <p className="text-white font-medium">{videoFile.name}</p>
                      <p className="text-sm text-secondary-400">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="p-2 text-secondary-400 hover:text-red-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Thumbnail Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Thumbnail (Opcional)</h3>
            
            {!thumbnailFile ? (
              <div
                {...getThumbnailRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isThumbnailDragActive
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-secondary-600 hover:border-secondary-500'
                }`}
              >
                <input {...getThumbnailInputProps()} />
                <Image className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-white mb-2">
                  {isThumbnailDragActive ? 'Solte a imagem aqui' : 'Arraste e solte uma thumbnail'}
                </p>
                <p className="text-secondary-400">
                  ou clique para selecionar uma imagem
                </p>
                <p className="text-sm text-secondary-500 mt-2">
                  JPG, PNG, GIF, WebP • Máx. 5MB
                </p>
              </div>
            ) : (
              <div className="bg-secondary-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image className="w-8 h-8 text-accent-400" />
                    <div>
                      <p className="text-white font-medium">{thumbnailFile.name}</p>
                      <p className="text-sm text-secondary-400">
                        {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="p-2 text-secondary-400 hover:text-red-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Video Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Detalhes do Vídeo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-200 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Digite o título do vídeo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-200 mb-2">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary-200 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input w-full resize-none"
                placeholder="Descreva seu vídeo..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary-200 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input flex-1"
                  placeholder="gaming, fps, multiplayer (separadas por vírgula)"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-600 rounded bg-secondary-700"
                />
                <span className="text-secondary-200">Tornar vídeo público</span>
              </label>
            </div>
          </motion.div>

          {/* Upload Progress */}
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
            >
              <div className="flex items-center space-x-4 mb-4">
                <LoadingSpinner size="md" />
                <div className="flex-1">
                  <p className="text-white font-medium">Enviando vídeo...</p>
                  <p className="text-sm text-secondary-400">
                    Não feche esta página durante o upload
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-secondary-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-secondary-400 mt-2 text-center">
                {Math.round(uploadProgress)}% completo
              </p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-end space-x-4"
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-outline"
              disabled={isUploading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={!videoFile || isUploading}
              className="btn-primary flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Enviar Vídeo</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload;
