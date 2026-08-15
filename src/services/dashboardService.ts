import axios from "axios";

const dashboardAPI = axios.create({
  baseURL: "http://127.0.0.1:5000/api/dashboard",
});

dashboardAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default dashboardAPI;