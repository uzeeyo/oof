import type { NextApiRequest, NextApiResponse } from "next";
import { verifyLogin } from "../../../lib/auth";
import { connectTags, findTags } from "../../../lib/tags";
import prisma from "../../../../prisma/_config";
import { createTags } from "../../../lib/tags";
import { parse } from "../../../lib/form";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //To post a comment
  if (req.method === "POST") {
    const verified = verifyLogin({ req, res });
    //Check cookie and verify jwt
    if (verified.errCode) {
      console.log(verified);
      return res.status(verified.errCode).send(verified);
    }

    try {
      const parsedData = await parse(req);

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
}

export const config = {
  api: {
    bodyParser: false,
  },
};