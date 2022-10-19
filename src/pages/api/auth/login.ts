import prisma from "../_config";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400);

    try {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });

      if (user?.password) {
        const match = await bcrypt.compare(password, user.password);
        //Return cookies here
      }
    } catch (err) {
      console.log(err);
    }
  }
};

export default handler;
