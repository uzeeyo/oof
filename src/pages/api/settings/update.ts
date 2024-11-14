import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import prisma from "../../../../prisma/_config";
import { verifyLogin } from "../../../lib/auth";
import { settingsSchema } from "../../../lib/validationSchemas";

interface Data {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const verified = await verifyLogin({ req, res });

  if (verified.errCode) return res.status(verified.errCode).end();
  if (!verified.token) {
    return res.status(401).send("Unauthorized");
  }

  if (req.method === "POST") {
    try {
      const settings = settingsSchema.parse(req.body);
      await prisma.userSettings.upsert({
        where: {
          userId: verified.token.userId,
        },
        update: {
          darkMode: settings.darkMode,
          desktopNotify: settings.desktopNotify,
          mobileNotify: settings.mobileNotify,
          usernameVisibleOnPosts: settings.usernameVisibleOnPosts,
          usernameVisibleOnComments: settings.usernameVisibleOnComments,
          showPorn: settings.showPorn,
          showViolence: settings.showViolence,
        },
        create: {
          userId: verified.token.userId,
          darkMode: settings.darkMode,
          desktopNotify: settings.desktopNotify,
          mobileNotify: settings.mobileNotify,
          usernameVisibleOnPosts: settings.usernameVisibleOnPosts,
          usernameVisibleOnComments: settings.usernameVisibleOnComments,
          showPorn: settings.showPorn,
          showViolence: settings.showViolence,
        },
      });

      return res.status(201).end();
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).end();
      return res.status(500).end();
    }
  } else {
    return res.status(405).end();
  }
}
