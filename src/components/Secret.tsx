import React, { useState, MouseEvent, ChangeEvent } from "react";
import style from "../styles/Secret.module.css";
import { Checkbox, Menu, MenuItem } from "@mui/material/";
import {
  Favorite,
  FavoriteBorder,
  CommentOutlined,
  BookmarkBorder,
  Bookmark,
  MoreHoriz,
} from "@mui/icons-material/";
import Link from "next/link";
import IPost from "../lib/types/IPost";
import { useRouter } from "next/dist/client/router";
import moment from "moment";
import Comments from "./Comments";
import { useUpdateEffect } from "react-use";

type Props = {
  secret: IPost;
  deletePost?: Function;
};

const Secret = ({ secret, deletePost }: Props) => {
  const router = useRouter();

  //FOR: Post menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //FOR: Like button
  const [liked, setLiked] = useState(secret.liked);
  const [likeCount, setLikeCount] = useState(secret.likeCount);

  const onLikeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLiked(e.target.checked);
  };

  useUpdateEffect(() => {
    fetch(`/api/posts/${secret.id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ liked }),
    }).then((res) => {
      if (res.ok) {
        if (res.status === 201 && Number(likeCount) < 999)
          setLikeCount((Number(likeCount) + 1).toString());
        if (res.status === 200 && Number(likeCount) < 999)
          setLikeCount((Number(likeCount) - 1).toString());
      }
    });
  }, [liked]);

  //FOR: Delete button
  const handleDeletePost = async () => {
    const res = await fetch(
      `/api/posts/${secret.id}/delete`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      if (deletePost) {
        deletePost(secret.id);
      } else {
        router.push("/posts");
      }
    } else {
      alert("Post not deleted.");
    }
  };

  //FOR: Comments
  const [commentVisibility, setCommentVisibility] = useState(false);
  const onCommentsVisibilityChange = async () => {
    setCommentVisibility(!commentVisibility);
  };

  //FOR: Post text
  const regex = /(#[a-zA-Z0-9_\-]{1,})/g;
  let splittedText = secret.text?.split(/(\s+)/);
  const formatted = new Array<String | JSX.Element>();

  if (splittedText) {
    splittedText.forEach((section) => {
      if (!section.startsWith("#")) formatted.push(section);

      const tags = section.match(regex);

      tags?.forEach((tag) => {
        formatted.push(
          <Link href={{ href: "/posts", query: { tag: tag.slice(1) } }}>
            {tag}
          </Link>
        );

        section = section.slice(tag.length);
        const nextPosition = section.search("#");
        if (nextPosition == -1) {
          formatted.push(section);
        } else {
          formatted.push(section.substring(0, nextPosition));
        }
      });
    });
  }

  return (
    <div
      className={`${style.secret} flex flex-col rounded-md border border-green-400 w-80 md:w-96`}
    >
      <div className="flex flex-row m-2">
        <div className="flex flex-col">
          <p className="text-slate-200 text-sm ml-1 mt-1">{"> " + secret.id}</p>
          <p className="text-xs ml-2 text-slate-400 select-none">
            {moment(secret.createdAt).format("MMM, DD YYYY")}
          </p>
        </div>
        <div className="ml-auto">
          <a onClick={handleClick} className="cursor-pointer">
            <MoreHoriz htmlColor="#BBB" />
          </a>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem className="text-red-600" onClick={handleDeletePost}>
          Delete
        </MenuItem>
        <MenuItem>Share...</MenuItem>
        <MenuItem>Report</MenuItem>
      </Menu>

      {secret.imageUrl && (
        <img
          className="mb-2 select-none pointer-events-none"
          src={secret.imageUrl}
          draggable={false}
        />
      )}
      <div className="secret-text text-wrap flex-grow pl-4 pr-4 pb-2">
        <div className={`${style.postlink} text-xl text-slate-100`}>
          {formatted}
        </div>
      </div>

      <div
        className={`${style["secret-menu"]} flex flex-row bot mt-auto items-center w-full pl-2`}
      >
        <Checkbox
          color="default"
          icon={<CommentOutlined htmlColor="#BBB" />}
          checkedIcon={<CommentOutlined color="primary" />}
          className={style["secret-menu-item"]}
          checked={commentVisibility}
          onChange={onCommentsVisibilityChange}
        />

        <Checkbox
          color="default"
          icon={<BookmarkBorder htmlColor="#BBB" />}
          checkedIcon={<Bookmark color="primary" />}
          className={style["secret-menu-item"]}
        />

        <label
          htmlFor="postLikes"
          className="ml-auto text-gray-200 text-lg select-none"
        >
          {likeCount === "0" ? "" : likeCount}
        </label>
        <Checkbox
          id="postLikes"
          color="secondary"
          icon={<FavoriteBorder htmlColor="#BBB" />}
          checkedIcon={<Favorite />}
          className={`${style["secret-menu-item"]}`}
          checked={liked}
          onChange={onLikeChange}
        />
      </div>

      <Comments postID={secret.id} visibility={commentVisibility} />
    </div>
  );
};

export default Secret;
