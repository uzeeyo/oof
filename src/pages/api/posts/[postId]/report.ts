import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/_config";
import { verifyLogin } from "../../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const report = req.body;
    const verified = verifyLogin({ req, res });

    try {
      const added = await prisma.report.create({
        data: {
          postId: req.query.postId as string,
          userId: verified.token.userId,
          text: report.text,
        },
      });

      if (!added.id) return res.status(409).end();
      return res.status(200).end();
    } catch {
      return res.status(500).end();
    }
  } else {
    return res.status(405).end();
  }
}
