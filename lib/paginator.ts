import { POSTS_COUNT_PER_PAGE } from "@/constants";

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};

export function getPrismaPaginationParams(
  options: PaginateOptions & { tagId?: number | undefined }
) {
  const page = Number(options?.page) || 1;
  const perPage = Number(options?.perPage) || POSTS_COUNT_PER_PAGE;
  const skip = page > 0 ? perPage * (page - 1) : 0;
  return { take: perPage, skip };
}
