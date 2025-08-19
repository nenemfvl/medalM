import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    socialLinks: {
      youtube: user?.socialLinks?.youtube || '',
      twitch: user?.socialLinks?.twitch || '',
      twitter: user?.socialLinks?.twitter || '',
      instagram: user?.socialLinks?.instagram || ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      bio: user?.bio || '',
      socialLinks: {
        youtube: user?.socialLinks?.youtube || '',
        twitch: user?.socialLinks?.twitch || '',
        twitter: user?.socialLinks?.twitter || '',
        instagram: user?.socialLinks?.instagram || ''
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-secondary-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
          <p className="text-secondary-400">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full hover:bg-primary-700 transition-colors">
                  <Camera size={16} className="text-white" />
                </button>
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-2">
                {user?.username}
              </h2>
              <p className="text-secondary-400 text-sm mb-4">
                Membro desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-400">Vídeos</span>
                  <span className="text-white font-medium">{user?.totalVideos || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-400">Visualizações</span>
                  <span className="text-white font-medium">{user?.totalViews?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-400">Likes</span>
                  <span className="text-white font-medium">{user?.totalLikes?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-400">Inscritos</span>
                  <span className="text-white font-medium">{user?.subscribers?.length || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Informações Pessoais</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-ghost flex items-center space-x-2"
                  >
                    <Edit size={16} />
                    <span>Editar</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Salvar</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-outline flex items-center space-x-2"
                    >
                      <X size={16} />
                      <span>Cancelar</span>
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-200 mb-2">
                      Nome de usuário
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="input w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-200 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="input w-full bg-secondary-700 cursor-not-allowed"
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      O email não pode ser alterado
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-200 mb-2">
                    Biografia
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className="input w-full resize-none"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Redes Sociais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        YouTube
                      </label>
                      <input
                        type="url"
                        name="social.youtube"
                        value={formData.socialLinks.youtube}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input w-full"
                        placeholder="https://youtube.com/@seucanal"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Twitch
                      </label>
                      <input
                        type="url"
                        name="social.twitch"
                        value={formData.socialLinks.twitch}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input w-full"
                        placeholder="https://twitch.tv/seucanal"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Twitter
                      </label>
                      <input
                        type="url"
                        name="social.twitter"
                        value={formData.socialLinks.twitter}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input w-full"
                        placeholder="https://twitter.com/seucanal"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        name="social.instagram"
                        value={formData.socialLinks.instagram}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input w-full"
                        placeholder="https://instagram.com/seucanal"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
