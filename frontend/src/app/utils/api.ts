import axios from 'axios';

const api = axios.create({
baseURL: 'http://20.64.241.97:5000/api',
});

export default api;
