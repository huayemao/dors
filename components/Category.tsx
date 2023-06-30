import { cn } from "@/lib/utils";
import { tags } from "@prisma/client";
import Link from "next/link";

type CategoryProps = {
  active?: boolean;
  data: tags;
};

export const Category: React.FC<CategoryProps> = ({ data, active = false }) => (
  <Link
    href={`/categories/${data.id}`}
    className={cn(
      "flex-1 inline-flex justify-center items-center py-2 px-4 font-sans text-sm",
      "rounded-lg  dark:bg-muted-800 text-muted-500  dark:hover:bg-muted-700 dark:hover:text-muted-200",
      "border-2 border-transparent transition-colors duration-300 tw-accessibility",
      {
        "text-primary-500 bg-primary-500/20 border-primary-500": active,
        "bg-muted-200 hover:bg-muted-300": !active,
      }
    )}
  >
    {data.name}
  </Link>
);
