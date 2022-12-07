import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/_config";
import { convertLikes } from "./get";

interface Data {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {}

export const getLikedPosts = async (userId: string, skip?: number) => {
  try {
    console.log(userId);
    const likedPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      take: 10,
      skip: skip || 0,
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

    return likedPosts.map(post => {
        let filteredPost: any = { ...post };
        filteredPost.createdAt = filteredPost.createdAt.getTime();
        delete filteredPost.likes;
        filteredPost.likeCount = convertLikes(filteredPost._count.likes);
        delete filteredPost._count.likes;
        filteredPost.liked = post.likes.length > 0 ? true : false;
        return filteredPost;
    })
  } catch {}
};
