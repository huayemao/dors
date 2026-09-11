import prisma from "@/lib/prisma";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { getPexelImages, isDataURL } from "@/lib/utils";
import { getBlurImage, getImageBuffer, getSmallImage } from "../utils/image";

export const DEFAULT_COVERS = [
  "/img/covers/cover-1.svg",
  "/img/covers/cover-2.svg",
  "/img/covers/cover-3.svg",
  "/img/covers/cover-4.svg",
  "/img/covers/cover-5.svg",
  "/img/covers/cover-6.svg",
];

const FALLBACK_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export function getDefaultCoverObject(index?: number) {
  const idx =
    typeof index === "number"
      ? Math.abs(index) % DEFAULT_COVERS.length
      : Math.floor(Math.random() * DEFAULT_COVERS.length);
  const coverUrl = DEFAULT_COVERS[idx];
  return {
    id: 0,
    alt: "default cover",
    src: {
      tiny: coverUrl,
      large: coverUrl,
      small: coverUrl,
      medium: coverUrl,
      large2x: coverUrl,
      original: coverUrl,
      portrait: coverUrl,
      landscape: coverUrl,
    },
    url: coverUrl,
    dataURLs: {
      blur: FALLBACK_BLUR_DATA_URL,
      small: coverUrl,
    },
  };
}

export async function buildCoverImage(url: string) {
  if (!url || typeof url !== "string") {
    return getDefaultCoverObject();
  }

  // Fast path for local SVG covers
  if (url.startsWith("/img/covers/") || url.endsWith(".svg")) {
    return {
      src: {
        large: url,
      },
      dataURLs: {
        blur: FALLBACK_BLUR_DATA_URL,
        small: url,
      },
    };
  }

  try {
    const buffer = await getImageBuffer(url);
    const blur = await getBlurImage(buffer);
    const small = isDataURL(url) ? url : await getSmallImage(buffer);

    return {
      src: {
        large: url,
      },
      dataURLs: {
        blur,
        small,
      },
    };
  } catch (error) {
    console.warn(`Failed to build cover image for URL "${url}", falling back to preset:`, error);
    return getDefaultCoverObject();
  }
}

export async function buildDefaultCoverImage() {
  return getDefaultCoverObject();
}

export async function buildRandomCoverImage() {
  try {
    const imageData = await getPexelImages(1);
    const imageJson = imageData?.photos?.[0] as PexelsPhoto;

    if (imageJson && imageJson.src?.large) {
      const cover = await buildCoverImage(imageJson.src.large);
      return { ...imageJson, ...cover };
    }
  } catch (error) {
    console.warn("Failed to fetch Pexels image, using preset cover instead:", error);
  }

  return buildDefaultCoverImage();
}

export async function randomlyUpdatePhoto(id: number) {
  try {
    const cover_image = await buildRandomCoverImage();

    await prisma.posts.update({
      where: {
        id,
      },
      data: {
        cover_image,
      },
    });
    return cover_image;
  } catch (error) {
    console.error(`Failed to randomlyUpdatePhoto for post ${id}:`, error);
    return null;
  }
}
