"use client";
import { BaseButton, BaseLink } from "@glint-ui/react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Base/Icon";

import { ComponentProps, Fragment, ReactNode } from "react";
import Link from "next/link";

interface CategoryProps extends ComponentProps<typeof BaseButton> {
  as?:
    | string
    | React.ComponentType<{
        className: string;
        onClick: () => void;
        children: ReactNode;
      }>;
  active?: boolean;
  name: string;
  href: string;
  iconName?: string;
}
export const Category: React.FC<CategoryProps> = ({
  name,
  active = false,
  href,
  iconName,
  as: Comp,
  ...props
}) => {
  const router = useRouter();
  const LucideIcon = (
    <Icon
      className="h-4 w-4"
      name={(iconName as ComponentProps<typeof Icon>["name"]) || "cat"}
    />
  );
  if (Comp) {
    return (
      <Comp
        className={"group flex items-center gap-3"}
        onClick={() => {
          router.push(href);
        }}
      >
        <div className="text-muted-500 rounded-lg dark:text-muted-100 bg-muted-100 dark:bg-muted-700 group-hover:bg-primary-500 group-hover:shadow-primary-500/30 flex h-11 w-11 items-center justify-center transition-all duration-300 group-hover:text-white group-hover:shadow-xl dark:group-hover:text-white">
          {LucideIcon}
        </div>
        <span className="text-muted-400 group-hover:text-muted-800 dark:group-hover:text-muted-100 font-sans text-sm transition-colors duration-300">
          {name}
        </span>
      </Comp>
    );
  } else {
    return (
      <Link href={href} className={"group flex items-center gap-3"}>
        <div className="text-muted-500 rounded-lg dark:text-muted-100 bg-muted-100 dark:bg-muted-700 group-hover:bg-primary-500 group-hover:shadow-primary-500/30 flex h-11 w-11 items-center justify-center transition-all duration-300 group-hover:text-white group-hover:shadow-xl dark:group-hover:text-white">
          {LucideIcon}
        </div>
        <span className="text-muted-400 group-hover:text-muted-800 dark:group-hover:text-muted-100 font-sans text-sm transition-colors duration-300">
          {name}
        </span>
      </Link>
    );
  }
};
