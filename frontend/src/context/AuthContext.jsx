/* AuthContext — menaxhon login/logout me API reale */
import { createContext, useContext, useState, useEffect } from "react";
import { api, setTokens, clearTokens, getAccessToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Ne fillim, nese ka token, merr te dhenat e userit nga API */
  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.get("/auth/me");
        setUser(userData);
        localStorage.setItem("paradox_user", JSON.stringify(userData));
      } catch (err) {
        /* Tokeni i pavlefshem - pastro gjithqka */
        clearTokens();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /* LOGIN — therret API-n reale */
  const login = async (email, password) => {
    try {
      const data = await api.post(
        "/auth/login",
        { email, password },
        { skipAuth: true },
      );

      /* Ruaj tokenat ne localStorage */
      setTokens(data.accessToken, data.refreshToken);
      localStorage.setItem("paradox_user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        message: err.data?.error || err.message || "Gabim ne login",
      };
    }
  };

  /* REGISTER — krijo user te ri */
  const register = async (formData) => {
    try {
      const data = await api.post("/auth/register", formData, {
        skipAuth: true,
      });
      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        message: err.data?.error || err.message || "Gabim ne regjistrim",
      };
    }
  };

  /* LOGOUT — revoko tokenin ne backend dhe pastro localStorage */
  const logout = async () => {
    const refreshToken = localStorage.getItem("paradox_refresh_token");
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken }, { skipAuth: true });
      }
    } catch (err) {
      /* Edhe nese deshton, vazhdo me logout lokal */
      console.error("Logout API error:", err);
    }
    clearTokens();
    setUser(null);
  };

  /* Helper - kontrollon nese useri ka nje rol te caktuar */
  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const isAdmin = hasRole("Admin");

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAdmin, hasRole, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth duhet brenda AuthProvider");
  return ctx;
};
