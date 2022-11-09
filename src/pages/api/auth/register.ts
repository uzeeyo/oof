import prisma from "../../../../prisma/_config";
import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { username, password, email } = req.body;
    if (password.length < 6) return res.status(400).send("Invalid password.");
    bcrypt.hash(password, 10, async (err, hash) => {
      try {
        const exists = await prisma.user.findMany({
          where: {
            username: username,
          },
        });

        if (exists) return res.status(400).send("User already exists.");

        const user = await prisma.user.create({
          data: {
            username: username,
            password: hash,
            email: email || null,
          },
        });
        return res.status(201).send(`User ${username} created.`);
      } catch {
        return res.status(500).send("A problem has occured.");
      }
    });
  } else {
    return res.status(405).send("Invalid request method.");
  }
};

export default handler;
