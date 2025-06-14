"use client";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import mime from "mime";
import { useLayoutEffect, useRef } from "react";

interface FigureProps {
  src: string;
  width?: number;
  height?: number;
  ignoreCaption?: boolean;
  className?: string;
  preview?: boolean;
  alt?: string;
}

export function Figure({
  src,
  width,
  height,
  ignoreCaption,
  className,
  preview,
  alt,
  ...props
}: FigureProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mimetype = mime.getType(src);

  const Container = ({ children }: { children: React.ReactNode }) => (
    <a
      suppressHydrationWarning
      ref={ref}
      className={cn("!no-underline block", className)}
      data-pswp-width={width || 800}
      data-pswp-height={height || 600}
    >
      {children}
    </a>
  );

  useLayoutEffect(() => {
    if (!ref.current) return;
    const current = ref.current;

    const img = current.querySelector("img");
    const video = current.querySelector("video");
    
    if (img) {
      current.href = img.src || "";
      
      if (img.complete && img.naturalWidth) {
        current.dataset.pswpWidth = String(img.naturalWidth);
        current.dataset.pswpHeight = String(img.naturalHeight);
      }

      img.onload = () => {
        current.dataset.pswpWidth = String(img.naturalWidth);
        current.dataset.pswpHeight = String(img.naturalHeight);
      };
    }

    if (video) {
      const source = video.querySelector('source');
      current.href = source?.src || "";
      
      video.onloadedmetadata = () => {
        current.dataset.pswpWidth = String(video.videoWidth);
        current.dataset.pswpHeight = String(video.videoHeight);
      };
    }
  }, []);

  if (mimetype?.startsWith("video")) {
    return (
      <Container>
        <video 
          preload="metadata"
          className={cn({
            "w-full h-auto": !preview,
            "h-36 object-cover": preview,
          })}
          muted
          loop
          playsInline
        >
          <source src={src} type={mimetype} />
          Your browser does not support the video tag.
        </video>
      </Container>
    );
  }

  if (mimetype?.startsWith("audio")) {
    return (
      <audio controls preload="metadata" className="w-full">
        <source src={src} type={mimetype} />
        Your browser does not support the audio tag.
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
            "h-36 object-cover": preview,
          })}
          width={width || 800}
          height={height || 600}
          referrerPolicy="origin"
          src={src}
          alt={alt}
          {...props}
        />
        {!ignoreCaption && alt && (
          <figcaption suppressHydrationWarning>{alt}</figcaption>
        )}
      </figure>
    </Container>
  );
}
