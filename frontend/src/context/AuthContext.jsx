/* AuthContext — menaxhon login/logout per admin lokalisht */
import { createContext, useContext, useState, useEffect } from "react";

/* Kredencialet e admin-it (lokal) */
const ADMIN_CREDENTIALS = {
  email: "admin@admin.com",
  password: "Loni1234",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Kontrollo localStorage ne fillim per te mbajtur login pas refresh */
  useEffect(() => {
    const savedUser = localStorage.getItem("paradox_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("paradox_user");
      }
    }
    setLoading(false);
  }, []);

  /* Login funksion — kontrollon kredencialet */
  const login = (email, password) => {
    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminUser = {
        email: ADMIN_CREDENTIALS.email,
        name: "Admin",
        role: "Admin",
      };
      setUser(adminUser);
      localStorage.setItem("paradox_user", JSON.stringify(adminUser));
      return { success: true };
    }
    return { success: false, message: "Email ose password i gabuar!" };
  };

  /* Logout — fshin user-in dhe localStorage */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("paradox_user");
  };

  /* Kontrollon nese eshte admin */
  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth duhet brenda AuthProvider");
  return ctx;
};
