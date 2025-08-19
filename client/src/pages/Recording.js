import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Square, 
  Pause, 
  Play, 
  Settings, 
  Monitor, 
  Mic, 
  Camera,
  Download,
  Trash2,
  Clock,
  HardDrive
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Recording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingSettings, setRecordingSettings] = useState({
    quality: '1080p',
    fps: 60,
    audio: true,
    webcam: false,
    systemAudio: true
  });
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    // Simular salvamento da gravação
    const newRecording = {
      id: Date.now(),
      name: `Gravação_${new Date().toLocaleString('pt-BR')}`,
      duration: recordingTime,
      size: Math.round(recordingTime * 0.1), // MB simulados
      date: new Date(),
      status: 'processing'
    };
    setRecordings(prev => [newRecording, ...prev]);
    setRecordingTime(0);
  };

  const pauseRecording = () => {
    setIsPaused(true);
  };

  const resumeRecording = () => {
    setIsPaused(false);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSettingChange = (setting, value) => {
    setRecordingSettings(prev => ({
      ...prev,
      [setting]: value
    }));
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
          <h1 className="text-3xl font-bold text-white mb-2">Gravação de Tela</h1>
          <p className="text-secondary-400">
            Capture seus melhores momentos de gameplay com qualidade profissional
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Recording Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card"
            >
              {/* Recording Preview */}
              <div className="aspect-video bg-secondary-800 rounded-lg mb-6 flex items-center justify-center relative">
                {isRecording ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                      <Square className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium">Gravando...</p>
                    <p className="text-2xl font-mono text-primary-400 mt-2">
                      {formatTime(recordingTime)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Video className="w-16 h-16 text-secondary-400 mb-4" />
                    <p className="text-secondary-400">Clique em Gravar para começar</p>
                  </div>
                )}
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>AO VIVO</span>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="btn-primary flex items-center space-x-2 px-8 py-3"
                  >
                    <Video size={20} />
                    <span>Iniciar Gravação</span>
                  </button>
                ) : (
                  <>
                    {isPaused ? (
                      <button
                        onClick={resumeRecording}
                        className="btn-primary flex items-center space-x-2 px-8 py-3"
                      >
                        <Play size={20} />
                        <span>Retomar</span>
                      </button>
                    ) : (
                      <button
                        onClick={pauseRecording}
                        className="btn-outline flex items-center space-x-2 px-8 py-3"
                      >
                        <Pause size={20} />
                        <span>Pausar</span>
                      </button>
                    )}
                    
                    <button
                      onClick={stopRecording}
                      className="btn bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 px-8 py-3"
                    >
                      <Square size={20} />
                      <span>Parar</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Recent Recordings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card mt-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Gravações Recentes</h3>
              
              {recordings.length > 0 ? (
                <div className="space-y-3">
                  {recordings.map((recording) => (
                    <div key={recording.id} className="flex items-center justify-between p-3 bg-secondary-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="w-8 h-8 text-primary-400" />
                        <div>
                          <p className="text-white font-medium">{recording.name}</p>
                          <div className="flex items-center space-x-4 text-sm text-secondary-400">
                            <span className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{formatTime(recording.duration)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <HardDrive size={14} />
                              <span>{recording.size} MB</span>
                            </span>
                            <span>{recording.date.toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="btn-ghost p-2 text-secondary-400 hover:text-primary-400">
                          <Download size={16} />
                        </button>
                        <button className="btn-ghost p-2 text-secondary-400 hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-400">Nenhuma gravação ainda</p>
                  <p className="text-sm text-secondary-500">
                    Suas gravações aparecerão aqui
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Recording Settings */}
              <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="w-5 h-5 text-secondary-400" />
                  <h3 className="text-lg font-semibold text-white">Configurações</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-200 mb-2">
                      Qualidade
                    </label>
                    <select
                      value={recordingSettings.quality}
                      onChange={(e) => handleSettingChange('quality', e.target.value)}
                      className="input w-full"
                    >
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="1440p">1440p</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-200 mb-2">
                      FPS
                    </label>
                    <select
                      value={recordingSettings.fps}
                      onChange={(e) => handleSettingChange('fps', e.target.value)}
                      className="input w-full"
                    >
                      <option value="30">30 FPS</option>
                      <option value="60">60 FPS</option>
                      <option value="120">120 FPS</option>
                      <option value="144">144 FPS</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={recordingSettings.audio}
                        onChange={(e) => handleSettingChange('audio', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-600 rounded bg-secondary-700"
                      />
                      <Mic className="w-4 h-4 text-secondary-400" />
                      <span className="text-secondary-200">Capturar áudio do microfone</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={recordingSettings.systemAudio}
                        onChange={(e) => handleSettingChange('systemAudio', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-600 rounded bg-secondary-700"
                      />
                      <Monitor className="w-4 h-4 text-secondary-400" />
                      <span className="text-secondary-200">Capturar áudio do sistema</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={recordingSettings.webcam}
                        onChange={(e) => handleSettingChange('webcam', e.target.checked)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-600 rounded bg-secondary-700"
                      />
                      <Camera className="w-4 h-4 text-secondary-400" />
                      <span className="text-secondary-200">Incluir webcam</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Recording Stats */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Tempo total gravado</span>
                    <span className="text-white font-medium">
                      {formatTime(recordings.reduce((total, r) => total + r.duration, 0))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Gravações salvas</span>
                    <span className="text-white font-medium">{recordings.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-secondary-400">Espaço usado</span>
                    <span className="text-white font-medium">
                      {recordings.reduce((total, r) => total + r.size, 0)} MB
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recording;
