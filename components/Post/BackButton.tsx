"use client";
import clsx from "clsx";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: JSX.Element;
}

export const BackButton = ({ children, className }: Props) => {
  const router = useRouter();
  const handleClick = () => {
    router.back();
  };
  return (
    <Link
      href={"../"}
      onClick={handleClick}
      className={clsx(
        "flex items-center gap-2 font-sans font-medium text-base text-muted-400 hover:text-primary-500 transition-colors duration-300",
        className
      )}
    >
      <MoveLeft width={'1em'} height={'1em'}></MoveLeft>
      <span>{children || "返回"}</span>
    </Link>
  )
};
