import type { NextApiRequest, NextApiResponse } from "next";
import { verifyLogin } from "../../../../lib/auth";
import prisma from "../../../../../prisma/_config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    //Check cookie and verify jwt
    const verified = verifyLogin({ req, res });
    if (verified.err) {
      console.log(verified);
      return res.status(verified.err).send(verified);
    }

    //Check if valid params
    if (!req.body.liked == undefined) {
      return res.status(400).send("Invalid parameters.");
    }

    try {
      if (req.body.liked == true) {
        await prisma.like.create({
          data: {
            userId: verified.token.userId,
            postId: req.query.postId as string,
            liked: true,
          },
        });

        return res.status(201).send("Post liked");
      }
      if (req.body.liked == false) {
        await prisma.like.deleteMany({
          where: {
            userId: verified.token.userId,
            postId: req.query.postId as string,
          },
        });
        return res.status(200).send("Post unliked");
      }
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  } else {
    return res.status(400).send("Invalid request");
  }
}
