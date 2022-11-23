import { deleteCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyLogin } from "../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const loggedIn = verifyLogin({ req, res });
    if (loggedIn.errCode) {
      return res.status(400).end();
    }

    deleteCookie("access-token", { req, res });

    return res.send({ user: { loggedOut: true } });
  } else {
    return res.status(405).end();
  }
}
