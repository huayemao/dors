import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "medium";
  flavor?: "pastel" | "solid";
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  size = "medium",
  flavor = "solid",
  className,
  loading = false,
  ...rest
}) => {
  return (
    <>
      <button
        type="button"
        {...rest}
        className={cn(
          "nui-button nui-button-rounded nui-button-solid nui-button-primary",
          {
            "nui-button-medium": size === "medium",
            "nui-button-small": size === "sm",
            "nui-button-pastel": flavor === "pastel",
            "nui-button-loading": loading,
          },
          className
        )}
      >
        {children}
        {loading && (
          <div className="absolute left-0 right-0 top-0 bottom-0 inline-flex items-center justify-center">
            <div className="nui-placeload animate-nui-placeload h-[60%] w-[80%] rounded"></div>
          </div>
        )}
      </button>
    </>
  );
};

export default Button;
