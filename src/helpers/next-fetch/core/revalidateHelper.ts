"use server";

import { revalidateTag } from "next/cache";

export const revalidate = async (tag: string) => {
  //   @ts-ignore
  return revalidateTag(tag);
};
