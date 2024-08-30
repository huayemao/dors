import prisma from "@/lib/prisma";
import { humanFileSize } from "@/lib/utils";
import mime from 'mime'
import {
  BaseButton,
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseList,
  BaseListItem,
  BasePagination,
} from "@shuriken-ui/react";
import { FileIcon, ImageIcon } from "lucide-react";
import { UploadForm } from "@/components/UploadForm";
import { DeleteFileButton } from "./DeleteFileButton";
import { SITE_META } from "@/constants";
import LightBox from "@/components/Lightbox";
import { ClientOnly } from "@/components/ClientOnly";
import { Figure } from "@/components/Figure";
import { withPagination } from "@/lib/server/withPagination";

const PER_PAGE = 20;

export default async function UploadTest({ searchParams }) {

  const withPa = withPagination(prisma.file.findMany, () => ({
    page: searchParams.page || 1, perPage: PER_PAGE,
  }))

  const list = await withPa({
    select: {
      id: true,
      name: true,
      size: true,
      mimeType: true,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const totalItems = await prisma.file.count()

  await addMimeTypes(list);



  return (
    <div>
      <BaseCard shadow="flat" className="py-4 pt-20 md:px-12 bg-white">
        {/* todo: 定制这里面的样式 */}
        <BaseList className="max-w-md border p-4">
          {list.map((e, i) => (
            <>
              {/* @ts-ignore */}
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
                <div className="flex items-center w-10 h-10">
                  {e.mimeType.startsWith("image") ? (
                    // @ts-ignore
                    <Figure loading="lazy" ignoreCaption width={40} height={40} alt={e.name} src={encodeURI(`${SITE_META.url}/api/files/${e.name}`)} />
                  ) : (
                    <FileIcon strokeWidth={1} className="h-6 w-6"></FileIcon>
                  )}
                </div>
              </BaseListItem>
            </>
          ))}
        </BaseList>
      </BaseCard>
      <ClientOnly>
        <LightBox gallery=".nui-list"></LightBox>
      </ClientOnly>
      <UploadForm />
      <BasePagination routerQueryKey={'page'} totalItems={totalItems} itemPerPage={PER_PAGE} currentPage={searchParams.page} maxLinksDisplayed={5} rounded="full"></BasePagination>
    </div >
  );
}

async function addMimeTypes(list: { id: number; name: string; size: bigint | null; mimeType: string; }[]) {
  const lackMTIds = list.filter(e => !e.mimeType.trim());
  const res = list.filter(e => lackMTIds.includes(e)).map(e => {
    return {
      ...e,
      size: BigInt(e.size!),
      mimeType: mime.getType(e.name)
    };
  });

  if (res.length) {
    for (const item of res) {
      await prisma.file.updateMany({
        data: {
          mimeType: item.mimeType || ""
        },
        where: {
          id: item.id,
        }
      });
    }

  }
}

