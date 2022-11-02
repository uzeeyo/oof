import { Post } from "@prisma/client";

export default interface IPost extends Post {
  liked: boolean;
  likeCount: string;
}
