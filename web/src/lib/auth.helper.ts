const TOKEN_KEY = "token";

export const auth = {
  setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated() {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  }
};