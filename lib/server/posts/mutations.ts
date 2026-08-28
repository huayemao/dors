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

  const shouldChangeCoverImage =
    cover_image_url || !(post?.cover_image as any).dataURLs?.blur;

  const coverImage = shouldChangeCoverImage
    ? await buildCoverImage(
      cover_image_url || (post?.cover_image as any).src.large
    )
    : undefined;

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
      cover_image:
        changePhoto === "on" ? await buildRandomCoverImage() : coverImage,
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
  const { content, excerpt, title, categoryId, tags, isProtected, type, toc } = params;

  let coverImage: any;

  const images = content!.match(/!\[([^\]]+)\]\(([^)]+)\)/g);

  if (images) {
    const urlRegex =
      /(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/;
    const url = images[0].match(urlRegex)?.[0];
    if (url) {
      coverImage = await buildCoverImage(url);
    } else {
      coverImage = await buildRandomCoverImage();
    }
  }

  const post = await prisma.posts.create({
    data: {
      type,
      excerpt: excerpt as string,
      content: content as string,
      title: title as string,
      created_at: new Date(),
      updated_at: new Date(),
      posts_category_links: {
        create: {
          category_id: parseInt(categoryId as string),
        },
      },
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
