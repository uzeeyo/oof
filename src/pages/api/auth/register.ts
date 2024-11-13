import prisma from "../../../../prisma/_config";
import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import moment from "moment";
import { registrationSchema } from "../../../lib/validationSchemas";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { username, password, email } = req.body;

    //Check if data conforms to schema
    try {
      registrationSchema.parse({ username, password, email });
    } catch {
      return res.status(422).end();
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      try {
        const userData = {
          username,
          password: hash,
          email: email || null,
          settings: {
            create: {},
          },
        };

        const user = await prisma.user.upsert({
          where: {
            username_email: {
              username,
              email,
            },
          },
          update: {},
          create: userData,
          include: {
            settings: true,
          },
        });

        console.log(user);

        const token = sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
            userId: user.id,
            username: user.username,
          },
          process.env.JWT_SECRET!
        );

        return res
          .status(201)
          .setHeader(
            "Set-Cookie",
            `access-token=${token}; HttpOnly; Path=/; Expires=${moment().add(
              3,
              "days"
            )}`
          )
          .end();
      } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
          const errorField = err.meta!.target as any;
          return res.status(409).send({ alreadyExists: errorField[0] });
        }
        return res.status(500).end();
      }
    });
  } else {
    return res.status(405).end();
  }
};

export default handler;
