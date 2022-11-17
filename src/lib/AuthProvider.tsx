import { useRouter } from "next/router";
import { useContext, createContext, useState } from "react";

type User = {
  username: string;
  password: string;
};

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext({
  userId: null as string | null,
  logIn: async ({ username, password }: User) => {},
  logOut: () => {},
  loginError: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: Props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState(false);
  const router = useRouter();

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
      setUserId(data.userId)
      router.push("/posts");
    } else {
      setLoginError(true)
    }
  };

  const logOut = () => {
    fetch("/api/auth/logout", { method: "POST" }).then((res) => {
      if (res.ok) {
        setUserId(null)
        router.push("/");
      }
    });
  };

  const context = { userId, logIn, logOut, loginError };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
