import { createContext, useContext, useState } from "react";

type Props = {
    children?: React.ReactNode;
}

export enum Tailwind {
    DARK = "dark",
    LIGHT = "light",
};

const TailwindContext = createContext({
  theme: Tailwind.DARK,
  setTheme: (themeMode: Tailwind) => {},
});

export const useTheme = () => useContext(TailwindContext);

export const TailwindProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState(Tailwind.DARK);

  const setThemeMode = (themeMode: Tailwind) => {
    setTheme(themeMode);
  };

  const context = { theme, setTheme };
  return (
    <TailwindContext.Provider value={context}>
      <div className={theme}>{children}</div>
    </TailwindContext.Provider>
  );
};