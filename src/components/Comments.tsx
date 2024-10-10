import { ChangeEvent, FormEventHandler, useEffect, useState } from "react";
import { Comment as PostComment } from "@prisma/client";
import { Divider } from "@mui/material";
import moment from "moment";
import { Close, Send } from "@mui/icons-material";
import { useUpdateEffect } from "react-use";
import { useAuth } from "../lib/AuthProvider";

type Props = {
  postID: string;
  visibility: boolean;
  userReply: string | null;
  setUserReply: Function;
};

const Comments = ({ postID, visibility, userReply, setUserReply }: Props) => {
  const { isLoggedIn } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [commentPage, setCommentPage] = useState<number>(1);
  const [commentVisibility, setCommentVisibility] = useState(visibility);
  const [comments, setComments] = useState<
    { comments: PostComment[]; additional: boolean } | undefined
  >(undefined);

  useUpdateEffect(() => {
    setCommentVisibility(!commentVisibility);
  }, [visibility]);

  const loadMoreComments = () => {
    fetch(`/api/posts/${postID}/get-comments`, {
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
      fetch(`/api/posts/${postID}/get-comments`, {
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
    fetch(`/api/posts/${postID}/post-comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newComment }),
    })
      .then((res) => res.json())
      .then((data) => {
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

  const onCommentTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.currentTarget.value);
  };

  return (
    <>
      {comments && (
        <div id="comments" className="flex flex-col pl-2 pr-2">
          {comments.comments.map((comment) => {
            return (
              <div className="flex flex-col" key={comment.id}>
                <Divider className="bg-slate-300 bg-opacity-30" />
                <div className="flex flex-row pl-3 mt-2 text-slate-600">
                  <a
                    className="text-xs cursor-pointer"
                    onClick={() => setUserReply(comment.id)}
                  >
                    {comment.id}
                  </a>
                  <p className="ml-auto text-xs select-none">
                    {moment(comment.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
                <div className="pl-3 mt-1 mb-2">{comment.text}</div>
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

      {isLoggedIn && (
        <form className={`flex flex-row w-full items-center mb-3 mt-1`}>
          <div className="flex flex-col border border-gray-400 rounded-2xl mx-3 w-full overflow-hidden">
            {userReply && (
              <>
                <div className="flex flex-row py-1 px-3 text-sm justify-center">
                  {"@" + userReply}
                  <Close
                    className="ml-auto h-5 w-5 text-zinc-700 hover:text-green-500 cursor-pointer"
                    onClick={() => setUserReply(null)}
                  />
                </div>
                <Divider variant="middle" />
              </>
            )}
            <input
              type="text"
              className={`focus:outline-none px-3 py-1 bg-transparent `}
              placeholder="Comment"
              value={newComment}
              onChange={onCommentTextChange}
            />
          </div>
          <button type="submit" className="mr-2" onClick={onCommentSubmit}>
            <Send color="primary" />
          </button>
        </form>
      )}
    </>
  );
};

export default Comments;
