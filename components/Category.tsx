import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type CategoryProps = {
  active?: boolean;
  children: ReactNode;
};

export const Category: React.FC<CategoryProps> = ({
  children,
  active = false,
}) => (
  <button
    className={cn(
      "flex-1 inline-flex justify-center items-center py-2 px-4 font-sans text-sm",
      "rounded-lg bg-muted-200 dark:bg-muted-800 text-muted-500  dark:hover:bg-muted-700 dark:hover:text-muted-200",
      "border-2 border-transparent transition-colors duration-300 tw-accessibility",
      {
        "text-primary-500 bg-primary-500/20 border-primary-500": active,
        "hover:bg-muted-300": !active,
      }
    )}
  >
    {children}
  </button>
);
