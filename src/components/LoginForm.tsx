import { Email, Key } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { setCookie } from "cookies-next";

import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useState,
} from "react";

import styles from "../styles/index.module.css";

type Props = {};

function LoginForm({}: Props) {
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });

  const authHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAuth({
      ...auth,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const data = await fetch("localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.ok) {
      setCookie("jwt", JSON.stringify(data));
    } else {
      alert("Incorrect login.");
    }
  };

  return (
    <div className={`${styles.signinbox} flex flex-col`}>
      <h2>Get started!</h2>
      <div>
        <form className="flex-col" onSubmit={onSubmit} method="POST">
          <div className={styles.textbox}>
            <Email />
            <input
              placeholder="Email"
              required
              type="email"
              name="email"
              value={auth.email}
              onChange={authHandler}
            />
          </div>
          <div className={styles.textbox}>
            <Key />
            <input
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              name="password"
              required
              value={auth.password}
              onChange={authHandler}
            />
          </div>
          <div className="flex flex-row flex-align flex-justify-end">
            <p>Stay logged in?</p>
            <Checkbox color="secondary" sx={{ color: "var(--pink)" }} />
          </div>
          <input type="submit" className="button-green p5" />
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
