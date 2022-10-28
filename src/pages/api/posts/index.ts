import { getCookie } from "cookies-next";
import { verify } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/auth";
import { connectTags, findTags, tagRegex } from "../../../lib/tags";
import prisma from "../_config";
import { createTags } from "../../../lib/tags";
import dp from "dompurify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //To get comments by pagination
  if (req.method == "GET") {
    const posts = await getPosts(req.body.skip);
    return res.status(200).send(posts);
  }

  //To post a comment
  if (req.method == "POST") {
    const post = req.body;
    const safeText = dp.sanitize(post.text);

    //Check cookie and verify jwt
    const token = getCookie("access-token", { req, res });
    if (!token) return res.status(403).send("Unauthorized");
    const verified = verifyToken(token.valueOf() as string);
    if (!verified) return res.status(401).send("Not authenticated");

    try {
      const p = await prisma.post.create({
        data: {
          userId: verified.userId,
          text: safeText,
        },
      });

      //Parse tags then make connections
      const tags = findTags(post.text);
      const connections = await createTags(tags);
      await connectTags(connections, p.id);

      return res.status(200).send("Post added.");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong.");
    }
  } else {
    return res.status(500);
  }
};

export async function getPosts(skip: number) {
  const posts = await prisma.post.findMany({
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

  posts.forEach((post) => {
    post.text = post.text!.replaceAll(tagRegex, (match) => {
      return `<a href="/posts?tag=${match.slice(1)}">${match}</a>`;
    });
  });

  return posts;
}

export default handler;
