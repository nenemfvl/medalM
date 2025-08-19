import axios from 'axios';
import toast from 'react-hot-toast';

// Configuração base do Axios
const API_BASE_URL = 'https://medalm.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Tratamento de erros específicos
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token inválido ou expirado
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('Sessão expirada. Faça login novamente.');
          break;
          
        case 403:
          toast.error('Acesso negado.');
          break;
          
        case 404:
          toast.error('Recurso não encontrado.');
          break;
          
        case 429:
          toast.error('Muitas tentativas. Tente novamente em alguns minutos.');
          break;
          
        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.');
          break;
          
        default:
          toast.error(data?.error || data?.message || 'Erro inesperado.');
      }
    } else if (error.request) {
      // Erro de rede
      toast.error('Erro de conexão. Verifique sua internet.');
    } else {
      // Outro tipo de erro
      toast.error('Erro inesperado.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
