import axios from "axios";

// =========================
// 🌐 Axios Instance
// =========================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// 🔐 Request Interceptor
// =========================
api.interceptors.request.use(
  (config) => {
    // ✅ SSR Safe
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject({
      message: error.message || "Request Error",
      status: error.response?.status || 500,
      data: error.response?.data || null,
    });
  }
);

// =========================
// 🚨 Response Interceptor
// =========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    // =========================
    // 🔐 Unauthorized
    // =========================
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");

        // 🚀 Future:
        // refresh token logic here

        window.location.href = "/login";
      }
    }

    // =========================
    // 📦 Normalize Error
    // =========================
    return Promise.reject({
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",

      status: status || 500,

      data: error.response?.data || null,
    });
  }
);

export default api;
