import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const groupId = parseInt(params.id, 10);

  if (isNaN(groupId)) {
    return NextResponse.json({ error: "无效的分组ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const name = body.name?.trim();
    const color = body.color !== undefined ? body.color?.trim() || null : undefined;

    const dataToUpdate: { name?: string; color?: string | null } = {};

    if (name) {
      // Check collision
      const existing = await prisma.fileGroup.findFirst({
        where: {
          name,
          NOT: { id: groupId },
        },
      });
      if (existing) {
        return NextResponse.json({ error: "已存在同名分组" }, { status: 400 });
      }
      dataToUpdate.name = name;
    }

    if (color !== undefined) {
      dataToUpdate.color = color;
    }

    const updated = await prisma.fileGroup.update({
      where: { id: groupId },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update file group:", error);
    return NextResponse.json(
      { error: error.message || "更新分组失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const groupId = parseInt(params.id, 10);

  if (isNaN(groupId)) {
    return NextResponse.json({ error: "无效的分组ID" }, { status: 400 });
  }

  try {
    // Ungroup files first to be safe
    await prisma.file.updateMany({
      where: { groupId },
      data: { groupId: null },
    });

    await prisma.fileGroup.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete file group:", error);
    return NextResponse.json(
      { error: error.message || "删除分组失败" },
      { status: 500 }
    );
  }
}
