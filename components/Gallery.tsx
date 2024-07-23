import { cn } from "@/lib/utils";
import c from "@/styles/gallery.module.css";
import { ComponentProps } from "react";

function Gallery({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn(c.gallery_root, "masonry-sm md:masonry-md")}>
      {children}
    </div>
  );
}

export default Gallery;
