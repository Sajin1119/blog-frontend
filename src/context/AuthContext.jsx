import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user safely from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });
const login = (access, refresh, userData) => {
  localStorage.setItem("access_token", access);  // ← must match axios
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user", JSON.stringify(userData));
  setUser(userData);
};

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};