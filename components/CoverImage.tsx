import { SITE_META } from "@/constants";
import { isDataURL } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export interface CoverImageProps {
  src?:
    | string
    | {
        src?: { large?: string; small?: string; [key: string]: any };
        dataURLs?: { small?: string; large?: string; blur?: string; [key: string]: any };
        [key: string]: any;
      }
    | null
    | any;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  blurDataURL?: string;
  fallbackSrc?: string;
  priority?: boolean;
  unoptimized?: boolean;
}

export const DEFAULT_FALLBACK_COVER = "/img/covers/cover-1.svg";

/**
 * Normalizes input cover object or string into a valid URL string
 */
export function resolveCoverUrl(
  input?:
    | string
    | {
        src?: { large?: string; small?: string; [key: string]: any };
        dataURLs?: { small?: string; large?: string; [key: string]: any };
        [key: string]: any;
      }
    | null
    | any,
  fallback = DEFAULT_FALLBACK_COVER
): string {
  if (!input) return fallback;
  if (typeof input === "string") {
    return input.trim() || fallback;
  }
  return (
    input.src?.large ||
    input.src?.small ||
    input.dataURLs?.small ||
    fallback
  );
}

/**
 * Unified, safe cover image component.
 * Automatically chooses between native <img> and Next.js <Image>
 * while guaranteeing no null pointer exceptions or image loading crashes.
 */
export function CoverImage({
  src,
  alt = "Cover image",
  width,
  height,
  className,
  blurDataURL,
  fallbackSrc = DEFAULT_FALLBACK_COVER,
  priority,
  unoptimized,
}: CoverImageProps) {
  const url = resolveCoverUrl(src, fallbackSrc);

  const isNativeImg =
    isDataURL(url) ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.endsWith(".svg") ||
    url.includes(".svg?");

  if (isNativeImg) {
    return (
      <img
        src={url}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  const isExport = process.env.OUTPUT_MODE === "export";
  const shouldUnoptimize = unoptimized ?? (isExport || url.startsWith("/api"));
  const quality = url.includes(SITE_META.url) ? 100 : 80;

  return (
    <Image
      src={url}
      alt={alt}
      width={width || 512}
      height={height || 373}
      className={className}
      quality={quality}
      priority={priority}
      unoptimized={shouldUnoptimize}
      placeholder={blurDataURL ? "blur" : undefined}
      blurDataURL={blurDataURL || undefined}
    />
  );
}

export default CoverImage;
