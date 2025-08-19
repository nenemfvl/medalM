import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Monitor, 
  Save,
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileSettings, setProfileSettings] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newFollowers: true,
    newComments: true,
    videoLikes: true,
    weeklyDigest: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    allowComments: true,
    allowMessages: true,
    showOnlineStatus: true
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleChangePassword = async () => {
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }
    setIsLoading(true);
    // Simular alteração de senha
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setPasswordSettings({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'privacy', label: 'Privacidade', icon: Eye },
    { id: 'appearance', label: 'Aparência', icon: Palette }
  ];

  return (
    <div className="min-h-screen bg-secondary-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-secondary-400">
            Gerencie suas preferências e configurações da conta
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card"
            >
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white'
                        : 'text-secondary-300 hover:bg-secondary-700 hover:text-white'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <User size={20} />
                    <span>Configurações do Perfil</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Nome de usuário
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileSettings.username}
                        onChange={handleProfileChange}
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileSettings.email}
                        onChange={handleProfileChange}
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Biografia
                      </label>
                      <textarea
                        name="bio"
                        value={profileSettings.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="input w-full resize-none"
                        placeholder="Conte um pouco sobre você..."
                      />
                    </div>
                    
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Salvar Alterações</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Shield size={20} />
                    <span>Segurança</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordSettings.currentPassword}
                          onChange={handlePasswordChange}
                          className="input w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-200"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordSettings.newPassword}
                          onChange={handlePasswordChange}
                          className="input w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-200"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordSettings.confirmPassword}
                          onChange={handlePasswordChange}
                          className="input w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-200"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Lock size={16} />
                          <span>Alterar Senha</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Bell size={20} />
                    <span>Notificações</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleNotificationChange(key)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-600 rounded bg-secondary-700"
                        />
                        <span className="text-secondary-200 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Eye size={20} />
                    <span>Privacidade</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Visibilidade do Perfil
                      </label>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="input w-full"
                      >
                        <option value="public">Público</option>
                        <option value="friends">Apenas Amigos</option>
                        <option value="private">Privado</option>
                      </select>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(privacySettings).slice(1).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-600 rounded bg-secondary-700"
                          />
                          <span className="text-secondary-200 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                    <Palette size={20} />
                    <span>Aparência</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-200 mb-2">
                        Tema
                      </label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => toggleTheme('light')}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            theme === 'light'
                              ? 'border-primary-500 bg-primary-500 text-white'
                              : 'border-secondary-600 text-secondary-300 hover:border-secondary-500'
                          }`}
                        >
                          Claro
                        </button>
                        <button
                          onClick={() => toggleTheme('dark')}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            theme === 'dark'
                              ? 'border-primary-500 bg-primary-500 text-white'
                              : 'border-secondary-600 text-secondary-300 hover:border-secondary-500'
                          }`}
                        >
                          Escuro
                        </button>
                        <button
                          onClick={() => toggleTheme('system')}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            theme === 'system'
                              ? 'border-primary-500 bg-primary-500 text-white'
                              : 'border-secondary-600 text-secondary-300 hover:border-secondary-500'
                          }`}
                        >
                          Sistema
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
