import type { GetServerSideProps } from "next";
import { verifyLogin } from "../lib/auth";

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
  const loggedIn = verifyLogin({ req, res });
  if (loggedIn.status === "ok") {
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
