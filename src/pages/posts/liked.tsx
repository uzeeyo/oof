import { GetServerSideProps, NextPage } from "next";
import PostLayout from "../../components/PostLayout";
import Secret from "../../components/Secret";
import { verifyLogin } from "../../lib/auth";
import IPost from "../../lib/types/IPost";
import { getLikedPosts } from "../api/posts/liked";

interface Props {
  posts: IPost[];
}

const Liked: NextPage<Props> = ({ posts }) => {
  return <PostLayout posts={posts} />;
};

export default Liked;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const verified = verifyLogin({ req, res });
  if (verified.errCode) {
    return {
      redirect: {
        destination: "/",
      },
      props: {},
    };
  }

  const posts = (await getLikedPosts(verified.token.userId)) || [];

  return {
    props: {
      posts,
    },
  };
};
