import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "user1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123", // In a real app, this would be hashed
    profileImage: undefined,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // On component mount, check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const user = MOCK_USERS.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Remove password before storing
      const { password, ...safeUser } = user;

      // Save user to state
      setAuthState({
        isAuthenticated: true,
        user: safeUser,
        loading: false,
      });

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(safeUser));

      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${safeUser.name}!`,
      });

      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Check if email already exists
    if (MOCK_USERS.some((user) => user.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive",
      });
      return false;
    }

    // Create new user
    const newUser = {
      id: `user${MOCK_USERS.length + 1}`,
      name,
      email,
      password,
      profileImage: undefined,
    };

    // Add to mock users
    MOCK_USERS.push(newUser);

    // Remove password before storing
    const { password: _, ...safeUser } = newUser;

    // Save user to state
    setAuthState({
      isAuthenticated: true,
      user: safeUser,
      loading: false,
    });

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(safeUser));

    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`,
    });

    return true;
  };

  const logout = () => {
    // Clear state
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });

    // Remove from localStorage
    localStorage.removeItem("user");

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...userData };

    // Update state
    setAuthState({
      ...authState,
      user: updatedUser,
    });

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update in MOCK_USERS array for consistency
    const userIndex = MOCK_USERS.findIndex(
      (user) => user.id === authState.user?.id
    );
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = {
        ...MOCK_USERS[userIndex],
        ...userData,
        password: MOCK_USERS[userIndex].password,
      };
    }

    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
