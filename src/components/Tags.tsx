import { MouseEvent } from "react";
import { Chip } from "@mui/material";

import style from "../styles/Tags.module.css";
import { useRouter } from "next/router";

type Props = {
  tags: Array<string>;
  currentTag: string | null;
};

function Tags({ tags, currentTag }: Props) {
  const router = useRouter();
  const onClick = (e: MouseEvent<HTMLElement>) => {
    router.push(`/posts?tag=${e.currentTarget.innerText.slice(1)}`);
  };

  return (
    <div className={`flex flex-row ${style.tagbar} flex-align`}>
      {tags.map((tag) => {
        if (tag == currentTag) {
          return (
            <Chip
              label={`#${tag}`}
              onClick={onClick}
              color="secondary"
              key={tag.slice(1)}
            />
          );
        }
        return (
          <Chip
            label={`#${tag}`}
            color="secondary"
            variant="outlined"
            onClick={onClick}
            key={tag.slice(1)}
          />
        );
      })}
    </div>
  );
}

export default Tags;
