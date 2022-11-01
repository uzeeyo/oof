import { getCookie } from "cookies-next";
import { verify } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyLogin, verifyToken } from "../../../lib/auth";
import { connectTags, findTags, tagRegex } from "../../../lib/tags";
import prisma from "../_config";
import { createTags } from "../../../lib/tags";
import dp from "dompurify";
import { Post } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //To get comments by pagination
  if (req.method === "GET") {
    const posts = await getPosts(req.body.skip, req.body.tag);
    return res.status(200).send(posts);
  }

  //To post a comment
  if (req.method === "POST") {
    const post = req.body;

    //Check cookie and verify jwt
    const verified = verifyLogin({ req, res });
    if (verified.err) {
      console.log(verified);
      return res.status(verified.err).send(verified);
    }

    try {
      const p = await prisma.post.create({
        data: {
          userId: verified.token.userId,
          text: post.text,
        },
      });

      //Parse tags then make connections
      const tags = findTags(post.text);
      const connections = await createTags(tags);
      await connectTags(connections, p.id);

      return res.status(200).send(p);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong.");
    }
  } else {
    return res.status(500);
  }
};

export async function getPosts(skip: number, tag: string | null) {
  //VERY MESSY, FIND A BETTER WAY
  let posts;
  if (tag) {
      const formattedTag = `#${tag}`;
      posts = await prisma.post.findMany({
        skip: skip || 0,
        take: 10,
        where: {
          archivedAt: null,
          tags: {
            some: {
              tag: {
                name: formattedTag,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
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
  } else {
      posts = await prisma.post.findMany({
        skip: skip || 0,
        take: 10,
        where: {
          archivedAt: null,
        },
        orderBy: {
          createdAt: "desc",
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
  }



  return posts;
}

export default handler;
