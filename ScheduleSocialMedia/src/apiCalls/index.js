import axios from "axios";

<<<<<<< HEAD
export const url = "http://localhost:3000";
=======
export const url =
  import.meta.env.VITE_API_URL || "http://localhost:3000";
>>>>>>> f3ff4f5 (use render backend url for frontend)

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
