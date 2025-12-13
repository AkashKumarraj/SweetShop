import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const login = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole); // "USER" or "ADMIN"
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
