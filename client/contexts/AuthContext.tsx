import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
  joinDate: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy user database
const DUMMY_USERS: Record<string, User & { password: string }> = {
  "admin@airpay.com": {
    id: "admin-001",
    email: "admin@airpay.com",
    name: "Admin User",
    role: "admin",
    password: "admin123",
    joinDate: "2023-01-15",
    lastLogin: new Date().toISOString(),
  },
  "user@airpay.com": {
    id: "user-001",
    email: "user@airpay.com",
    name: "John Doe",
    role: "user",
    password: "user123",
    joinDate: "2024-03-20",
    lastLogin: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = DUMMY_USERS[email.toLowerCase()];
    
    if (userData && userData.password === password) {
      const { password: _, ...userWithoutPassword } = userData;
      userWithoutPassword.lastLogin = new Date().toISOString();
      
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user already exists
    if (DUMMY_USERS[userData.email.toLowerCase()]) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      role: "user",
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    // Add to dummy database
    DUMMY_USERS[userData.email.toLowerCase()] = {
      ...newUser,
      password: userData.password,
    };
    
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
