import { cn } from "@/lib/utils";
import { BaseDropdown, BaseDropdownItem } from "@shuriken-ui/react";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import React from "react";

export interface NavigationItemProps {
  prefetch?: boolean;
  as?: React.ElementType;
  href?: string;
  className?: string;
  title: string;
  icon?: FC<LucideProps>;
  children?: NavigationItemProps[];
  text?: string;
  onClick?: () => void;
  renderButton?(): React.ReactNode;
}

export const NavigationItem = React.forwardRef<
  HTMLLIElement,
  NavigationItemProps
>(
  (
    {
      as = "li",
      prefetch,
      onClick,
      children,
      icon: Icon,
      href,
      className,
      title,
      renderButton,
      ...restProps
    },
    ref
  ) => {
    const Comp = as;

    if (children) {
      return (
        <Comp
          {...restProps}
          ref={ref}
          className={cn(
            "text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility",
            className
          )}
        >
          <BaseDropdown
            fixed
            oonClick={onClick}
            // @ts-ignore
            label={
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" strokeWidth={1.5}></Icon>}
                {title}
              </div>
            }
            renderButton={renderButton}
            classes={{ wrapper: "flex item-center " }}
            variant="text"
          >
            {children.map((e) => (
              <BaseDropdownItem
                key={e.href + e.title}
                href={e.href}
                title={e.title}
                text={e.text}
                rounded="sm"
              />
            ))}
          </BaseDropdown>
        </Comp>
      );
    }
    return (
      <Comp
        {...restProps}
        ref={ref}
        className={cn(
          "flex items-center gap-2 font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility",
          className
        )}
      >
        <Link prefetch={prefetch} onClick={onClick} href={href!}>
          {Icon && <Icon strokeWidth={1.5} className="h-4 w-4" />}
          {title}
        </Link>
      </Comp>
    );
  }
);

NavigationItem.displayName = "NavigationItem";
