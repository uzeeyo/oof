import prisma from "../_config";
import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).send("Username and password required.");

    try {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });

      const match = await compare(password, user!.password!);
      if (match) {
        //If username & password are correct return a token
        const token = sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            username: user!.username,
          },
          process.env.JSON_SECRET!
        );
        return res
          .status(200)
          .setHeader("Set-Cookie", `access-token=${token}; HttpOnly`)
          .end();
      } else {
        //If usernamae/password is wrong
        return res.status(400).send("Username or password incorrect.");
      }
    } catch (err) {
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
