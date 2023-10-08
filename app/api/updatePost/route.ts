import { getPost } from "@/lib/posts";
import prisma from "@/lib/prisma";
import { updatePostTags } from "@/lib/tags";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = formData.get("id");
  const content = formData.get("content");
  const title = formData.get("title");
  const changePhoto = formData.get("changePhoto");
  const categoryId = formData.get("category");
  const updated_at = formData.get("updated_at");
  const tags = formData.get("tags") ? formData.getAll("tags") : undefined;

  if (Number.isNaN(parseInt(id as string))) {
    return new NextResponse(
      JSON.stringify({
        success: false,
      }),
      {
        status: 400,
      }
    );
  }

  // todo: 判断 tags 是否已经存在？ 总都得先查询一下 post 的

  const post = await getPost(parseInt(id as string));

  if (!post) {
    return new NextResponse(
      JSON.stringify({
        success: false,
      }),
      {
        status: 400,
      }
    );
  }

  if (
    tags &&
    tags.sort().toString() !==
      post.tags
        .map((e) => e?.name)
        .sort()
        .toString()
  ) {
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

    updatePostTags(post, tagsIds);
  }
  // await prisma.tags.find; tags 也必须要查？或者如果对比结果相同就不用查

  // todo: 应该有 diff 的
  const res = await prisma.posts.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      content: content ? (content as string) : undefined,
      title: title ? (title as string) : undefined,
      cover_image: changePhoto === "on" ? {} : undefined,
      updated_at: updated_at ? new Date(updated_at as string) : new Date(),
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

  const origin = request.headers.get("Origin");

  const path = new URL(("/posts/" + id) as string, origin || request.url);

  return NextResponse.redirect(path);
}
