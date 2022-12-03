import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Layout from "../components/Layout";

import { AuthProvider } from "../lib/AuthProvider";
import { ThemeProvider } from "../lib/TailwindProvider";

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Layout>
          <div className="flex flex-col min-h-screen relative bg-slate-100 dark:bg-[#121212]">
            <Header />
            <Component {...pageProps} />
          </div>
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
