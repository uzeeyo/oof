import React, { useState } from "react";
import style from "../styles/Secret.module.css";
import { IconButton, Checkbox } from "@mui/material/";
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
    <div className={`${style.secret} flex flex-col shadow`}>
      <div className={style.strip} />
      <div className="secret-text text-wrap">
        <p className="text-xl"> {secret.text}</p>
      </div>

      <div className={`${style["secret-menu"]} flex flex-row bot`}>
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
  );
};

export default Secret;
