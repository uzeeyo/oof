import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../_config";

interface Data {}

//EXPECT: postId, tagId, name
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { postId, name } = req.body;
  if (req.method == "POST") {
    const exists = await prisma.tag.findMany({
      where: {
        name: name,
      },
    });

    if (!exists) {
      const newTag = await prisma.tag.create({
        data: {
          name: name,
        },
      });
      prisma.postTag.create({
        data: {
          postId: postId,
          tagId: newTag.id,
        },
      });
    }
  }
}
