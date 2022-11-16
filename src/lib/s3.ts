import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { ReadStream } from "fs";
import moment from "moment";

const region = "us-east-1";
const s3BucketUrl = process.env.S3_BASE_URL

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export const s3Upload = async (filename: string, file: ReadStream): Promise<string> => {
  const path = moment().format("YYYYMMDD") + "/" + filename;
  const params: PutObjectCommandInput = {
    Bucket: "oof-db",
    Key: path,
    Body: file,
  };

  return new Promise((resolve, reject) => {
  s3.send(new PutObjectCommand(params), (err, data) => {
    if (err) reject(err)

    resolve(s3BucketUrl + path)
  });

  })
};
