import { cn } from "@/lib/utils";
import { BaseDropdown, BaseDropdownItem } from "@shuriken-ui/react";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

export interface NavigationItemProps {
  href?: string;
  className?: string;
  title: string;
  icon: FC<LucideProps>;
  children?: Omit<NavigationItemProps, "icon">[];
  text?: string;
  onClick?: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  onClick,
  children,
  icon: Icon,
  href,
  className,
  title,
}) => {
  if (children) {
    return (
      <li className="text-base text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility">
        <BaseDropdown
          oonClick={onClick}
          // @ts-ignore
          label={
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" strokeWidth={1.5}></Icon>
              资源
            </div>
          }
          classes={{ wrapper: "flex item-center " }}
          variant="text"
        >
          {children.map((e) => (
            <BaseDropdownItem
              key={e.href}
              href={e.href}
              title={e.title}
              text={e.text}
              rounded="sm"
            />
          ))}
        </BaseDropdown>
      </li>
    );
  }
  return (
    <li>
      <Link
        onClick={onClick}
        href={href!}
        className={cn(
          "flex items-center gap-2 font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility",
          className
        )}
      >
        <Icon strokeWidth={1.5} className="h-4 w-4" />
        {title}
      </Link>
    </li>
  );
};
