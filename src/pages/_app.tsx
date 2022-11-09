import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Layout from "../components/Layout";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../config/theme";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <div className="flex flex-col h-max relative w-screen bg-[#030D02]">
          <Header />
          <div className="ml-32 mr-32 bg-black bg-opacity-70">
            <Component {...pageProps} />
          </div>
        </div>
      </ThemeProvider>
    </Layout>
  );
}

export default MyApp;
