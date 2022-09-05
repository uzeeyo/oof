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
      <div className="content flex-col">
        <ThemeProvider theme={theme}>
          <div className="h100 flex-col">
            <Header />
            <div className="flex-fill">
              <Component {...pageProps} />

            </div>
          </div>
        </ThemeProvider>
      </div>
    </Layout>
  );
}

export default MyApp;
