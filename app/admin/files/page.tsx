import prisma from "@/lib/prisma";
import mime from "mime";
import { ClientOnly } from "@/components/ClientOnly";
import { FileManagerClient } from "@/components/FileManager/FileManagerClient";
import { FileItem, FileGroupItem } from "@/components/FileManager/types";

const PER_PAGE = 24;

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    group?: string;
    sort?: string;
    type?: string;
  }>;
}

export default async function AdminFilesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const searchTerm = searchParams.search?.trim() || "";
  const groupParam = searchParams.group || "all";
  const sortParam = searchParams.sort || "createdAt_desc";
  const typeParam = searchParams.type || "all";

  // 构建查询条件
  const whereAndClauses: any[] = [];

  // 1. 搜索条件
  if (searchTerm) {
    whereAndClauses.push({
      OR: [
        { name: { contains: searchTerm } },
        { displayName: { contains: searchTerm } },
      ],
    });
  }

  // 2. 分组条件
  let parsedGroupId: number | null | "all" | "ungrouped" = "all";
  if (groupParam === "ungrouped") {
    parsedGroupId = "ungrouped";
    whereAndClauses.push({ groupId: null });
  } else if (groupParam && groupParam !== "all") {
    const gid = parseInt(groupParam, 10);
    if (!isNaN(gid)) {
      parsedGroupId = gid;
      whereAndClauses.push({ groupId: gid });
    }
  }

  // 3. 文件类型过滤
  if (typeParam === "image") {
    whereAndClauses.push({ mimeType: { startsWith: "image/" } });
  } else if (typeParam === "video") {
    whereAndClauses.push({ mimeType: { startsWith: "video/" } });
  } else if (typeParam === "audio") {
    whereAndClauses.push({ mimeType: { startsWith: "audio/" } });
  } else if (typeParam === "document") {
    whereAndClauses.push({
      mimeType: {
        in: [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      },
    });
  } else if (typeParam === "other") {
    whereAndClauses.push({
      NOT: [
        { mimeType: { startsWith: "image/" } },
        { mimeType: { startsWith: "video/" } },
        { mimeType: { startsWith: "audio/" } },
        {
          mimeType: {
            in: [
              "application/pdf",
              "text/plain",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-excel",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ],
          },
        },
      ],
    });
  }

  const whereClause = whereAndClauses.length > 0 ? { AND: whereAndClauses } : undefined;

  // 排序设置
  let orderBy: any = { createdAt: "desc" };
  switch (sortParam) {
    case "createdAt_asc":
      orderBy = { createdAt: "asc" };
      break;
    case "size_desc":
      orderBy = { size: "desc" };
      break;
    case "size_asc":
      orderBy = { size: "asc" };
      break;
    case "displayName_asc":
      orderBy = { displayName: "asc" };
      break;
    case "displayName_desc":
      orderBy = { displayName: "desc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // 并行拉取列表、过滤总数、所有分组统计、全量文件总数、未分组文件总数
  const [rawFiles, totalFilteredItems, rawGroups, totalCount, ungroupedCount] =
    await Promise.all([
      prisma.file.findMany({
        where: whereClause,
        orderBy,
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
        select: {
          id: true,
          name: true,
          displayName: true,
          size: true,
          mimeType: true,
          provider: true,
          groupId: true,
          createdAt: true,
          updatedAt: true,
          group: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      }),
      prisma.file.count({ where: whereClause }),
      prisma.fileGroup.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { files: true },
          },
        },
      }),
      prisma.file.count(),
      prisma.file.count({ where: { groupId: null } }),
    ]);

  await addMimeTypes(rawFiles);

  // 格式化输出，处理 BigInt 为字符串以避免客户端序列化报错
  const formattedFiles: FileItem[] = rawFiles.map((f) => ({
    id: f.id,
    name: f.name,
    displayName: f.displayName,
    size: f.size !== null && f.size !== undefined ? f.size.toString() : null,
    mimeType: f.mimeType,
    provider: f.provider,
    groupId: f.groupId,
    group: f.group,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  }));

  const formattedGroups: FileGroupItem[] = rawGroups.map((g) => ({
    id: g.id,
    name: g.name,
    color: g.color,
    count: g._count.files,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  }));

  return (
    <div className="w-full pb-10">
      <ClientOnly>
        <FileManagerClient
          files={formattedFiles}
          totalItems={totalFilteredItems}
          groups={formattedGroups}
          totalCount={totalCount}
          ungroupedCount={ungroupedCount}
          currentPage={page}
          perPage={PER_PAGE}
          currentSearch={searchTerm}
          currentGroupId={parsedGroupId}
          currentSort={sortParam}
          currentType={typeParam}
        />
      </ClientOnly>
    </div>
  );
}

async function addMimeTypes(
  list: {
    id: number;
    name: string;
    displayName?: string;
    size: bigint | null;
    mimeType: string;
  }[]
) {
  const lackMTIds = list.filter((e) => !e.mimeType || !e.mimeType.trim());
  const res = lackMTIds.map((e) => ({
    ...e,
    mimeType: mime.getType(e.name) || "application/octet-stream",
  }));

  if (res.length) {
    for (const item of res) {
      await prisma.file.updateMany({
        data: {
          mimeType: item.mimeType,
        },
        where: {
          id: item.id,
        },
      });
    }
  }
}
