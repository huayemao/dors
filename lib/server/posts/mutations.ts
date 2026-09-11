import prisma, { tags } from "@/lib/prisma";
import { getPost } from "./queries";
import { updatePostTags } from "../services/tags";
import { buildCoverImage, buildRandomCoverImage } from "./cover-image";
import { PostPayload, CreatePostPayload } from "./types";

export async function updatePost(
  post: Awaited<ReturnType<typeof getPost>>,
  params: PostPayload
) {
  const {
    id,
    content,
    excerpt,
    title,
    categoryId,
    tags,
    isProtected,
    type,
    slug,
    updated_at,
    created_at,
    changePhoto,
    cover_image_url,
    toc,
    meta,
  } = params;

  const postTagNames = post?.tags.map((e) => e?.name) as string[];

  if (tags && tags.sort().toString() !== postTagNames.sort().toString()) {
    const existedTags = await prisma.tags.findMany({
      where: {
        name: {
          in: tags as string[],
        },
      },
    });

    const tagsIds = await addTags(tags, existedTags);
    await updatePostTags(post, tagsIds);
  }

  const currentCover = post?.cover_image as any;
  const shouldChangeCoverImage =
    Boolean(cover_image_url) || !currentCover?.dataURLs?.blur;

  let coverImage: any = undefined;
  if (changePhoto === "on") {
    coverImage = await buildRandomCoverImage();
  } else if (shouldChangeCoverImage) {
    const targetUrl = cover_image_url || currentCover?.src?.large;
    if (targetUrl) {
      coverImage = await buildCoverImage(targetUrl);
    }
  }

  const res = await prisma.posts.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      type,
      slug: slug || undefined,
      protected: isProtected,
      excerpt: typeof excerpt == "string" ? (excerpt as string) : undefined,
      content: content ? (content as string) : undefined,
      title: title ? (title as string) : undefined,
      cover_image: coverImage !== undefined ? coverImage : undefined,
      updated_at: updated_at ? new Date(updated_at as string) : new Date(),
      created_at: created_at ? new Date(created_at as string) : undefined,
      toc: toc?.map(e => ({ id: Number(e) })) || undefined,
      meta: meta || undefined,
      tags_posts_links: {},
      posts_category_links: categoryId
        ? {
          deleteMany: { post_id: parseInt(id as string) },
          create: {
            category_id: parseInt(categoryId as string),
          },
        }
        : undefined,
    },
  });

  return res;
}

export async function createPost(params: CreatePostPayload) {
  const { content, excerpt, title, categoryId, tags, isProtected, type, toc, cover_image_url } = params;

  let coverImage: any;

  if (cover_image_url) {
    coverImage = await buildCoverImage(cover_image_url);
  } else if (content) {
    const images = content.match(/!\[([^\]]*)\]\(([^)]+)\)/g);
    if (images && images.length > 0) {
      const match = images[0].match(/!\[([^\]]*)\]\(([^)]+)\)/);
      const url = match?.[2]?.trim();
      if (url) {
        coverImage = await buildCoverImage(url);
      }
    }
  }

  if (!coverImage || !coverImage.src?.large) {
    coverImage = await buildRandomCoverImage();
  }

  const post = await prisma.posts.create({
    data: {
      type,
      excerpt: excerpt as string,
      content: content as string,
      title: title as string,
      created_at: new Date(),
      updated_at: new Date(),
      posts_category_links: categoryId ? {
        create: {
          category_id: parseInt(categoryId as string),
        },
      } : undefined,
      cover_image: coverImage,
      protected: isProtected,
      toc: toc?.map(e => ({ id: Number(e) })) || undefined,
    },
  });

  if (tags?.length) {
    const existedTags = await prisma.tags.findMany({
      where: {
        name: {
          in: tags as string[],
        },
      },
    });

    const tagsIds = await addTags(tags, existedTags);
    await updatePostTags(await getPost(post.id), tagsIds);
  }
  return post;
}

async function addTags(tags: string[], existedTags: tags[]) {
  const tagsToAdd = tags.filter(
    (t) => !existedTags.map((e) => e.name).includes(t as string)
  );

  await prisma.tags.createMany({
    data: tagsToAdd.map((t) => ({
      name: t as string,
    })),
  });

  const tagsIds = (
    await prisma.tags.findMany({
      where: {
        name: {
          in: tags as string[],
        },
      },
      select: {
        id: true,
      },
    })
  ).map((e) => e.id);
  return tagsIds;
}
