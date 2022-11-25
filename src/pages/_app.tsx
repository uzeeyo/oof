import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Layout from "../components/Layout";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../config/theme";
import { AuthProvider } from "../lib/AuthProvider";
import { TailwindProvider } from "../lib/TailwindProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <ThemeProvider theme={theme}>
          <TailwindProvider>
            <div className="flex flex-col min-h-screen relative bg-slate-100 dark:bg-gray-900">
              <Header />
              <Component {...pageProps} />
            </div>
          </TailwindProvider>
        </ThemeProvider>
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
