import { getPrismaPaginationParams, PaginateOptions } from "@/lib/paginator";
import prisma from "@/lib/prisma";
import { humanFileSize } from "@/lib/utils";
import mime from 'mime'
import {
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseList,
  BaseListItem,
} from "@shuriken-ui/react";
import { FileIcon, ImageIcon } from "lucide-react";
import { UploadForm } from "../../../components/UploadForm";
import { DeleteFileButton } from "./DeleteFileButton";

function withPagination<T, P>(fn: (args: P) => Promise<T>, getPaginationOption: () => PaginateOptions) {
  return async function (args: P): Promise<T> {
    const { take, skip } = getPrismaPaginationParams(getPaginationOption());
    return await fn({
      ...args,
      take,
      skip,
    })
  }

}

export default async function UploadTest({ searchParams }) {
  const withPa = withPagination(prisma.file.findMany, () => ({
    page: searchParams.page || 1, perPage: 20,
  }))
  const list = await withPa({
    select: {
      id: true,
      name: true,
      size: true,
      mimeType: true,
    },
  });

  const lackMTIds = list.filter(e => !e.mimeType.trim());
  const res = list.filter(e => lackMTIds.includes(e)).map(e => {
    return {
      ...e,
      size: BigInt(e.size!),
      mimeType: mime.getType(e.name)
    }
  })

  if (res.length) {
    for (const item of res) {
      await prisma.file.updateMany({
        data: {
          mimeType: item.mimeType || ""
        },
        where: {
          id: item.id,
        }
      })
    }

  }



  return (
    <div>
      <BaseCard shadow="flat" className="py-4 pt-20 md:px-12 bg-white">
        {/* todo: 定制这里面的样式 */}
        <BaseList className="max-w-md border">
          {list.map((e) => (
            <BaseListItem
              key={e.id}
              title={e.name}
              subtitle={
                e.size ? humanFileSize(e.size / BigInt(8)) : "unknown size" + e.mimeType
              }
              end={
                <BaseDropdown variant="context">
                  <BaseDropdownItem>
                    <DeleteFileButton file={e}></DeleteFileButton>
                  </BaseDropdownItem>
                </BaseDropdown>
              }
            >
              <div className="flex items-center">
                {e.mimeType.startsWith("image") ? (
                  <ImageIcon
                    strokeWidth={1}
                    className="h-6 w-6 text-success-600"
                  ></ImageIcon>
                ) : (
                  <FileIcon strokeWidth={1} className="h-6 w-6"></FileIcon>
                )}
              </div>
            </BaseListItem>
          ))}
        </BaseList>
      </BaseCard>
      <UploadForm />
    </div>
  );
}

