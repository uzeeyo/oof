import React, {
  useState,
  MouseEvent,
  ChangeEvent,
  FormEventHandler,
  useEffect,
} from "react";
import style from "../styles/Secret.module.css";
import { Checkbox, Divider, Menu, MenuItem } from "@mui/material/";
import {
  Favorite,
  FavoriteBorder,
  Comment,
  CommentOutlined,
  BookmarkBorder,
  Bookmark,
  MoreHoriz,
  Send,
} from "@mui/icons-material/";
import Link from "next/link";
import IPost from "../lib/types/IPost";
import { Comment as PostComment } from "@prisma/client";
import { useRouter } from "next/dist/client/router";
import moment from "moment";

type Props = {
  secret: IPost;
  deletePost?: Function;
};

const Secret = ({ secret, deletePost }: Props) => {
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
    const req = { postId: secret.id, liked: e.target.checked };
    const res = await fetch("http://localhost:3000/api/posts/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });
    if (res.ok) {
      if (res.status === 201 && Number(likeCount) < 999)
        setLikeCount((Number(likeCount) + 1).toString());
      if (res.status === 200 && Number(likeCount) < 999)
        setLikeCount((Number(likeCount) - 1).toString());
    }
  };

  //FOR: Delete button
  const handleDeletePost = async () => {
    const res = await fetch(
      `http://localhost:3000/api/posts/${secret.id}/delete`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      if (deletePost) {
        deletePost(secret.id);
      } else {
        const router = useRouter();
        router.push("/posts");
      }
    } else {
      alert("Post not deleted.");
    }
  };

  //FOR: Comments
  const [inputOpen, inputClosed] = [
    "border pb-1 pt-1 max-h-[50px]",
    "border-0 pb-0 pt-0 max-h-0",
  ];
  const [newComment, setNewComment] = useState("");
  const [commentVisibility, setCommentVisibility] = useState(false);
  const [commentMode, setCommentMode] = useState("comments-closed");
  const [inputStyle, setInputBorder] = useState(inputClosed);
  const [commentPage, setCommentPage] = useState<number>(1);

  const [comments, setComments] = useState<
    { comments: PostComment[]; additional: boolean } | undefined
  >(undefined);

  const onCommentsVisibilityChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setCommentVisibility(!commentVisibility);

    setCommentMode(
      commentMode == "comments-closed" ? "comments-open" : "comments-closed"
    );
    setInputBorder(inputStyle === inputClosed ? inputOpen : inputClosed);
  };

  const loadMoreComments = () => {
    fetch(`/api/posts/${secret.id}/get-comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skip: commentPage * 5 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments({
          comments: [...data.comments, ...comments!.comments],
          additional: data.additional,
        });
      })
      .catch((err) => console.error(err));
    setCommentPage(commentPage + 1);
  };

  useEffect(() => {
    if (commentVisibility) {
      fetch(`/api/posts/${secret.id}/get-comments`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.comments.length > 0)
            setComments({
              comments: data.comments,
              additional: data.additional,
            });
        });
    } else {
      setComments(undefined);
    }
    setCommentPage(1);
  }, [commentVisibility]);

  const onCommentSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    fetch(`/api/posts/${secret.id}/post-comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setComments({
          comments: [...(comments?.comments || []), data],
          additional: comments?.additional || false,
        });
        setNewComment("");
      })
      .catch((err) => {
        console.error(err);
        //DO: SHOW ERROR
      });
  };
  //END: Comments

  const onCommentTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.currentTarget.value);
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
      className={`${style.secret} flex flex-col rounded-md border border-green-400 w-96`}
    >
      <div className="flex flex-row m-2">
        <p className="text-slate-200 text-sm ml-1 mt-1">{"> " + secret.id}</p>
        <div className="ml-auto">
          <a onClick={handleClick} className="cursor-pointer">
            <MoreHoriz color="inherit" />
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

      <div className="flex">
        <div
          className={`${style["secret-menu"]} flex flex-row bot mt-auto items-center w-full`}
        >
          <Checkbox
            color="default"
            icon={<CommentOutlined htmlColor="#BBB" />}
            checkedIcon={<Comment color="primary" />}
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
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            className={`${style["secret-menu-item"]}`}
            checked={liked}
            onChange={onLikeChange}
          />
        </div>
      </div>

      {comments && (
        <div id="comments" className="flex flex-col pl-2 pr-2">
          {comments.comments.map((comment) => {
            return (
              <div className="flex flex-col" key={comment.id}>
                <Divider className="bg-slate-300 bg-opacity-30" />
                <div className="flex flex-row pl-3 mt-2">
                  <p className="text-xs text-slate-400">{comment.id}</p>
                  <p className="ml-auto text-xs text-slate-400 select-none">
                    {moment(comment.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
                <div className="flex flex-row pl-3 mt-1 mb-2 text-slate-200">
                  {comment.text}
                </div>
              </div>
            );
          })}
          {comments.additional && (
            <a
              className="text-pink-500 cursor-pointer hover:underline text-xs ml-3"
              onClick={loadMoreComments}
            >
              Load previous comments...
            </a>
          )}
        </div>
      )}

      <div
        className={`flex flex-row w-full ${style[commentMode]} ${style["comments"]}`}
      >
        <div className={`flex flex-row p-2 w-full`}>
          <form className={`flex flex-row w-full items-center`}>
            <input
              type="text"
              className={
                `border-gray-400 rounded-2xl focus:outline-none w-full pl-3 pr-3 ml-2 ${style["input-anim"]} bg-transparent text-slate-100 ` +
                inputStyle
              }
              placeholder="Comment"
              value={newComment}
              onChange={onCommentTextChange}
            />
            <button
              type="submit"
              className="ml-3 mr-2"
              onClick={onCommentSubmit}
            >
              <Send
                color="primary"
                className={`${style[commentMode]} ${style["button-anim"]}`}
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Secret;
