import { Close, Image, Videocam } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
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

const PostBuilder = ({ addPost }: Props) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);

  const onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
    if (errorVisible) setErrorVisible(false);
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
    setLoadingVisible(true);

    const formData = new FormData();
    formData.append("text", text);
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("/api/posts/create", {
      method: "POST",
      body: formData,
    });
    setLoadingVisible(false);

    if (res.ok) {
      setText("");
      setImage(undefined);
      addPost(await res.json());
    } else {
      setErrorVisible(true);
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
            className="resize-none p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-transparent dark:text-slate-100"
            value={text}
            onChange={onTextChange}
          />
          <div className="flex flex-row mt-2 mr-2 md:mr-4 justify-end items-center w-full">
            {errorVisible && (
              <b className="text-red-500 text mr-2 md:mr-4">Error</b>
            )}
            {loadingVisible && (
              <CircularProgress className="mr-2 md:mr-4 p-2" />
            )}
            <input
              type="file"
              accept="image/*"
              hidden={true}
              id="image_upload"
              onChange={onSelectedImageChange}
            />
            <label
              htmlFor="image_upload"
              className="cursor-pointer mr-2 md:mr-4"
            >
              <Image className="h-7 w-7" color="secondary" />
            </label>

            <Button variant="outlined" type="submit">
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostBuilder;
