import apiClient from './client';

// Buscar todos os vídeos
export const getVideos = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return await apiClient.get(`/videos?${queryString}`);
};

// Buscar vídeo por ID
export const getVideo = async (id) => {
  return await apiClient.get(`/videos/${id}`);
};

// Criar novo vídeo
export const createVideo = async (videoData) => {
  return await apiClient.post('/videos', videoData);
};

// Atualizar vídeo
export const updateVideo = async (id, videoData) => {
  return await apiClient.put(`/videos/${id}`, videoData);
};

// Deletar vídeo
export const deleteVideo = async (id) => {
  return await apiClient.delete(`/videos/${id}`);
};

// Like/Unlike vídeo
export const toggleVideoLike = async (id) => {
  return await apiClient.post(`/videos/${id}/like`);
};

// Adicionar comentário
export const addComment = async (id, commentData) => {
  return await apiClient.post(`/videos/${id}/comments`, commentData);
};

// Buscar vídeos por usuário
export const getVideosByUser = async (userId) => {
  return await apiClient.get(`/videos/user/${userId}`);
};

// Buscar vídeos em alta
export const getTrendingVideos = async () => {
  return await apiClient.get('/videos?sort=trending');
};

// Buscar vídeos recentes
export const getRecentVideos = async () => {
  return await apiClient.get('/videos?sort=recent');
};
