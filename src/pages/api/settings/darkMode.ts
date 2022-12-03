import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/_config";
import { verifyLogin } from "../../../lib/auth";

interface Data {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const verified = verifyLogin({ req, res });

    if (verified.errCode) return res.status(verified.errCode).end();

    const settings = await prisma.userSettings.findUnique({
      where: {
        userId: verified.token.userId,
      },
      select: {
        darkMode: true,
      },
    });

    if (settings) return res.send(settings);
    return res.status(404).end()
  } else {
    return res.status(405).end();
  }
}
