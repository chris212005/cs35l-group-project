import axios from "axios";

export const url =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    } else {
      delete config.headers.authorization;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);