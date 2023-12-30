import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "medium";
}

const Button: FC<ButtonProps> = ({ children, size = "medium", ...rest }) => {
  return (
    <>
      <button
        type="button"
        className={cn(
          "nui-button nui-button-rounded nui-button-solid nui-button-primary",
          {
            "nui-button-medium": size === "medium",
            "nui-button-small": size === "sm",
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
