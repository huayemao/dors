import { cn } from "@/lib/utils";
import react from "react";

export function MenuButton({
  setMobileOpen,
  mobileOpen,
  className
}: {
  setMobileOpen: react.Dispatch<react.SetStateAction<boolean>>;
  mobileOpen: boolean;
  className?: string
}) {
  return (
    <button
      onClick={() => {
        setMobileOpen((open) => !open);
      }}
      className={cn("flex relative justify-center items-center ml-auto w-10 h-10 focus:outline-none lg:hidden", className)}
    >
      <div
        className={cn(
          "block top-1/2 left-6 w-4 -translate-x-1/2 -translate-y-1/2"
        )}
      >
        <span
          className={cn(
            "block absolute w-7 h-0.5 text-primary-500 bg-current transition-all duration-500 ease-in-out",
            mobileOpen ? "rotate-45" : "-translate-y-2"
          )}
        ></span>
        <span
          className={cn(
            "block absolute w-5 h-0.5 text-primary-500 bg-current transition-all duration-500 ease-in-out",
            mobileOpen ? "opacity-0" : ""
          )}
        ></span>
        <span
          className={cn(
            "block absolute w-7 h-0.5 text-primary-500 bg-current transition-all duration-500 ease-in-out",
            mobileOpen ? "-rotate-45" : "translate-y-2"
          )}
        ></span>
      </div>
    </button>
  );
}
