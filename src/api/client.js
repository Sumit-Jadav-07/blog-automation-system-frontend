/**
 * client.js
 *
 * This file handles all the API calls to our backend server.
 * It uses axios to make HTTP requests and automatically attaches
 * the JWT token from localStorage to every request.
 *
 * Features:
 *   - JWT Authorization header via request interceptor
 *   - Automatic token refresh on 401 via response interceptor
 *   - Auth API functions (signup, login, OTP, forgot/reset password)
 *   - Blog API functions (fetch, generate, delete)
 */

import axios from "axios";

// Storage keys — must match AuthContext
const STORAGE_KEYS = {
  ACCESS_TOKEN: "abs-access-token",
  REFRESH_TOKEN: "abs-refresh-token",
  USER: "abs-user",
};

// ── Axios Instance ───────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor: Attach JWT ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 & Auto-Refresh ──────────────
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401s that aren't auth endpoints or retries
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      if (isRefreshing) {
        // Another refresh is in progress — queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!storedRefreshToken) {
        // No refresh token — force logout
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        // Update stored tokens
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify({
            email: data.email,
            fullName: data.fullName,
            role: data.role,
          })
        );

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Clear all auth data from localStorage and redirect to login.
 */
function clearAuthAndRedirect() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  // Only redirect if we're not already on an auth page
  if (
    !window.location.pathname.includes("/login") &&
    !window.location.pathname.includes("/signup") &&
    !window.location.pathname.includes("/forgot-password")
  ) {
    window.location.href = "/login";
  }
}

// ═══════════════════════════════════════════════════════════════════
//   AUTH API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Register a new user. Backend sends OTP to email.
 * @returns {{ success: boolean, message: string }}
 */
export async function signupUser(email, password, fullName) {
  const { data } = await api.post("/auth/signup", { email, password, fullName });
  return data;
}

/**
 * Verify email OTP after signup.
 * @returns {{ success: boolean, message: string }}
 */
export async function verifyOtp(email, otp) {
  const { data } = await api.post("/auth/verify-otp", { email, otp });
  return data;
}

/**
 * Login and receive JWT tokens.
 * @returns {{ accessToken, refreshToken, tokenType, email, fullName, role }}
 */
export async function loginUser(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

/**
 * Request password reset OTP.
 * @returns {{ success: boolean, message: string }}
 */
export async function forgotPassword(email) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

/**
 * Reset password with OTP verification.
 * @returns {{ success: boolean, message: string }}
 */
export async function resetPassword(email, otp, newPassword) {
  const { data } = await api.post("/auth/reset-password", { email, otp, newPassword });
  return data;
}

/**
 * Refresh access token using refresh token.
 * @returns {{ accessToken, refreshToken, tokenType, email, fullName, role }}
 */
export async function refreshAccessToken(refreshToken) {
  const { data } = await api.post("/auth/refresh-token", { refreshToken });
  return data;
}

// ═══════════════════════════════════════════════════════════════════
//   BLOG API FUNCTIONS (unchanged logic, now uses JWT via interceptor)
// ═══════════════════════════════════════════════════════════════════

// Get all blogs — used on the dashboard to show the history list
export async function fetchBlogs() {
  const { data } = await api.get("/blogs");
  console.log("Fetched blogs:", data);
  return data;
}

// Get one specific blog by ID — used when clicking a blog or opening the reader page
export async function fetchBlog(blogId) {
  const { data } = await api.get(`/blogs/${blogId}`);
  return data;
}

// Ask the AI pipeline to generate a new blog from a topic and target platform
export async function generateBlog(topic, platform) {
  const params = new URLSearchParams({
    topic,
    platform,
  });
  const { data } = await api.post(`/blogs/generate?${params.toString()}`);
  return data;
}

// Permanently delete a blog — this can't be undone!
export async function deleteBlog(blogId) {
  const { data } = await api.delete(`/blogs/${blogId}`);
  return data;
}
