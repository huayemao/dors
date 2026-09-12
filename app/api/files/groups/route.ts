import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [groups, totalCount, ungroupedCount] = await Promise.all([
      prisma.fileGroup.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { files: true },
          },
        },
      }),
      prisma.file.count(),
      prisma.file.count({
        where: { groupId: null },
      }),
    ]);

    const formattedGroups = groups.map((g) => ({
      id: g.id,
      name: g.name,
      color: g.color,
      count: g._count.files,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    }));

    return NextResponse.json({
      groups: formattedGroups,
      totalCount,
      ungroupedCount,
    });
  } catch (error: any) {
    console.error("Failed to fetch file groups:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const color = body.color?.trim() || null;

    if (!name) {
      return NextResponse.json(
        { error: "分组名称不能为空" },
        { status: 400 }
      );
    }

    // Check if group already exists
    const existing = await prisma.fileGroup.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: "已存在同名分组" },
        { status: 400 }
      );
    }

    const newGroup = await prisma.fileGroup.create({
      data: {
        name,
        color,
      },
    });

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create file group:", error);
    return NextResponse.json(
      { error: error.message || "创建分组失败" },
      { status: 500 }
    );
  }
}
