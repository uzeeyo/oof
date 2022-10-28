import React from "react";
import type IPost from "../../types/IPost";
import { GetServerSideProps } from "next";

import Secret from "../../components/Secret";
import Navigation from "../../components/Navigation";
import style from "../../styles/Post.module.css";
import Tags from "../../components/Tags";
import Meta from "../../components/Meta";
import PostBuilder from "../../components/PostBuilder";
import prisma from "../api/_config";
import { getPosts } from "../api/posts";
import { tagRegex } from "../../lib/tags";

type Props = {
  posts: IPost[];
  tags: Array<string>;
};

function index({ posts, tags }: Props) {
  return (
    <>
      <Meta title="oof - Posts" description="Browse the newest posts." />

      <div className="flex flex-col p20">
        <Tags tags={tags} />
        <PostBuilder />
        <div className="grid grid-cols-4">
          <div
            className={`flex flex-col flex-grow flex-align flex-gap p20 col-start-2 col-span-2 max-w-[35rem] m-auto`}
          >
            {posts.map((post) => (
              <Secret secret={post} />
            ))}
          </div>

          <div className="col-start-4 p-5 max-w-[20rem]">
            <Navigation />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const posts = await getPosts(0);

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

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      tags,
    },
  };
};

export default index;
