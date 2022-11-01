import React, { useEffect, useState } from "react";
import type IPost from "../../types/IPost";
import { GetServerSideProps } from "next";

import Secret from "../../components/Secret";
import Navigation from "../../components/Navigation";
import Tags from "../../components/Tags";
import Meta from "../../components/Meta";
import PostBuilder from "../../components/PostBuilder";
import { getPosts } from "../api/posts";
import prisma from "../api/_config";
import { Post } from "@prisma/client";

type Props = {
  posts: Post[];
  tags: Array<string>;
  currentTag: string | null;
};

function index({ posts, tags, currentTag }: Props) {
  const [currentPosts, setCurrentPosts] = useState(posts);
  useEffect(() => {
    setCurrentPosts(posts);
  }, [currentTag]);

  function addPost(newPost: Post) {
    setCurrentPosts([newPost, ...currentPosts]);
  }

  console.log(posts);

  return (
    <>
      <Meta title="oof - Posts" description="Browse the newest posts." />

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

export const getServerSideProps: GetServerSideProps = async (context) => {
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

  const { tag } = context.query;

  const posts = await getPosts(0, (tag as string) || null);

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      tags,
      currentTag: tag || null,
    },
  };
};

export default index;
