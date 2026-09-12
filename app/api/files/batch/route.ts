import prisma from "@/lib/prisma";
import { getStorageManager } from "@/lib/storage/manager";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, fileIds, groupId } = body;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json({ error: "未选择任何文件" }, { status: 400 });
    }

    const ids = fileIds.map((id) => parseInt(id, 10)).filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return NextResponse.json({ error: "文件ID无效" }, { status: 400 });
    }

    if (action === "move") {
      let targetGroupId: number | null = null;
      if (groupId !== null && groupId !== undefined && groupId !== "") {
        targetGroupId = parseInt(groupId, 10);
        if (isNaN(targetGroupId)) {
          return NextResponse.json({ error: "无效的分组ID" }, { status: 400 });
        }
        // Check if target group exists
        const exists = await prisma.fileGroup.findUnique({
          where: { id: targetGroupId },
        });
        if (!exists) {
          return NextResponse.json({ error: "目标分组不存在" }, { status: 404 });
        }
      }

      const result = await prisma.file.updateMany({
        where: { id: { in: ids } },
        data: { groupId: targetGroupId },
      });

      return NextResponse.json({
        success: true,
        count: result.count,
      });
    }

    if (action === "delete") {
      // Find all files to be deleted
      const filesToDelete = await prisma.file.findMany({
        where: { id: { in: ids } },
        select: { id: true, name: true, provider: true },
      });

      const storageManager = getStorageManager();

      for (const file of filesToDelete) {
        if (file.provider === "pocketbase") {
          try {
            await storageManager.deleteFile(file.name, "pocketbase");
          } catch (e) {
            console.warn(`Failed to delete storage file ${file.name}:`, e);
          }
        }
      }

      const deleteResult = await prisma.file.deleteMany({
        where: { id: { in: ids } },
      });

      return NextResponse.json({
        success: true,
        count: deleteResult.count,
      });
    }

    return NextResponse.json({ error: "未知操作指令" }, { status: 400 });
  } catch (error: any) {
    console.error("Batch operation error:", error);
    return NextResponse.json(
      { error: error.message || "批量操作失败" },
      { status: 500 }
    );
  }
}
