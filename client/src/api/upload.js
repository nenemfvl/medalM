import apiClient from './client';

// Upload de vídeo
export const uploadVideo = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('video', file);

  return await apiClient.post('/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
};

// Upload de thumbnail
export const uploadThumbnail = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('thumbnail', file);

  return await apiClient.post('/upload/thumbnail', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
};

// Upload múltiplo de vídeos
export const uploadMultipleVideos = async (files, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('videos', file);
  });

  return await apiClient.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      }
    },
  });
};

// Deletar arquivo
export const deleteFile = async (filename, type = 'video') => {
  return await apiClient.delete(`/upload/${filename}?type=${type}`);
};
