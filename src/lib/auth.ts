import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";
import { OptionsType } from "cookies-next/lib/types";

function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export function verifyLogin(options: OptionsType) {
  const token = getCookie("access-token", options);
  if (!token)
    return {
      status: "err",
      err: 401,
      errText: "Not authenticated.",
    };
  const verifiedToken = verifyToken(token.valueOf() as string);
  if (!verifiedToken)
    return {
      status: "err",
      err: 403,
      errText: "Unauthorized",
    };

  return {
    status: "ok",
    token: verifiedToken,
  };
}
