import { GetServerSideProps } from "next";
import React from "react";
import { Chip } from "@mui/material";

import style from "../styles/Tags.module.css";

type Props = {
  tags: Array<string>;
};

function Tags({ tags }: Props) {
  return (
    <div className={`flex flex-row ${style.tagbar} flex-align`}>
      {tags.map((tag) => (
        <Chip
          label={`#${tag}`}
          color="secondary"
          variant="outlined"
          onClick={e => console.log(e)}
        />
      ))}
    </div>
  );
}

export default Tags;
