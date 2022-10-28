import jwt from "jsonwebtoken";

export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}
