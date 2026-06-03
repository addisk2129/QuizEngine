
// features/auth/authService.js - Updated
import axiosPublic from '../../utils/axiosPublic';
import axiosPrivate from '../../utils/axiosPrivate';

export const authService = {
  login: async (email, password) => {
    const response = await axiosPublic.post('/auth/login', { email, password });
    const { accessToken, refreshToken, data } = response.data;
    
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return response.data;
  },
  
  signup: async (userData) => {
    const response = await axiosPublic.post('/auth/signup', userData);
    const { accessToken, refreshToken, data } = response.data;
    
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return response.data;
  },
  
  googleLogin: async (credential) => {
    const response = await axiosPublic.post('/auth/google-login', { credential });
    const { accessToken, refreshToken, data } = response.data;
    
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return response.data;
  },
  
  getProfile: async () => {
    const response = await axiosPrivate.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axiosPrivate.patch('/user/profile', userData);
    const updatedUser = response.data.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axiosPrivate.patch('/auth/change-password', passwordData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosPublic.post('/auth/forgotPassword', { email });
    return response.data;
  },

  resetPassword: async (token, passwordData) => {
    const response = await axiosPublic.patch(`/auth/resetPassword/${token}`, passwordData);
    const { accessToken, refreshToken, data } = response.data;
    
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};