import { GetServerSideProps, NextPage } from "next";
import Secret from "../../components/Secret";
import { verifyLogin } from "../../lib/auth";
import IPost from "../../lib/types/IPost";
import { convertLikes } from "../api/posts";
import prisma from "../../../prisma/_config";

interface Props {
  post: IPost;
}

export default function ({ post }: Props) {
  return (
    <div className="mr-auto ml-auto">
      <div className="mt-20">
        <Secret secret={post} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const postId = context.params!.postId;

  const { req, res } = context;
  const verified = verifyLogin({ req, res });
  const userId = verified.token?.userId;

  const post = await prisma.post.findFirst({
    where: {
      id: postId as string,
    },
    select: {
      id: true,
      text: true,
      imageUrl: true,
      likes: {
        where: {
          userId: userId || "",
        },
        select: {
          liked: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      createdAt: true,
    },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  let filteredPost: any = { ...post };
  delete filteredPost.likes;
  filteredPost.likeCount = convertLikes(filteredPost._count.likes);
  delete filteredPost._count.likes;
  filteredPost.liked = post.likes.length > 0 ? true : false;

  return {
    props: {
      post: JSON.parse(JSON.stringify(filteredPost)),
    },
  };

  return {
    notFound: true,
  };
};
