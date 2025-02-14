import useMagicGrid from "@/app/(content)/navigation/MagicGrid";
import { cn } from "@/lib/utils";
import c from "@/styles/gallery.module.css";
import { ComponentProps } from "react";

function Gallery({
  children,
  preview = false,
  className,
  ...props
}: ComponentProps<"div"> & { preview?: boolean }) {
  return (
    <div
      className={cn(
        "not-prose",
        c.gallery_root,
        { "masonry-sm md:masonry-md": !preview },
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
