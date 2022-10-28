import { Tag } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../_config";

interface Data {}

//EXPECT: postId, tagId, name
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == "POST") {
    
  }
}