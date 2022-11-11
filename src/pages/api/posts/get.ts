import type { NextApiRequest, NextApiResponse } from "next";
import { verifyLogin } from "../../../lib/auth";
import prisma from "../../../../prisma/_config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const verified = verifyLogin({ req, res });

  //To get comments by pagination
  if (req.method === "POST") {
    let posts;
    const { skip, tag } = req.body;

    try {
      if (verified.status === "err") {
        posts = await getPosts(skip || 0, tag);
      } else {
        posts = await getPosts(skip || 0, tag, verified.token.userId);
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send("DB");
    }
    return res.status(200).send(posts);
  } else {
    return res.status(500).send("Internal error.");
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
