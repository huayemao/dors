import { getPrismaPaginationParams, PaginateOptions } from "@/lib/paginator";

export function withPagination<T, P>(fn: (args: P) => Promise<T>, getPaginationOption: () => PaginateOptions) {
  return async function (args: P): Promise<T> {
    const { take, skip } = getPrismaPaginationParams(getPaginationOption());
    return await fn({
      ...args,
      take,
      skip,
    });
  };
}
