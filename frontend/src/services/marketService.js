import axios from 'axios';

const API_URL = 'http://localhost:8000/market';

export const marketService = {
    getIndices: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/indices`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
