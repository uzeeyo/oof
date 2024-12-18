import { useRouter } from "next/router";
import { useContext, createContext, useState, useEffect } from "react";

type User = {
  username: string;
  email?: string;
  password: string;
};

type Props = {
  children?: React.ReactNode;
};

interface AuthContextType {
  isLoggedIn: boolean;
  logIn: ({ username, password }: User) => Promise<void>;
  logOut: () => void;
  signUp: ({ username, email, password }: User) => Promise<boolean>;
  darkMode: boolean;
  isAdmin: boolean;
  clearAuth: () => void;
  loginError: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  logIn: async ({ username, password }: User) => {
    return;
  },
  logOut: () => {},
  signUp: async ({ username, email, password }: User): Promise<boolean> => {
    return false;
  },
  darkMode: true,
  isAdmin: false,
  clearAuth: () => {},
  loginError: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: Props) => {
  const [loginError, setLoginError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log(`Local storage userID ${userId}`);
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    if (userId) {
      setIsLoggedIn(true);
      setIsAdmin(adminStatus);
    }
  }, []);

  const logIn = async ({ username, password }: User) => {
    setLoginError(false);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      const mode = data.settings.darkMode;
      localStorage.setItem("userId", data.id);
      setIsLoggedIn(true);
      localStorage.setItem("themeMode", mode);
      setDarkMode(mode);
      localStorage.setItem("isAdmin", data.isAdmin);

      router.push("/posts");
    } else {
      setLoginError(true);
    }
  };

  const signUp = async ({
    username,
    email,
    password,
  }: User): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        setIsLoggedIn(true);
        return true; // success, can redirect after returning
      } else if (res.status === 409) {
        return false; // specific conflict error (e.g., username taken)
      } else {
        throw new Error("Internal Error");
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logOut = () => {
    fetch("/api/auth/logout", { method: "POST" }).then((res) => {
      if (res.ok) {
        clearAuth();
      }
    });
  };

  const clearAuth = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("themeMode");
    setDarkMode(true);
    setIsLoggedIn(false);
    router.push("/");
  };

  const context = {
    isLoggedIn,
    logIn,
    logOut,
    signUp,
    loginError,
    clearAuth,
    darkMode,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
