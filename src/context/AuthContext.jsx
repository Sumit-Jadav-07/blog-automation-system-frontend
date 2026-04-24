/**
 * AuthContext.jsx
 *
 * Manages authentication state across the entire app.
 * Stores JWT tokens + user info in localStorage,
 * provides login/logout/update methods via context.
 */

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const AuthContext = createContext({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  updateTokens: () => {},
});

const STORAGE_KEYS = {
  ACCESS_TOKEN: "abs-access-token",
  REFRESH_TOKEN: "abs-refresh-token",
  USER: "abs-user",
};

/**
 * Load persisted auth state from localStorage.
 */
function loadPersistedAuth() {
  try {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userStr ? JSON.parse(userStr) : null;
    return { accessToken, refreshToken, user };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
}

/**
 * Persist auth state to localStorage.
 */
function persistAuth(accessToken, refreshToken, user) {
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

/**
 * Clear all auth data from localStorage.
 */
function clearPersistedAuth() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

// ── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Hydrate from localStorage on first mount
  useEffect(() => {
    const persisted = loadPersistedAuth();
    if (persisted.accessToken && persisted.user) {
      setAccessToken(persisted.accessToken);
      setRefreshToken(persisted.refreshToken);
      setUser(persisted.user);
    }
    setLoaded(true);
  }, []);

  /**
   * Called after successful login or token refresh.
   * Expects the JwtResponse shape from the backend:
   * { accessToken, refreshToken, tokenType, email, fullName, role }
   */
  const login = useCallback((jwtResponse) => {
    const userData = {
      email: jwtResponse.email,
      fullName: jwtResponse.fullName,
      role: jwtResponse.role,
    };
    setAccessToken(jwtResponse.accessToken);
    setRefreshToken(jwtResponse.refreshToken);
    setUser(userData);
    persistAuth(jwtResponse.accessToken, jwtResponse.refreshToken, userData);
  }, []);

  /**
   * Update tokens after a silent refresh.
   */
  const updateTokens = useCallback((jwtResponse) => {
    const userData = {
      email: jwtResponse.email,
      fullName: jwtResponse.fullName,
      role: jwtResponse.role,
    };
    setAccessToken(jwtResponse.accessToken);
    setRefreshToken(jwtResponse.refreshToken);
    setUser(userData);
    persistAuth(jwtResponse.accessToken, jwtResponse.refreshToken, userData);
  }, []);

  /**
   * Logout — clear everything.
   */
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    clearPersistedAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken && !!user,
      isAdmin: user?.role === "ROLE_ADMIN",
      login,
      logout,
      updateTokens,
      loaded,
    }),
    [user, accessToken, refreshToken, login, logout, updateTokens, loaded]
  );

  // Don't render children until we've loaded from localStorage
  // This prevents a flash of the login page on refresh
  if (!loaded) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export { STORAGE_KEYS };
