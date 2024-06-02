import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidateHomePage } from "../updatePost/route";

export async function POST(request: Request) {
  const formData = await request.formData();
  const content = formData.get("content");
  const excerpt = formData.get("excerpt");
  const title = formData.get("title");
  const categoryId = formData.get("category_id");
  const tags = formData.has("tags") ? formData.getAll("tags") : undefined;

  const post = await createPost(
    content as string,
    excerpt as string,
    title as string,
    categoryId as string,
    tags as string[]
  );

  await revalidateHomePage(post.id);

  const origin = request.headers.get("Origin");

  const path = new URL(("/posts/" + post.id) as string, origin || request.url);

  return NextResponse.redirect(path, 303);
}

async function createPost(
  content: string,
  excerpt?: string,
  title?: string,
  categoryId?: string,
  tags?: string[]
) {
  const post = await prisma.posts.create({
    data: {
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

    await prisma.posts.update({
      where: {
        id: post.id,
      },
      data: {
        tags_posts_links: {
          createMany: {
            data: tagsIds.map((e) => ({
              tag_id: e,
            })),
          },
        },
      },
    });
  }
  return post;
}
