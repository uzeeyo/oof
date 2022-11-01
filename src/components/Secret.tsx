import React, { useState, MouseEvent } from "react";
import style from "../styles/Secret.module.css";
import {
  Checkbox,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material/";
import {
  Favorite,
  FavoriteBorder,
  Comment,
  CommentOutlined,
  BookmarkBorder,
  Bookmark,
  Share,
  MoreHoriz,
} from "@mui/icons-material/";
import Link from "next/link";
import { Post } from "@prisma/client";

type Props = {
  secret: Post;
  key: string;
};

const Secret = ({ secret, key }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
      className={`${style.secret} flex flex-col rounded-md border border-green-400 w-96`}
      key={key}
    >
      <div className="ml-auto m-2">
        <a onClick={handleClick} className="cursor-pointer">
          <MoreHoriz />
        </a>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem>Report</MenuItem>
      </Menu>

      {secret.imageUrl && <img className="mb-2" src={secret.imageUrl} />}
      <div className="secret-text text-wrap flex-grow pl-4 pr-4 pb-2">
        <div className={`${style.postlink} text-xl text-slate-800`}>
          {formatted}
        </div>
      </div>
      <Divider />

      <div className="flex">
        <div
          className={`${style["secret-menu"]} flex flex-row bot mt-auto items-center w-full`}
        >
          <Checkbox
            color="default"
            icon={<CommentOutlined />}
            checkedIcon={<Comment />}
            className={style["secret-menu-item"]}
          />

          <Link
            href={{ pathname: "/posts/[postId]", query: { postId: secret.id } }}
          >
            <IconButton>
              <Share color="inherit" className={style["secret-menu-item"]} />
            </IconButton>
          </Link>

          <Checkbox
            color="default"
            icon={<BookmarkBorder />}
            checkedIcon={<Bookmark />}
            className={style["secret-menu-item"]}
          />

          <label htmlFor="postLikes" className="ml-auto text-gray-800 text-lg">
            1.4k
          </label>
          <Checkbox
            id="postLikes"
            color="secondary"
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            className={`${style["secret-menu-item"]}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Secret;
