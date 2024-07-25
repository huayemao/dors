import { BaseButton } from "@shuriken-ui/react";
import { ComponentProps } from "react";

interface CategoryProps extends ComponentProps<typeof BaseButton> {
  active?: boolean;
  name: string;
  href: string;
}

export const Category: React.FC<CategoryProps> = ({
  name,
  active = false,
  href,
  ...props
}) => (
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
);
