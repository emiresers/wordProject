import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (username: string, password: string) => {
  return axios.post(`${API_URL}/register`, { username, password });
};

export const login = async (username: string, password: string) => {
  return axios.post(`${API_URL}/login`, { username, password });
};

export const resetPassword = async (username: string, newPassword: string) => {
  return axios.post(`${API_URL}/reset-password`, { username, newPassword });
}; 