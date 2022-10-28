import type { GetServerSideProps } from "next";
import { verifyToken } from "../lib/auth";

import { getCookie } from "cookies-next";
import LoginForm from "../components/LoginForm";

type Props = {};

const Home = () => {
  return (
    <div className="flex flex-row-reverse flex-auto">
      <div className="w-96">
        <LoginForm />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getCookie("access-token", { req, res });
  if (!token) return { props: {} };
  const loggedIn = verifyToken(token?.valueOf().toString()!);
  if (loggedIn) {
    return {
      redirect: {
        destination: "/posts",
      },
      props: {},
    };
  } else {
    return {
      props: {},
    };
  }
};

export default Home;
