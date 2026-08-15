import axios from "axios";

const threatAPI = axios.create({
  baseURL: "http://127.0.0.1:5000/api/threats",
});

threatAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default threatAPI;