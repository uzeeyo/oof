import React, { useEffect, useState } from "react";
import type IPost from "../../lib/types/IPost";
import { GetServerSideProps } from "next";

import Secret from "../../components/Secret";
import Tags from "../../components/Tags";
import Meta from "../../components/Meta";
import PostBuilder from "../../components/PostBuilder";
import { getPosts } from "../api/posts";
import { verifyLogin } from "../../lib/auth";

type Props = {
  posts: IPost[];
  tags: Array<string>;
  currentTag: string | null;
};

function index({ posts, tags, currentTag }: Props) {
  const [currentPosts, setCurrentPosts] = useState(posts);
  useEffect(() => {
    setCurrentPosts(posts);
  }, [currentTag]);

  function addPost(newPost: IPost) {
    setCurrentPosts([newPost, ...currentPosts]);
  }

  return (
    <>
      <Meta title="oof - Posts" description="Browse the latest posts." />

      <div className="flex flex-col p20">
        <Tags tags={tags} currentTag={currentTag} />
        <PostBuilder addPost={addPost} />
        <div className="grid grid-cols-4">
          <div
            className={`flex flex-col flex-grow flex-align flex-gap p20 col-start-2 col-span-2 max-w-[35rem] m-auto`}
          >
            {currentPosts.map((post) => (
              <Secret secret={post} key={post.id} />
            ))}
          </div>
        </div>
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

  const { tag } = query;
  const verified = verifyLogin({ req, res });

  const posts = await getPosts(
    0,
    tag as string,
    verified.token?.userId || null
  );

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      tags,
      currentTag: tag || null,
    },
  };
};

export default index;
