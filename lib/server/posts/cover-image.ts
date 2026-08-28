import prisma from "@/lib/prisma";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { getPexelImages, isDataURL } from "@/lib/utils";
import { getBlurImage, getImageBuffer, getSmallImage } from "../utils/image";

export async function buildCoverImage(url: string) {
  const buffer = await getImageBuffer(url);
  return {
    src: {
      large: url,
    },
    dataURLs: {
      blur: await getBlurImage(buffer),
      small: isDataURL(url) ? url : await getSmallImage(buffer),
    },
  };
}

async function buildDefaultCoverImage() {
  const defaultImageUrl = 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg';
  return await buildCoverImage(defaultImageUrl);
}

export async function buildRandomCoverImage() {
  try {
    const imageData = await getPexelImages(1);
    const imageJson = imageData?.photos?.[0] as PexelsPhoto;
    
    if (imageJson && imageJson.src?.large) {
      return { ...imageJson, ...(await buildCoverImage(imageJson.src.large)) };
    }
  } catch (error) {
    console.error('Failed to fetch Pexels image:', error);
    return await buildDefaultCoverImage();
  }
  
  return await buildDefaultCoverImage();
}

export async function randomlyUpdatePhoto(id: number) {
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
}
