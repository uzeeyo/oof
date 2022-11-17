import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Layout from "../components/Layout";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../config/theme";
import { AuthProvider} from "../lib/AuthProvider"

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <ThemeProvider theme={theme}>
          <div className="flex flex-col min-h-screen relative bg-[#010902]">
            <Header />
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
