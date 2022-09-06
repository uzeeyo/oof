import React from "react";
import type IPost from "../../types/IPost";
import { GetServerSideProps } from "next";

import Secret from "../../components/Secret";
import Navigation from "../../components/Navigation";
import style from "../../styles/Post.module.css";
import Tags from "../../components/Tags";
import Meta from "../../components/Meta";

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
        <div className={`flex flex-row`}>
          <div className={`flex flex-col flex-grow flex-align flex-gap p20`}>
            {posts.map((post) => (
              <Secret secret={post} />
            ))}
          </div>

          <div className={`${style.nav}`}>
            <Navigation />
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("...");
  const posts = [
    {
      postID: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis lacinia sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed imperdiet tempor velit sit amet molestie. Suspendisse tincidunt varius purus, vitae ultricies enim rutrum sed. Phasellus posuere id sapien in tempus. ",
    },
    {
      postID: 2,
      text: "Praesent efficitur dui a commodo sollicitudin. Cras lacinia iaculis augue a tempor. Curabitur in porta libero. Donec pulvinar turpis ut libero ultricies, faucibus egestas sem cursus. Suspendisse lacinia elit dui, in feugiat arcu bibendum at. Aliquam volutpat elementum lorem ac aliquam.",
    },
    {
      postID: 3,
      text: "Donec pellentesque fermentum nibh, id semper elit. Nulla facilisis eleifend ligula ac tempor. Aliquam erat volutpat. Morbi interdum a nibh vel porta. Curabitur eget velit elit. ",
    },
  ];

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
      posts,
      tags,
    },
  };
};

export default index;
