import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../_config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    try {
      //Get comments by pagination
      prisma.comment.findMany({
        skip: req.body.skip || 0,
        take: 5,
        where: {
          postId: req.body.postId,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          text: true,
          imageUrl: true,
          createdAt: true,
          postId: true,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error retrieving comments.");
    }
  }

  if (req.method == "POST") {
    try {
      prisma.comment.create({
        data: {
          text: req.body.text,
          postId: req.body.postId,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error posting comment.");
    }
  } else return res.status(400);
}
