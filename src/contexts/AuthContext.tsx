import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  email: string | null;
  setAuthInfo: (token: string, email: string) => void;
  logout: () => void;
}

// Provide default values (mostly null or empty)
const AuthContext = createContext<AuthContextType>({
  token: null,
  email: null,
  setAuthInfo: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  // If you want to store token/email in localStorage and retrieve on refresh:
  useEffect(() => {
    const savedToken = localStorage.getItem("jwtToken");
    const savedEmail = localStorage.getItem("userEmail");
    if (savedToken && savedEmail) {
      setToken(savedToken);
      setEmail(savedEmail);
    }
  }, []);

  const setAuthInfo = (newToken: string, newEmail: string) => {
    setToken(newToken);
    setEmail(newEmail);
    localStorage.setItem("jwtToken", newToken);
    localStorage.setItem("userEmail", newEmail);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userEmail");
    // After logout, redirect to home (StartPage)
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, email, setAuthInfo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
