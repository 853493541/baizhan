import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/characters', // Update this if backend is deployed
});

export default api;
