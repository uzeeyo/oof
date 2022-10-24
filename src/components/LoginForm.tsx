import { Person, Key } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { useRouter } from "next/router";

import React, { ChangeEvent, FormEventHandler, useState } from "react";

import styles from "../styles/index.module.css";

type Props = {};

function LoginForm({}: Props) {
  const [auth, setAuth] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();

  const authHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAuth({
      ...auth,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const data = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(auth),
    });
    if (data.ok) {
      router.push("/posts");
    } else {
      alert("Username or password is incorrect.");
    }
  };

  return (
    <div className={`${styles.signinbox} flex flex-col`}>
      <h2>Get started!</h2>
      <div>
        <form className="flex-col" onSubmit={onSubmit} method="POST">
          <div className={styles.textbox}>
            <Person />
            <input
              placeholder="Username"
              required
              type="text"
              autoComplete="username"
              name="username"
              value={auth.username}
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
