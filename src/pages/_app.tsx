import "../styles/globals.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../config/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <div className="flex flex-col h-min">
          <Header />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </Layout>
  );
}

export default MyApp;
