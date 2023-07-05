import prisma from "@/prisma/client";
import { cache } from "react";

export const getAllCategories = cache(async () => {
  return await Promise.all(
    await prisma.categories.findMany({
      orderBy: {
        updated_at: "desc",
      },
    })
  );
});
