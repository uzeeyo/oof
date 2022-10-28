import React, { useState } from "react";
import style from "../styles/Secret.module.css";
import { Checkbox } from "@mui/material/";
import {
  Favorite,
  FavoriteBorder,
  Comment,
  CommentOutlined,
} from "@mui/icons-material/";
import IPost from "../types/IPost";

type Props = {
  secret: IPost;
};

const Secret = ({ secret }: Props) => {
  return (
    <div
      className={`${style.secret} flex flex-col rounded-md p-2 border border-green-400 w-96 divide-solid divide-green-400 divide-y`}
    >
      <div className="secret-text text-wrap flex-grow p-4 pb-2">
        <p
          className={`${style.postlink} text-xl text-slate-800`}
          dangerouslySetInnerHTML={{ __html: secret.text }}
        />
      </div>

      <div className="flex">
        <div
          className={`${style["secret-menu"]} flex flex-row bot mt-auto ml-auto`}
        >
          <Checkbox
            color="secondary"
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            className={style["secret-menu-item"]}
          />
          <Checkbox
            color="secondary"
            icon={<CommentOutlined />}
            checkedIcon={<Comment />}
            className={style["secret-menu-item"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Secret;
