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
          <div className="flex flex-col min-h-screen relative dark:bg-[#121212] text-slate-900 dark:text-slate-200">
            <Header />
            <div className="mt-20">
              <Component {...pageProps} />
            </div>
          </div>
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
