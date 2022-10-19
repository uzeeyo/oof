import prisma from "../_config";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { username, password, email } = req.body;
    if (password.length < 6) return res.status(400).send("Invalid password.");
    bcrypt.hash(password, 10, async (err, hash) => {
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hash,
          email: email || null,
        },
      });
      return res.send(`User ${username} created.`);
    });
  } else {
    return res.status(500);
  }
};

export default handler;
