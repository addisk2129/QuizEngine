// utils/refreshToken.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  
  localStorage.setItem('token', response.data.accessToken);
  if (response.data.refreshToken) {
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }
  return response.data.accessToken;
};