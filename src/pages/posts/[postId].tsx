import { Post } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Secret from "../../components/Secret";
import prisma from "../api/_config";

interface Props {
  post: Post;
}

export default function ({ post }: Props) {
  return (
    <div className="mr-auto ml-auto">
      <div className="mt-20">
        <Secret secret={post} key={post.id} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.params!.postId;

  const post = await prisma.post.findFirst({
    where: {
      id: postId as string,
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  }

  return {
    notFound: true,
  };
};
