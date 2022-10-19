import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../_config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //To get comments by pagination
  if (req.method == "GET") {
    const posts = await prisma.post.findMany({
      skip: req.body.skip || 0,
      take: 10,
      where: {
        archivedAt: null,
      },
      select: {
        id: true,
        text: true,
        imageUrl: true,
        _count: {
          select: {
            likes: true,
          },
        },
        createdAt: true,
      },
    });

    return res.status(200).send(posts);
  }

  //To post a comment
  if (req.method == "POST") {
    const post = req.body;

    try {
      const p = await prisma.post.create({
        data: {
          userId: post.userId,
          text: post.text,
        },
      });
      return res.send("Post added.");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong.");
    }
  } else {
    return res.status(500);
  }
};

export default handler;
