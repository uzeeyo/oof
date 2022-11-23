import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/_config";
import { ZodError } from "zod";
import { commentSchema } from "../../../../lib/validationSchemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    try {
      commentSchema.parse(req.body);

      const comment = await prisma.comment.create({
        data: {
          text: req.body.text,
          postId: req.query.postId as string,
        },
      });
      return res.status(201).send(comment);
    } catch (err) {
      if ((err = typeof ZodError)) return res.status(422).end();
      console.log(err);
      return res.status(500).send("Error posting comment.");
    }
  } else return res.status(400);
}
