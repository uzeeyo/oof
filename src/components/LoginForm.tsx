import { Person, Key } from "@mui/icons-material";
import { Button, Checkbox } from "@mui/material";
import { useRouter } from "next/router";

import React, { ChangeEvent, FormEventHandler, useState } from "react";
import { useAuth } from "../lib/AuthProvider";

import styles from "../styles/index.module.css";

type Props = {};

function LoginForm({}: Props) {
  const [auth, setAuth] = useState({
    username: "",
    password: "",
  });
  const { logIn, loginError } = useAuth();
  const authHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAuth({
      ...auth,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await logIn(auth);
  };

  return (
    <div
      className={`${styles.signinbox} flex flex-col pt-10 pl-20 pr-20 flex-1`}
    >
      <h1 className="text-xl mb-4">Get started!</h1>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <div className="flex border-2 border-slate-400 rounded-3xl p-1 mb-2">
          <Person htmlColor="#FFF" className="ml-1" />
          <input
            placeholder="Username"
            required
            type="text"
            autoComplete="username"
            name="username"
            value={auth.username}
            onChange={authHandler}
            className="bg-transparent mr-3 ml-2 focus:outline-none border-b-2 border-transparent focus:border-[color:var(--pink)] text-white"
          />
        </div>

        <div className="flex border-2 border-slate-400 rounded-3xl p-1">
          <Key htmlColor="#FFF" className="ml-1" />
          <input
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            name="password"
            required
            value={auth.password}
            onChange={authHandler}
            className="bg-transparent mr-3 ml-2 focus:outline-none border-b-2 border-transparent focus:border-[color:var(--pink)] text-white"
          />
        </div>
        <div className="flex flex-row items-center flex-justify-end my-2">
          <p>Stay logged in?</p>
          <Checkbox color="secondary" sx={{ color: "var(--pink)" }} />
        </div>
        <div className="mx-auto">
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className="mr-2"
          >
            Sign In
          </Button>
          <Button variant="outlined" color="secondary" href="/register">
            Register
          </Button>
        </div>
        {loginError && (
          <b className="text-red-600 mt-2">Username or password incorrect.</b>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
