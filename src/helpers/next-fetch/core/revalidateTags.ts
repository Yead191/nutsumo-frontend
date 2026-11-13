"use server";

import { updateTag } from "next/cache";

export const revalidateTags = async (tags: string[]) => {
  tags.forEach((tag) => {
    updateTag(tag);
  });
};
