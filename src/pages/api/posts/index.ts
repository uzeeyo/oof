import type { NextApiRequest, NextApiResponse } from "next";
import { verifyLogin } from "../../../lib/auth";
import { connectTags, findTags } from "../../../lib/tags";
import prisma from "../../../../prisma/_config";
import { createTags } from "../../../lib/tags";
import { parse } from "../../../lib/form";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const verified = verifyLogin({ req, res });

  //To get comments by pagination
  if (req.method === "GET") {
    let posts;

    if (verified.status === "err") {
      posts = await getPosts(req.body.skip, req.body.tag);
    } else {
      posts = await getPosts(
        req.body.skip,
        req.body.tag,
        verified.token.userId
      );
    }
    return res.status(200).send(posts);
  }

  //To post a comment
  if (req.method === "POST") {
    //Check cookie and verify jwt
    if (verified.err) {
      console.log(verified);
      return res.status(verified.err).send(verified);
    }

    const parsedData = await parse(req);

    try {
      const p = await prisma.post.create({
        data: {
          userId: verified.token.userId,
          text: parsedData.body.text as string,
          imageUrl: parsedData.pathName,
        },
      });

      //Parse tags then make connections
      const tags = findTags(parsedData.body.text as string);
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

export async function getPosts(
  skip: number,
  tag: string | null,
  userId?: string
) {
  //Runs first if filtering by tags
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
        likes: {
          where: {
            userId: userId || "",
          },
          select: {
            liked: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        createdAt: true,
      },
    });
  } else {
    //Runs if query is not filtering by tags
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
        likes: {
          where: {
            userId: userId || "",
          },
          select: {
            liked: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        createdAt: true,
      },
    });
  }
  return posts.map((post) => {
    //DELETE
    // console.log(post);
    let filteredPost: any = { ...post };
    delete filteredPost.likes;
    filteredPost.likeCount = convertLikes(filteredPost._count.likes);
    delete filteredPost._count.likes;
    filteredPost.liked = post.likes.length > 0 ? true : false;
    return filteredPost;
  });
}

export const convertLikes = (count: number): string => {
  if (count == 0) return "";
  if (1000 < count) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
