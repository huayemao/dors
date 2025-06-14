"use client"
import useMagicGrid from "@/app/(content)/navigation/MagicGrid";
import { cn } from "@/lib/utils";
import c from "@/styles/gallery.module.css";
import { ComponentProps, useRef } from "react";

function Gallery({
  children,
  preview = false,
  className,
  ...props
}: ComponentProps<"div"> & { preview?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useMagicGrid(preview?".sdfisdhfidus":ref)

  return (
    <div 
      ref={ref}
      className={cn(
        "not-prose",
        c.gallery_root,
        { "space-y-2 lg:space-y-4": !preview },
        {
          "grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 items-center justify-items-center":
            preview,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Gallery;
