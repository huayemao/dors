import { BaseButton } from "@shuriken-ui/react";
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
}) => (
  <Comp>
    <BaseButton
      shadow={active ? "flat" : "hover"}
      suppressHydrationWarning
      href={href}
      style={{ whiteSpace: "nowrap", lineHeight: "unset" }}
      color={active ? "primary" : "muted"}
      {...props}
    >
      {name}
    </BaseButton>
  </Comp>
);
