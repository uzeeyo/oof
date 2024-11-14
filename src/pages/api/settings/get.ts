import { UserSettings } from "@prisma/client";
import { IncomingMessage, ServerResponse } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/_config";
import { verifyLogin } from "../../../lib/auth";

interface Data {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const settings = await getSettings({ req, res });
    if (settings) return res.send(settings);
    else return res.status(500);
  } else {
    return res.status(405).end();
  }
}

export const getSettings = async ({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}) => {
  const verified = await verifyLogin({ req, res });
  if (verified.errCode) return null;
  if (!verified.token) {
    return null;
  }

  try {
    const settings = await prisma.userSettings.findUnique({
      where: {
        userId: verified.token.userId,
      },
    });

    return settings;
  } catch {
    return null;
  }
};
