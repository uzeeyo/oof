import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/_config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    try {
      const comment = await prisma.comment.create({
        data: {
          text: req.body.text,
          postId: req.query.postId as string,
        },
      });
      return res.status(201).send(comment);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error posting comment.");
    }
  } else return res.status(400);
}
