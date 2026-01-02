import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: "USER" | "ADMIN"
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------- RESTORE SESSION USING JWT ---------- */
  useEffect(() => {
    const token = localStorage.getItem("irctc_token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUser(data);
        else localStorage.removeItem("irctc_token");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- LOGIN ---------- */
  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (email === 'admin@irctc.com' && password === 'admin123') {
      const adminUser: User = { id: 'admin1', name: 'Admin User', email, role: 'ADMIN' };
      setUser(adminUser);
      localStorage.setItem('irctc_user', JSON.stringify(adminUser));
      localStorage.setItem('irctc_token', 'mock_jwt_token_admin');
      return true;
    }
    
    if (email === 'user@irctc.com' && password === 'user123') {
      const regularUser: User = { id: 'user1', name: 'Test User', email, role: 'USER' };
      setUser(regularUser);
      localStorage.setItem('irctc_user', JSON.stringify(regularUser));
      localStorage.setItem('irctc_token', 'mock_jwt_token_user');
      return true;
    }

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("irctc_token", data.token);
    setUser(data.user);
    return true;
  };

  /* ---------- SIGNUP (NO AUTO LOGIN) ---------- */
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "USER" | "ADMIN"
  ): Promise<boolean> => {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    return res.ok;
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.removeItem("irctc_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: 'USER' | 'ADMIN';
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   signup: (name: string, email: string, password: string) => Promise<boolean>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('irctc_user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     const users = JSON.parse(localStorage.getItem('irctc_users') || '[]');
//     const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
//     if (foundUser) {
//       const userData: User = {
//         id: foundUser.id,
//         name: foundUser.name,
//         email: foundUser.email,
//         role: foundUser.role,
//       };
//       setUser(userData);
//       localStorage.setItem('irctc_user', JSON.stringify(userData));
//       localStorage.setItem('irctc_token', 'mock_jwt_token_' + foundUser.id);
//       return true;
//     }
    
//     // Demo accounts
//     if (email === 'admin@irctc.com' && password === 'admin123') {
//       const adminUser: User = { id: 'admin1', name: 'Admin User', email, role: 'ADMIN' };
//       setUser(adminUser);
//       localStorage.setItem('irctc_user', JSON.stringify(adminUser));
//       localStorage.setItem('irctc_token', 'mock_jwt_token_admin');
//       return true;
//     }
    
//     if (email === 'user@irctc.com' && password === 'user123') {
//       const regularUser: User = { id: 'user1', name: 'Test User', email, role: 'USER' };
//       setUser(regularUser);
//       localStorage.setItem('irctc_user', JSON.stringify(regularUser));
//       localStorage.setItem('irctc_token', 'mock_jwt_token_user');
//       return true;
//     }
    
//     return false;
//   };

//   const signup = async (name: string, email: string, password: string): Promise<boolean> => {
//     // Mock signup
//     const users = JSON.parse(localStorage.getItem('irctc_users') || '[]');
    
//     if (users.find((u: any) => u.email === email)) {
//       return false; // User already exists
//     }
    
//     const newUser = {
//       id: 'user_' + Date.now(),
//       name,
//       email,
//       password,
//       role: 'USER' as const,
//     };
    
//     users.push(newUser);
//     localStorage.setItem('irctc_users', JSON.stringify(users));
    
//     const userData: User = {
//       id: newUser.id,
//       name: newUser.name,
//       email: newUser.email,
//       role: newUser.role,
//     };
//     setUser(userData);
//     localStorage.setItem('irctc_user', JSON.stringify(userData));
//     localStorage.setItem('irctc_token', 'mock_jwt_token_' + newUser.id);
    
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('irctc_user');
//     localStorage.removeItem('irctc_token');
//   };

//   return (
//     <AuthContext.Provider 
//       value={{ 
//         user, 
//         isAuthenticated: !!user,
//         isAdmin: user?.role === 'ADMIN',
//         login, 
//         signup, 
//         logout 
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
