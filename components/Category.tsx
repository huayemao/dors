"use client";
import { BaseButton, BaseLink } from "@shuriken-ui/react";
import { useRouter } from "next/navigation";
import { ComponentProps, Fragment } from "react";

interface CategoryProps extends ComponentProps<typeof BaseButton> {
  as?: string | React.ComponentType<any>;
  active?: boolean;
  name: string;
  href: string;
}
export const Category: React.FC<CategoryProps> = ({
  name,
  active = false,
  href,
  as: Comp = Fragment,
  ...props
}) => {
  const router = useRouter();
  return (
    <Comp>
      <BaseButton
        shadow={"flat"}
        suppressHydrationWarning
        onClick={() => {
          router.push(href);
        }}
        // href={href}
        style={{ whiteSpace: "nowrap", lineHeight: "unset", border: "none" }}
        color={active ? "primary" : "muted"}
        {...props}
      >
        {name}
      </BaseButton>
    </Comp>
  );
};
