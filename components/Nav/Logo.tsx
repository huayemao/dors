import { cn } from "@/lib/utils";
import Link from "next/link";
import { BaseCard } from "@glint-ui/react";
import { AppWindow, Grid, LayoutDashboard, Grip, Navigation } from "lucide-react";
import { Popover } from "@headlessui/react";

export default function Logo({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div className="relative text-[#312e81] dark:text-muted-50">
      <Link
        href="/"
        className={cn(
          "flex title-font font-medium items-center text-primary-700 dark:text-muted-100 transition-transform duration-300 hover:scale-105",
          className
        )}
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="60 60 280 280"
          className="w-10 h-10 mr-4">
          <defs xmlns="http://www.w3.org/2000/svg"><linearGradient gradientTransform="rotate(135, 0.5, 0.5)" x1="50%" y1="0%" x2="50%" y2="100%" id="ffflux-gradient"><stop stopColor="hsl(300, 60%, 64%)" stopOpacity="1" offset="0%" /><stop stopColor="hsl(218, 68%, 57%)" stop-opacity="1" offset="100%" /></linearGradient><filter id="ffflux-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.004" numOctaves="2" seed="284" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence" />
            <feGaussianBlur stdDeviation="78 0" x="0%" y="0%" width="100%" height="100%" in="turbulence" edgeMode="duplicate" result="blur" />
            <feBlend mode="lighten" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" in2="blur" result="blend" />
          </filter></defs>
          <path
            stroke="currentColor"
            // stroke="url(#ffflux-gradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity={1}
            strokeWidth={16}
            d="M209.202 314c85.867-11.882 144.591-95.582 98.843-178.976-56.532-103.04-246.218-28.586-231.201 84.347 9.852 74.073 136.253 96.197 157.668 17.486 3.785-13.921 2.202-79.036-16.371-83.689-1.735-.438-23.939 22.657-33.724 22.657-7.686 0-24.801-37.866-42.933 0"
          />
        </svg>
      </Link>

      <div className="absolute -right-6 -top-2 group">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg   group-hover:bg-primary-100 dark:group-hover:bg-muted-700 transition-all duration-300 cursor-pointer">
          <Grip className="size-4 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="absolute z-10 left-0 top-4 w-48 lg:w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <BaseCard className="p-4 shadow-lg">
            <div className="space-y-2">
              <Link
                href={"/apps"}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-muted-700 transition-colors duration-200 cursor-pointer"
              >
                <AppWindow className="w-5 h-5" />
                <span>应用台</span>
              </Link>
              <Link
                href={"/navigation"}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-muted-700 transition-colors duration-200 cursor-pointer"
              >
                <Navigation className="w-5 h-5" />
                <span>导航页</span>
              </Link>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  );
}
