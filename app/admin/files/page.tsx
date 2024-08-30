import prisma from "@/lib/prisma";
import mime from 'mime'
import {
  BaseCard,
  BasePagination,
} from "@shuriken-ui/react";
import { UploadForm } from "@/components/UploadForm";
import LightBox from "@/components/Lightbox";
import { ClientOnly } from "@/components/ClientOnly";
import { withPagination } from "@/lib/server/withPagination";
import { FileList } from "./FileList";

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
      createdAt: 'desc'
    }
  });

  const totalItems = await prisma.file.count()

  await addMimeTypes(list);



  return (
    <div className="md:px-12">
      <div className="grid lg:grid-cols-2 py-4 gap-4">
        <BaseCard shadow="flat" className="p-4">
          <FileList list={list}></FileList>
        </BaseCard>
        <BaseCard shadow="flat" className="p-4">
          <UploadForm />
        </BaseCard>
      </div>
      <ClientOnly>
        <LightBox gallery=".nui-list"></LightBox>
      </ClientOnly>
      <BasePagination classes={{ wrapper: 'lg:col-span-2' }} routerQueryKey={'page'} totalItems={totalItems} itemPerPage={PER_PAGE} currentPage={searchParams.page} maxLinksDisplayed={5} rounded="full"></BasePagination>
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

