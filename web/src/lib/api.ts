import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      message: error?.response?.data?.message || "Network Error",
      status: error?.response?.status,
      data: error?.response?.data,
    };
    return Promise.reject(normalizedError);
  }
);

export default api;