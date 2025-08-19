import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Save, X } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const VideoEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="min-h-screen bg-secondary-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Editor de Vídeo</h1>
          <p className="text-secondary-400">
            Funcionalidade em desenvolvimento
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoEdit;
