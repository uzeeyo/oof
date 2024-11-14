import prisma from "../../../../prisma/_config";
import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import moment from "moment";
import { loginSchema } from "../../../lib/validationSchemas";
import { ZodError } from "zod";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { username, password } = req.body;

    try {
      loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          id: true,
          username: true,
          password: true,
          email: true,
          emailVerified: true,
          isAdmin: true,
          settings: {
            select: {
              darkMode: true,
            },
          },
        },
      });

      if (!user) return res.status(403).end();
      const { password: storedPassword, ...formattedUser } = user;

      const match = await compare(password, storedPassword!);
      if (match) {
        //If username & password are correct return a token
        const token = sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            userId: user.id,
            username: user!.username,
          },
          process.env.JWT_SECRET!
        );
        return res
          .status(200)
          .setHeader(
            "Set-Cookie",
            `access-token=${token}; HttpOnly; Path=/; Expires=${moment().add(
              3,
              "days"
            )}`
          )
          .send(formattedUser);
      } else {
        //If usernamae/password is wrong
        return res.status(403).end();
      }
    } catch (err) {
      if (err instanceof ZodError) return res.status(400).end();
      //Connection errors
      console.log(err);
      return res.status(500).send("An error has occured.");
    }
  } else {
    //If method is not POST
    return res.status(405).send("Invalid request method.");
  }
};

export default handler;
