import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/_config";
import { verifyLogin } from "../../../../lib/auth";
import { reportSchema } from "../../../../lib/validationSchemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const verified = verifyLogin({ req, res });
    if (verified.errCode) {
      return res.status(verified.errCode).end();
    }

    try {
      const report = reportSchema.parse(req.body)

      const added = await prisma.report.create({
        data: {
          postId: req.query.postId as string,
          userId: verified.token.userId as string,
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
