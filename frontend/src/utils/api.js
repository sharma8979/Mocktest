import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,    // dynamic base URL for Vercel
  withCredentials: false,
});

export default API;
