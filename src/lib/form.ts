import formidable from "formidable";
import { NextApiRequest } from "next";
import fs from "fs";
import { s3Upload } from "./s3";
import { postSchema } from "./validationSchemas";

export const parse = async (
  req: NextApiRequest
): Promise<{
  body: formidable.Fields;
  pathName?: string;
}> => {
  let filename = "";
  const options: formidable.Options = {
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
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);

      //Checks post text first to see if it confirms. If not, media is not saved
      try {
        postSchema.parse(fields);
      } catch {
        if (!Array.isArray(files.image) && files.image) {
          fs.unlink(files.image.filepath, () => {});
        }
        return reject();
      }

      if (!Array.isArray(files.image) && files.image) {
        const s3Path = await s3Upload(
          files.image.newFilename,
          fs.createReadStream(files.image.filepath)
        );
        fs.unlink(files.image.filepath, () => {});

        resolve({
          body: fields,
          pathName: s3Path,
        });
      }

      resolve({
        body: fields,
        pathName: undefined,
      });
    });
  });
};
