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
  const verified = verifyLogin({ req, res });

  if (verified.errCode) return res.status(verified.errCode).end();

  if (req.method === "POST") {
    try {
      settingsSchema.parse(req.body);
      await prisma.userSettings.upsert({
        where: {
          userId: verified.token.userId,
        },
        update: {
          darkMode: req.body.darkMode,
          desktopNotify: req.body.desktopNotify,
          mobileNotify: req.body.mobileNotify,
          usernameVisibleOnPosts: req.body.usernameVisibleOnPosts,
          usernameVisibleOnComments: req.body.usernameVisibleOnComments,
          showPorn: req.body.showPorn,
          showViolence: req.body.showViolence,
        },
        create: {
          userId: verified.token.userId,
          darkMode: req.body.darkMode,
          desktopNotify: req.body.desktopNotify,
          mobileNotify: req.body.mobileNotify,
          usernameVisibleOnPosts: req.body.usernameVisibleOnPosts,
          usernameVisibleOnComments: req.body.usernameVisibleOnComments,
          showPorn: req.body.showPorn,
          showViolence: req.body.showViolence,
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
