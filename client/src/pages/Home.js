import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Upload, 
  Video, 
  Users, 
  Star, 
  TrendingUp,
  ArrowRight,
  Download,
  Gamepad2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Video,
      title: 'Gravação em Alta Qualidade',
      description: 'Grave seus gameplays em até 4K@120fps com áudio cristalino',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Upload,
      title: 'Upload Instantâneo',
      description: 'Compartilhe seus melhores momentos em segundos com a comunidade',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Conecte-se com milhares de gamers e descubra novos talentos',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Star,
      title: 'Sistema de Ranking',
      description: 'Compete pelos melhores clipes e suba no ranking global',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Vídeos Publicados' },
    { number: '500K+', label: 'Usuários Ativos' },
    { number: '50M+', label: 'Visualizações' },
    { number: '24/7', label: 'Suporte Online' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Compartilhe seus{' '}
                <span className="gradient-text">momentos épicos</span>
              </h1>
              
              <p className="text-xl text-secondary-300 mb-8 max-w-2xl">
                A plataforma definitiva para gravação e compartilhamento de gameplay. 
                Capture seus melhores momentos, edite com ferramentas profissionais e 
                compartilhe com milhões de gamers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                    <Gamepad2 size={20} className="mr-2" />
                    Ir para Dashboard
                  </Link>
                ) : (
                  <Link to="/register" className="btn-primary text-lg px-8 py-3">
                    <Play size={20} className="mr-2" />
                    Começar Agora
                  </Link>
                )}
                
                <button className="btn-outline text-lg px-8 py-3">
                  <Download size={20} className="mr-2" />
                  Download App
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-primary-400">
                      {stat.number}
                    </div>
                    <div className="text-sm text-secondary-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Hero Image/Video */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-600 to-accent-600 p-1">
                <div className="bg-secondary-800 rounded-xl p-8">
                  <div className="aspect-video bg-secondary-700 rounded-lg flex items-center justify-center">
                    <Play size={48} className="text-primary-400" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-secondary-600 rounded-full w-3/4" />
                    <div className="h-3 bg-secondary-700 rounded-full w-1/2" />
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              >
                🔴 AO VIVO
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp size={16} />
                  <span className="text-sm font-medium">Em Alta</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tudo que você precisa para{' '}
              <span className="gradient-text">brilhar</span>
            </h2>
            <p className="text-xl text-secondary-400 max-w-3xl mx-auto">
              Ferramentas profissionais para capturar, editar e compartilhar 
              seus melhores momentos de gameplay
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-hover group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-secondary-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Pronto para mostrar suas habilidades?
            </h2>
            
            <p className="text-xl text-white/90 mb-8">
              Junte-se a milhares de gamers e comece a compartilhar 
              seus momentos épicos hoje mesmo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/upload" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                  <Upload size={20} className="mr-2" />
                  Fazer Upload
                </Link>
              ) : (
                <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                  <ArrowRight size={20} className="mr-2" />
                  Criar Conta Grátis
                </Link>
              )}
              
              <Link to="/videos" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3">
                <Video size={20} className="mr-2" />
                Ver Vídeos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
