import axios from 'axios';

const api = axios.create({
    baseURL: 'https://viagem-backend.herokuapp.com/viagem'
});

export default api; 