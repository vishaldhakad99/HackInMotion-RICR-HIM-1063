import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper to get sanitized JWT token from localStorage, sessionStorage, or document cookie
const getStoredToken = () => {
  let token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // Fallback: check document.cookie for token or jwt
  if (!token && typeof document !== "undefined" && document.cookie) {
    const match = document.cookie.match(
      /(?:^|;\s*)(?:token|jwt|accessToken)=([^;]+)/
    );
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (
    token &&
    token !== "null" &&
    token !== "undefined" &&
    token.trim() !== ""
  ) {
    return token.replace(/^["']|["']$/g, "").trim();
  }

  return null;
};

// Request interceptor to attach JWT token to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token only if an authenticated request failed due to invalid/expired token
      const hadAuth =
        !!error.config?.headers?.Authorization ||
        !!error.config?.headers?.authorization;
      if (hadAuth) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };

