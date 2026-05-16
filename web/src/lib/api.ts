import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api",
});

// =========================
// Request Interceptor
// =========================
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// =========================
// Response Interceptor (clean)
// =========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // normalize error (no side effects)
    const normalizedError = {
      message: error?.response?.data?.message || "Network Error",
      status: error?.response?.status,
      data: error?.response?.data,
    };

    return Promise.reject(normalizedError);
  }
);

export default api;