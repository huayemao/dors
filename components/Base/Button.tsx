import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "medium";
  flavor?: "pastel" | "solid";
}

const Button: FC<ButtonProps> = ({
  children,
  size = "medium",
  flavor = "solid",
  ...rest
}) => {
  return (
    <>
      <button
        type="button"
        className={cn(
          "nui-button nui-button-rounded nui-button-solid nui-button-primary",
          {
            "nui-button-medium": size === "medium",
            "nui-button-small": size === "sm",
            "nui-button-pastel": flavor === "pastel",
          }
        )}
        {...rest}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
