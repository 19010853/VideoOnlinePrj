import axios from "axios";

const apiServer = axios.create({
    baseURL: 'https://video-online-beta.vercel.app/',
    withCredentials: true,
});

export default apiServer;