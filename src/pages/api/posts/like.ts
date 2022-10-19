import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../_config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    try {
      if (req.body.liked == true) {
        prisma.like.create({
          data: {
            userId: req.body.userId,
            postId: req.body.postId,
          },
        });
        return res.status(201).send("Post liked");
      } else {
        prisma.like.deleteMany({
          where: {
            userId: req.body.userId,
            postId: req.body.postId,
          },
        });
        return res.status(201).send("Post unliked");
      }
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  }
}
