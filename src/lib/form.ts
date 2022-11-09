import formidable from "formidable";
import { NextApiRequest } from "next";
import moment from "moment";
import fs from "fs";
import path from "path";
import { FormatListNumbered } from "@mui/icons-material";

export const parse = async (
  req: NextApiRequest
): Promise<{
  body: formidable.Fields;
  pathName?: string;
}> => {
  const relDirectory = "/media/" + moment().format("YYYYMMDD");
  const imageDirectory = path.join(process.cwd(), "/public", relDirectory);

  try {
    await fs.promises.readdir(imageDirectory);
  } catch (err) {
    await fs.promises.mkdir(imageDirectory);
    console.error(err);
  }

  let filename = "";
  const options: formidable.Options = {
    uploadDir: imageDirectory,
    filename: (name, ext, part, form) => {
      filename =
        Date.now().toString() +
        "-" +
        Math.floor(Math.random() * 100000).toString() +
        ext;
      return filename;
    },
    maxFiles: 1,
    keepExtensions: true,
    filter: (part) => {
      if (!part.mimetype?.match(/(^image\/)/)) return false;
      return true;
    },
  };

  const form = formidable(options);

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      console.log(files);
      resolve({
        body: fields,
        pathName:
          Object.keys(files).length !== 0
            ? relDirectory.concat("/", filename)
            : undefined,
      });
    });
  });
};
