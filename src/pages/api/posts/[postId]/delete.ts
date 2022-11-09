import type { NextApiRequest, NextApiResponse } from "next";
import { verifyLogin } from "../../../../lib/auth";
import prisma from "../../../../../prisma/_config";

interface Data {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "DELETE") {
    const postId = req.query.postId;
    const verified = verifyLogin({ req, res });
    if (verified.err) {
      console.log(verified);
      return res.status(verified.err).send(verified);
    }

    try {
      const deleted = await prisma.post.delete({
        where: {
          id: postId as string,
        },
      });
      return res.status(201).send("Post deleted.");
    } catch (err) {
      console.log(err);
      return res.status(400).send("Internal error.");
    }
  } else {
    return res.status(400).send("Invalid request method.");
  }
}
