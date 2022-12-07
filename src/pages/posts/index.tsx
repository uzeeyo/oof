import { useState } from "react";
import type IPost from "../../lib/types/IPost";
import { GetServerSideProps } from "next";

import Secret from "../../components/Secret";
import Tags from "../../components/Tags";
import Meta from "../../components/Meta";
import PostBuilder from "../../components/PostBuilder";
import { verifyLogin } from "../../lib/auth";
import { useAuth } from "../../lib/AuthProvider";
import { getPosts } from "../api/posts/get";
import { useUpdateEffect } from "react-use";
import PostLayout from "../../components/PostLayout";

type Props = {
  tags: Array<string>;
  currentTag: string | null;
  posts: IPost[];
};

function Index({ tags, currentTag, posts }: Props) {
  const [currentPosts, setCurrentPosts] = useState<IPost[]>(posts);
  const { isLoggedIn } = useAuth();

  useUpdateEffect(() => {
    fetch("/api/posts/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag: currentTag, skip: 0 }),
    })
      .then((res) => res.json())
      .then((data) => setCurrentPosts(data))
      .catch((err) => console.log(err));
  }, [currentTag]);

  function addPost(newPost: IPost) {
    setCurrentPosts([newPost, ...currentPosts]);
  }

  function deletePost(postId: string) {
    setCurrentPosts(currentPosts.filter((p) => p.id !== postId));
  }

  return (
    <>
      <Meta title="oof - Posts" description="Browse the latest posts." />

      <div>
        {/* <Tags tags={tags} currentTag={currentTag} /> */}
        {isLoggedIn && <PostBuilder addPost={addPost} />}

        <PostLayout posts={posts} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const tags = [
    "crazy",
    "fun",
    "happy",
    "guns",
    "music",
    "2022",
    "sex",
    "money",
    "drugs",
    "cars",
    "nature",
    "love",
    "sad",
    "depression",
  ];
  const verified = verifyLogin({ req, res });
  let posts;
  const { tag } = query;

  try {
    if (verified.status === "err") {
      posts = await getPosts(0, (tag as string) || null);
    } else {
      posts = await getPosts(0, (tag as string) || null, verified.token.userId);
    }
  } catch (err) {
    posts = [];
  }

  return {
    props: {
      tags,
      currentTag: tag || null,
      posts,
    },
  };
};

export default Index;
