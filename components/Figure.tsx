"use client";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import mime from "mime";
import { useLayoutEffect, useRef, useState } from "react";

export function Figure(props) {
  const { src, width, height, ignoreCaption, className, preview } = props;

  const mimetype = mime.getType(src);
  mime.getType(src);
  const ref = useRef<HTMLAnchorElement>(null);
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");
  const Container = ({ children }) => {
    return <a
      suppressHydrationWarning
      ref={ref}
      className={cn("!no-underline block", className)}
      data-pswp-width={width || 800}
      data-pswp-height={height || 600}
    >
      {
        children
      }
    </a>

  }
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    const current = ref.current;

    if(current.closest('.not-prose')?.className.includes('gallery')){
      current.style.maxWidth = isMobile? "40%" : "30%";
    }
    const img = current.querySelector("img");
    const video = current.querySelector("video");
    
    if (img) {
      current.href = img.src || "";
      
      if (img.complete && img.naturalWidth) {
        current.dataset["pswpWidth"] = "" + img.naturalWidth;
        current.dataset["pswpHeight"] = "" + img.naturalHeight;
      }

      img.onload = (e) => {
        current.dataset["pswpWidth"] = "" + img.naturalWidth;
        current.dataset["pswpHeight"] = "" + img.naturalHeight;
      };
    }

    if (video) {
      current.href = video.querySelector('source')?.src || "";
      video.onloadedmetadata = (e) => {
        current.dataset["pswpWidth"] = "" + video.videoWidth;
        current.dataset["pswpHeight"] = "" + video.videoHeight;
      };
    }
  }, []);
  if (mimetype?.startsWith("video")) {
    return (
      <Container>
        <video preload="metadata">
          <source src={src} type={mimetype} />
          Your browser does not support the video tag.
        </video>
      </Container>
    );
  } else if (mimetype?.startsWith("audio")) {
    return (
      <audio controls preload="metadata">
        <source src={src} type={mimetype} />
        Your browser does not support the aduio tag.
      </audio>
    );
  }
  return (
    <Container>
      <figure suppressHydrationWarning className={cn({ "not-prose": preview })}>
        <img
          loading="lazy"
          className={cn({
            "w-full h-auto": !preview,
            "h-36 object-cover not-prose": preview,
            className,
          })}
          width={width || 800}
          height={height || 600}
          referrerPolicy="origin"
          {...props}
        />
        {!ignoreCaption && (
          <figcaption suppressHydrationWarning>{props.alt}</figcaption>
        )}
      </figure>
    </Container>
  );
}
