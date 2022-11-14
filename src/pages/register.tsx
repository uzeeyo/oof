import { Email, Key, Person } from "@mui/icons-material";
import { Button } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, FormEventHandler, useState } from "react";

interface Props {}

const Register: NextPage<Props> = ({}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorHidden, setErrorHidden] = useState(true);
  const [internalErrorHidden, setInternalErrorHidden] = useState(true);

  const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
    if (!errorHidden) setErrorHidden(true);
    if (!internalErrorHidden) setInternalErrorHidden(true);
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.ok) {
        router.push("/posts");
      } else if (res.status === 409) {
        setErrorHidden(false);
      } else {
        setInternalErrorHidden(false);
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto my-20 px-10 md:px-20 border border-[color:var(--green)] rounded-xl">
        <form className="flex flex-col my-10" onSubmit={onFormSubmit}>
          <h1 className="text-2xl mx-auto mb-3">Registration</h1>
          <div className="flex border-2 border-slate-400 rounded-3xl p-1 mb-3">
            <Person htmlColor="#FFF" className="ml-1" />
            <input
              placeholder="Username"
              required
              type="text"
              autoComplete="username"
              name="username"
              minLength={4}
              value={formData.username}
              onChange={onFormChange}
              className="bg-transparent mr-3 ml-2 focus:outline-none border-b-2 border-transparent focus:border-[color:var(--pink)] text-white w-full"
            />
          </div>
          <div className="flex border-2 border-slate-400 rounded-3xl p-1 mb-3">
            <Key htmlColor="#FFF" className="ml-1" />
            <input
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              name="password"
              minLength={6}
              required
              value={formData.password}
              onChange={onFormChange}
              className="bg-transparent mr-3 ml-2 focus:outline-none border-b-2 border-transparent focus:border-[color:var(--pink)] text-white w-full"
            />
          </div>
          <div className="flex border-2 border-slate-400 rounded-3xl p-1 mb-3">
            <Email htmlColor="#FFF" className="ml-1" />
            <input
              placeholder="Email"
              required
              type="email"
              autoComplete="email"
              name="email"
              value={formData.email}
              onChange={onFormChange}
              className="bg-transparent mr-3 ml-2 focus:outline-none border-b-2 border-transparent focus:border-[color:var(--pink)] text-white w-full"
            />
          </div>

          <p hidden={internalErrorHidden} className="text-red-600 mx-auto">
            Internal error.
          </p>

          <p hidden={errorHidden} className="text-red-600 mx-auto">
            User already exists.
          </p>

          <div className="mx-auto">
            <Button
              className="mt-2"
              variant="outlined"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
