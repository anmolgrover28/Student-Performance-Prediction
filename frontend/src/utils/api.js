import axios from 'axios';

/** Override with Vite env for deployed demos: `VITE_SERVER_ORIGIN`, `VITE_ML_ORIGIN` */
export const SERVER_ORIGIN = import.meta.env.VITE_SERVER_ORIGIN ?? 'http://localhost:5000';
export const ML_ORIGIN = import.meta.env.VITE_ML_ORIGIN ?? 'http://localhost:8000';

const API = axios.create({ baseURL: `${SERVER_ORIGIN}/api` });

// Attach JWT to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const makePrediction = (data) => API.post('/predict', data);
export const getHistory = () => API.get('/predict/history');
