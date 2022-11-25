import { useRouter } from "next/router";
import { useContext, createContext, useState, useEffect } from "react";

type User = {
  username: string;
  password: string;
};

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext({
  isLoggedIn: false,
  logIn: async ({ username, password }: User) => {},
  logOut: () => {},
  loginError: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: Props) => {
  const [loginError, setLoginError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) setIsLoggedIn(true);
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
      localStorage.setItem("userId", data.userId);
      setIsLoggedIn(true);
      router.push("/posts");
    } else {
      setLoginError(true);
    }
  };

  const logOut = () => {
    fetch("/api/auth/logout", { method: "POST" }).then((res) => {
      if (res.ok) {
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        router.push("/");
      }
    });
  };

  const context = { isLoggedIn, logIn, logOut, loginError };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
