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

// 智能媒体类型检测函数
function detectMediaType(src: string): string | null {
  // 1. 尝试使用mime库检测完整URL
  const mimeType = mime.getType(src);
  if (mimeType) {
    return mimeType;
  }

  // 2. 如果完整URL无法检测，尝试解析URL的path部分
  try {
    const url = new URL(src);
    const pathname = url.pathname;

    // 如果pathname有扩展名，用mime库检测
    if (pathname.includes(".")) {
      const pathMimeType = mime.getType(pathname);
      if (pathMimeType) {
        return pathMimeType;
      }
    }
  } catch (error) {
    // URL解析失败，返回null
  }

  return null;
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
  const mimetype = detectMediaType(src);

  const Container = ({ children }: { children: React.ReactNode }) => (
    <a
      href={src}
      ref={ref}
      className={cn(
        "!no-underline block",
        {
          "not-prose": preview,
        },
        className
      )}
      data-pswp-src={src}
      data-pswp-width={width || 800}
      data-pswp-height={height || 600}
    >
      <figure
        suppressHydrationWarning
      >
        {children}
      </figure>
    </a>
  );

  useLayoutEffect(() => {
    if (!ref.current) return;
    const current = ref.current;

    const img = current.querySelector("img");
    const video = current.querySelector("video");

    if (img) {
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
          src={src}
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
        {!ignoreCaption && alt && (
          <figcaption suppressHydrationWarning>{alt}</figcaption>
        )}
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
      <img
        data-pswp-src={src}
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
    </Container>
  );
}
