import axios from "axios";

const apiServer = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

export default apiServer;