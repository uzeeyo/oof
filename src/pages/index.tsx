import type { GetServerSideProps } from "next";
import { verifyLogin } from "../lib/auth";
import LoginForm from "../components/LoginForm";

const Home = () => {
  return (
    <div className="flex flex-col flex-1 ml-auto mr-auto md:mr-0 items-stretch ">
      <LoginForm />
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
