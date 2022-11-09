import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/_config";

interface Data {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { postId } = req.query;
    try {
      const likeCount = await prisma.post.findUnique({
        where: {
          id: postId as string,
        },
        select: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      });
      return res.send({ likeCount: likeCount?._count.likes });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error.");
    }
  } else {
    return res.status(400).send("Invalid request method.");
  }
}
