import type { NextApiRequest, NextApiResponse } from "next";
import { verifyLogin } from "../../../../lib/auth";
import prisma from "../../../../../prisma/_config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    //Check cookie and verify jwt
    const verified = verifyLogin({ req, res });
    if (verified.err) {
      return res.status(verified.err).end();
    }

    //Check if valid params
    if (!req.body.liked == undefined) {
      return res.status(400).send({ error: "Invalid parameters." });
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

        return res.status(201).send({ liked: true });
      }
      if (req.body.liked == false) {
        await prisma.like.deleteMany({
          where: {
            userId: verified.token.userId,
            postId: req.query.postId as string,
          },
        });
        return res.status(200).send({ liked: false });
      }
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        return res.status(409).end();
      }
      console.log(err);
      return res.status(500).end();
    }
  } else {
    return res.status(400).send({ error: "Invalid request method" });
  }
}
