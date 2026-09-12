import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const fileId = parseInt(params.id, 10);

  if (isNaN(fileId)) {
    return NextResponse.json({ error: "无效的文件ID" }, { status: 400 });
  }

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      select: {
        id: true,
        name: true,
        displayName: true,
        mimeType: true,
        size: true,
        groupId: true,
        createdAt: true,
        group: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: "文件不存在" }, { status: 404 });
    }

    const rawName = file.name;
    const encodedName = encodeURIComponent(file.name);

    // Search posts whose content contains rawName or encodedName
    const conditions: any[] = [
      { content: { contains: rawName } },
    ];
    if (encodedName !== rawName) {
      conditions.push({ content: { contains: encodedName } });
    }

    const matchingPosts = await prisma.posts.findMany({
      where: {
        OR: conditions,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        published_at: true,
        updated_at: true,
        content: true,
        cover_image: true,
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    // Also check if any post has this file in cover_image
    // cover_image is Json, might contain url with file.name
    const allMatchingPosts: typeof matchingPosts = [...matchingPosts];

    const postsResult = allMatchingPosts.map((post) => {
      const snippets: string[] = [];
      const content = post.content || "";
      const lines = content.split(/\r?\n/);

      let isCover = false;
      if (post.cover_image) {
        const coverStr = JSON.stringify(post.cover_image);
        if (coverStr.includes(rawName) || (encodedName !== rawName && coverStr.includes(encodedName))) {
          isCover = true;
          snippets.push("【作为文章题图 / 封面引用】");
        }
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.includes(rawName) || (encodedName !== rawName && line.includes(encodedName))) {
          // Format snippet, limit length
          const cleanSnippet = line.length > 300 ? line.slice(0, 300) + "..." : line;
          snippets.push(cleanSnippet);
          if (snippets.length >= 5) break;
        }
      }

      return {
        id: post.id,
        title: post.title || `文章 #${post.id}`,
        slug: post.slug,
        type: post.type,
        published_at: post.published_at,
        updated_at: post.updated_at,
        isCover,
        snippets,
      };
    });

    return NextResponse.json({
      file: {
        id: file.id,
        name: file.name,
        displayName: file.displayName,
        mimeType: file.mimeType,
        size: file.size ? file.size.toString() : null,
        group: file.group,
        createdAt: file.createdAt,
      },
      totalReferences: postsResult.length,
      posts: postsResult,
    });
  } catch (error: any) {
    console.error("Failed to query file references:", error);
    return NextResponse.json(
      { error: error.message || "查询引用失败" },
      { status: 500 }
    );
  }
}
