import { Close, Image, Videocam } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";

type Props = {
  addPost: Function;
};

export default function ({ addPost }: Props) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [errHidden, setErrHidden] = useState(true);

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
    if (!errHidden) setErrHidden(true);
  };

  //FOR: Image upload
  const onSelectedImageChange = (e: FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      setImage(e.currentTarget.files[0]);
    }
  };

  useEffect(() => {
    image ? setImageUrl(URL.createObjectURL(image)) : setImageUrl("");
  }, [image]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setText("");
      setImage(undefined);
      addPost(await res.json());
    } else {
      setErrHidden(false);
    }
  };

  return (
    <div className="flex justify-center mt-5">
      <form style={{ width: "40rem" }} onSubmit={onSubmit}>
        <div className=" p-2 md:p-3 border-gray-400 border-2 rounded-lg flex flex-col items-center">
          {image && (
            <div className="relative mb-5">
              <Close
                className="absolute top-2 right-2 cursor-pointer rounded-full bg-white bg-opacity-30 p-1 hover:bg-green-500 hover:text-white"
                color="primary"
                onClick={() => setImage(undefined)}
              />
              <img src={imageUrl} className="h-[400px]" />
            </div>
          )}
          <textarea
            rows={3}
            maxLength={400}
            className="resize-none p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-transparent text-slate-100"
            value={text}
            onChange={onTextChange}
          />
          <div className="flex flex-row mt-2 items-center w-full">
            <input
              type="file"
              accept="image/*"
              hidden={true}
              id="image_upload"
              onChange={onSelectedImageChange}
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

            <div className="ml-auto mr-2 md:mr-4 flex flex-row items-center">
              <p className="text-red-500 text mr-2" hidden={errHidden}>
                <b>Error</b>
              </p>
              <Button variant="outlined" type="submit">
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
