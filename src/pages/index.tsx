import type { NextPage } from "next";
import Head from "next/head";
import { Email, Key } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import styles from "../styles/index.module.css";

const Home: NextPage = () => {
  return (
    <div className={`flex items-stretch h100`}>
      <div className="p20 flex-grow">fdsgds</div>

      <div className={`${styles.signinbox} flex-col`}>
        <h2>Get started!</h2>
        <div>
          <form className="flex-col">
            <div className={styles.textbox}>
              <Email />
              <input placeholder="Email" required id="email" type="email" />
            </div>
            <div className={styles.textbox}>
              <Key />
              <input placeholder="Password" type="password" />
            </div>
            <div className="flex-row flex-align flex-justify-end">
              <p>Stay logged in?</p>
              <Checkbox color="secondary" sx={{ color: "var(--pink)" }} />
            </div>
            <button type="submit" className="button-green p5">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
