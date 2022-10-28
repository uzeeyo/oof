import prisma from "../pages/api/_config";
import { Tag } from "@prisma/client";

export const tagRegex = /(#[a-zA-Z0-9_\-]{1,})/g;

export function findTags(words: string): Array<string> {

  const w = words.match(tagRegex);

  return Array.from(new Set(w));
}

export async function createTags(tags: Array<string>) {
  const tagsToAdd = tags.map((tag) => {
    return { name: tag };
  });

  const result = await prisma.tag.createMany({
    data: [...tagsToAdd],
    skipDuplicates: true,
  });

  const createdTags = await prisma.tag.findMany({
    where: {
      OR: [...tagsToAdd],
    },
  });
  return createdTags;
}

export async function connectTags(tags: Array<Tag>, postId: string) {
  const connections = tags.map((tag) => {
    return { postId, tagId: tag.id };
  });
  await prisma.postTag.createMany({
    data: [...connections],
  });
}