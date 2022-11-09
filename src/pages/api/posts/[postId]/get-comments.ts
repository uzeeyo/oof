import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/_config";

interface Data {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    try {
      //Get comments by pagination
      const comments = await prisma.comment.findMany({
        skip: req.body.skip || 0,
        take: 6,
        where: {
          postId: req.query.postId as string,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          text: true,
          imageUrl: true,
          createdAt: true,
          postId: true,
        },
      });
      const c = comments.sort((a, b) => {
        return a.createdAt.valueOf() - b.createdAt.valueOf();
      });
      const additional = c.length > 5;
      return res.send({
        comments: c.length === 6 ? c.slice(1, 6) : c,
        additional,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error retrieving comments.");
    }
  } else return res.status(400).send("Invalid request method");
}
