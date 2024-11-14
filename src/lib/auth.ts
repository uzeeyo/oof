import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";
import prisma from "../../prisma/_config";

interface AuthToken {
  exp: number;
  userId: string;
  username: string;
}

interface LoginDetails {
  status: string;
  errCode?: number;
  errText?: string;
  token?: AuthToken;
  isAdmin?: boolean;
}

function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthToken;
    return decoded;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function verifyIfAdmin(username: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      isAdmin: true,
    },
  });
  return user != null && user.isAdmin;
}

export async function verifyLogin(
  options: OptionsType,
  verifyAdmin?: boolean
): Promise<LoginDetails> {
  const token = getCookie("access-token", options);
  if (!token) {
    console.log("No token to verify");
    return {
      status: "err",
      errCode: 401,
      errText: "Not authenticated.",
    };
  }

  const parsedToken = verifyToken(token.valueOf() as string);
  if (!parsedToken) {
    console.log("Couldn't parse token");
    return {
      status: "err",
      errCode: 403,
      errText: "Unauthorized",
    };
  }

  const loginDetails: LoginDetails = {
    status: "ok",
    token: parsedToken,
  };

  if (verifyAdmin) {
    console.log("Checking user for admin privs");
    loginDetails.isAdmin = await verifyIfAdmin(parsedToken.username)
  }

  return loginDetails;
}
