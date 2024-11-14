import formidable from "formidable";
import { NextApiRequest } from "next";
import fs from "fs";
import { s3Upload } from "./s3";
import { postSchema } from "./validationSchemas";

interface ParsedForm {
  body: formidable.Fields;
  pathName?: string;
}

export const parse = async (req: NextApiRequest): Promise<ParsedForm> => {
  const form = formidable(getFormidableOptions());

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return reject(err.message);
      }

      try {
        validatePostFields(fields);
      } catch (error) {
        console.error("Validation error:", error);
        await cleanUpFile(files.image);
        return reject(new Error(err.message));
      }

      try {
        const pathName = await handleFileUpload(files.image);
        resolve({ body: fields, pathName });
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        reject(uploadError);
      }
    });
  });
};

const getFormidableOptions = (): formidable.Options => ({
  maxFiles: 1,
  keepExtensions: true,
  filename: generateUniqueFilename,
  filter: (part) => !!part.mimetype?.startsWith("image/"),
});

const generateUniqueFilename = (name: string, ext: string): string => {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}${ext}`;
};

const validatePostFields = (fields: formidable.Fields): void => {
  postSchema.parse(fields);
};

const cleanUpFile = async (
  file?: formidable.File | formidable.File[]
): Promise<void> => {
  if (file && !Array.isArray(file)) {
    try {
      await fs.promises.unlink(file.filepath);
    } catch (unlinkError) {
      console.error("Error cleaning up file:", unlinkError);
    }
  }
};

const handleFileUpload = async (
  file?: formidable.File | formidable.File[]
): Promise<string | undefined> => {
  if (!file || Array.isArray(file)) return undefined;

  try {
    const fileStream = fs.createReadStream(file.filepath);
    const s3Path = await s3Upload(file.newFilename, fileStream);
    await cleanUpFile(file);
    return s3Path;
  } catch (error) {
    await cleanUpFile(file);
    console.error("Error during file upload:", error);
    throw new Error("File upload failed");
  }
};
