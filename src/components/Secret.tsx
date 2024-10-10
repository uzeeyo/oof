import React, { useState, MouseEvent, ChangeEvent } from "react";
import style from "../styles/Secret.module.css";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material/";
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
import { useAuth } from "../lib/AuthProvider";

type Props = {
  secret: IPost;
  deletePost?: Function;
};

const Secret = ({ secret, deletePost }: Props) => {
  const router = useRouter();
  const { isLoggedIn, clearAuth } = useAuth();

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
    const res = await fetch(`/api/posts/${secret.id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ liked: e.target.checked }),
    });

    if (res.status === 401 || res.status === 403) {
      clearAuth();
      return;
    }

    if (res.ok) {
      if (res.status === 201 && Number(likeCount) < 999)
        setLikeCount((Number(likeCount) + 1).toString());
      if (res.status === 200 && Number(likeCount) < 999)
        setLikeCount((Number(likeCount) - 1).toString());
    } else {
      setLiked(!e.target.checked);
    }
  };

  //FOR: Report button
  const [reportText, setReportText] = useState("");
  const handleReport = async () => {
    fetch(`/api/${secret.id}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: reportText }),
    }).then((res) => {
      if (res.status === 401 || res.status === 403) {
        clearAuth();
        return;
      }

      if (res.ok) {
      }
    });
  };

  //FOR: Delete button
  const handleDeletePost = async () => {
    const res = await fetch(`/api/posts/${secret.id}/delete`, {
      method: "DELETE",
    });

    if (res.status === 401 || res.status === 403) {
      clearAuth();
      return;
    }

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
  const [userReply, setUserReply] = useState<string | null>(null);
  const onCommentsVisibilityChange = async () => {
    setCommentVisibility(!commentVisibility);
    if (!commentVisibility) setUserReply(null);
  };

  const addReply = () => {
    if (!commentVisibility) {
      setCommentVisibility(true);
    }
    setUserReply(secret.id);
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

  //FOR: Report
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  return (
    <div
      className={`${style.secret} flex flex-col rounded-md border border-zinc-500 dark:border-zinc-700 w-80 md:w-96 dark:text-slate-200 dark:bg-[#0b0b0b] `}
    >
      <div className="flex flex-row m-2">
        <div className="flex flex-col">
          <a onClick={addReply} className="text-sm ml-1 mt-1 cursor-pointer">
            {">" + secret.id}
          </a>
          <p className="text-xs ml-2 text-slate-600 dark:text-slate-400 select-none">
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
          {<CircularProgress color="error" size={15} className="ml-3" />}
        </MenuItem>
        <MenuItem>Share...</MenuItem>
        <MenuItem onClick={() => setReportDialogOpen(true)}>Report</MenuItem>
      </Menu>

      <Dialog
        className="bg-slate-500"
        open={reportDialogOpen}
        onClose={() => {
          setReportDialogOpen(false);
        }}
      >
        <DialogTitle>Report</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Please include why you think this content is against the rules in
            the text below.
          </DialogContentText>
          <TextField multiline rows={3} maxRows={5} className="w-full mt-4" />
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {secret.imageUrl && (
        <img
          className="mb-2 select-none pointer-events-none"
          src={secret.imageUrl}
          draggable={false}
        />
      )}
      <div className="secret-text text-wrap flex-grow pl-4 pr-4 pb-2">
        <div className={`${style.postlink} text-xl dark:text-slate-100`}>
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
          disabled={isLoggedIn ? false : true}
        />

        <label htmlFor="postLikes" className="ml-auto text-lg select-none">
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
          disabled={!isLoggedIn}
        />
      </div>

      {commentVisibility && (
        <Comments
          postID={secret.id}
          visibility={commentVisibility}
          userReply={userReply}
          setUserReply={setUserReply}
        />
      )}
    </div>
  );
};

export default Secret;
