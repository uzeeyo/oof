import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider as MuiProvider,
} from "@mui/material/styles";
import { useAuth } from "./AuthProvider";

type Props = {
  children?: React.ReactNode;
};

export enum Tailwind {
  DARK = "dark",
  LIGHT = "light",
}

const TailwindContext = createContext({
  theme: Tailwind.DARK,
  setTheme: (themeMode: Tailwind) => {},
});

export const useTheme = () => useContext(TailwindContext);

export const ThemeProvider = ({ children }: Props) => {
  const { darkMode } = useAuth();
  const [theme, setTheme] = useState(Tailwind.DARK);

  useEffect(() => {
    if (!localStorage.getItem("themeMode") ) {
      localStorage.setItem("themeMode", darkMode ? "dark" : "light");
    }
    setTheme(
      localStorage.getItem("themeMode") === "dark"
        ? Tailwind.DARK
        : Tailwind.LIGHT
    );
  }, []);


  const currentTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: theme,
        primary: {
          main: "#4de072",
        },
        secondary: {
          main: "#f570b9",
        },
      },
    });
  }, [theme]);

  const context = { theme, setTheme };
  return (
    <TailwindContext.Provider value={context}>
      <MuiProvider theme={currentTheme}>
        <div className={theme}>{children}</div>
      </MuiProvider>
    </TailwindContext.Provider>
  );
};
