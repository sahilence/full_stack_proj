import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const token = window.localStorage.getItem('token');
if (token) {
    //create a persistent header with the token
    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export default axiosInstance;