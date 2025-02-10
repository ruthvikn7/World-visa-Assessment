import axios from 'axios';
import api from '../../baseurl';



export const login = async (email, password) => {
  const response = await api.post(`/users/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user.id));
  }
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post(`/users/register`, {
    username,
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user.id));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};