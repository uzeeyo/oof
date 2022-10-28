import { Image, Videocam } from "@mui/icons-material";
import { Button } from "@mui/material";
import Link from "next/link";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  useState,
} from "react";

export default function () {
  const [text, setText] = useState("");

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const req = {
      text: text,
    };
    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      setText("");
    }
  };

  return (
    <div className="flex justify-center p-5 ">
      <form style={{ width: "40rem" }} onSubmit={onSubmit}>
        <div className="p-5 border-gray-400 border-2 rounded-lg flex flex-col">
          <textarea
            rows={3}
            maxLength={400}
            className="resize-none p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            value={text}
            onChange={onTextChange}
          />
          <div className="flex flex-row mt-2 items-center">
            <input
              type="file"
              accept="image/*"
              hidden={true}
              id="image_upload"
            />
            <input
              type="file"
              accept="video/*"
              hidden={true}
              id="video_upload"
            />
            <label htmlFor="image_upload" className="cursor-pointer ml-2 mr-1">
              <Image className="h-7 w-7" color="secondary" />
            </label>
            <label htmlFor="video_upload" className="cursor-pointer mr-1">
              <Videocam className="h-8 w-8" color="secondary" />
            </label>

            <Button variant="outlined" className="ml-auto mr-4" type="submit">
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
