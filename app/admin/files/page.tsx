import prisma from "@/lib/prisma";
import mime from "mime";
import { BaseCard, BasePagination, BasePlaceload } from "@glint-ui/react";
import { UploadForm } from "@/components/UploadForm";
import { ClientOnly } from "@/components/ClientOnly";
import { withPagination } from "@/lib/server/withPagination";
import { FileList } from "@/components/FileList";
import { FileEditName } from "@/components/FileEditName";

const PER_PAGE = 20;

export default async function AdminFilesPage(
  props: {
    searchParams: Promise<{ page?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const getPaginatedFileList = withPagination(prisma.file.findMany, () => ({
    page: searchParams.page || 1,
    perPage: PER_PAGE,
  }));

  const list = await getPaginatedFileList({
    select: {
      id: true,
      name: true,
      displayName: true,
      size: true,
      mimeType: true,
      createdAt: true, // 添加createdAt字段用于显示上传时间
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalItems = await prisma.file.count();

  await addMimeTypes(list);

  return (
    <div className="md:px-12">
      <div className="grid lg:grid-cols-2 py-4 gap-4">
        <BaseCard shadow="flat" className="p-4">
          <ClientOnly>
            <FileList admin list={list}></FileList>
          </ClientOnly>
        </BaseCard>
        <BaseCard shadow="flat" className="p-4">
          <UploadForm />
        </BaseCard>
      </div>
      <BasePagination
        classes={{ wrapper: "lg:col-span-2" }}
        routerQueryKey={"page"}
        totalItems={totalItems}
        itemPerPage={PER_PAGE}
        currentPage={parseInt(searchParams.page || "1", 10)}
        maxLinksDisplayed={5}
        rounded="full"
      ></BasePagination>
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
  const lackMTIds = list.filter((e) => !e.mimeType.trim());
  const res = list
    .filter((e) => lackMTIds.includes(e))
    .map((e) => {
      return {
        ...e,
        size: BigInt(e.size!),
        mimeType: mime.getType(e.name),
      };
    });

  if (res.length) {
    for (const item of res) {
      await prisma.file.updateMany({
        data: {
          mimeType: item.mimeType || "",
        },
        where: {
          id: item.id,
        },
      });
    }
  }
}
