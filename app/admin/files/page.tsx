import prisma from "@/lib/prisma";
import { humanFileSize } from "@/lib/utils";
import {
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseList,
  BaseListItem,
} from "@shuriken-ui/react";
import { FileIcon, TrashIcon } from "lucide-react";
import mime from "mime";
import { UploadForm } from "../../../components/UploadForm";

export default async function UploadTest() {
  const res =
    (await prisma.$queryRaw`SELECT id, LENGTH(data) AS size FROM File`) as {
      id: number;
      size: number;
    }[];

  console.log(res);

  const list = await prisma.file.findMany({
    select: {
      id: true,
      name: true,
      size: true,
      mimeType: true,
    },
  });

  if (res.length) {
    for (const { id, size } of list) {
      if (!size) {
        console.log(id);
        const trueSize = res.find((e) => e.id == id)?.size;
        if (!trueSize) {
          await prisma.file.delete({
            where: { id },
          });
        } else {
          await prisma.file.update({
            where: { id },
            data: {
              size: trueSize,
            },
          });
        }
      }
    }
  }

  for (const { id, name, mimeType } of list) {
    if (mimeType) {
      await prisma.file.update({
        where: { id },
        data: {
          mimeType: mime.getType(name) || "unknown",
        },
      });
    }
  }

  return (
    <div>
      <BaseCard className="py-4 pt-20 md:px-12 bg-white">
        <BaseList className="max-w-xl">
          {list.map((e) => (
            <BaseListItem
              key={e.id}
              title={e.name}
              subtitle={humanFileSize(e.size! / BigInt(8))}
              end={
                <BaseDropdown variant="context">
                  <BaseDropdownItem>
                    <TrashIcon></TrashIcon>
                  </BaseDropdownItem>
                </BaseDropdown>
              }
            >
              <FileIcon className="h-6 w-6"></FileIcon>
            </BaseListItem>
          ))}
        </BaseList>
      </BaseCard>
      <UploadForm />
    </div>
  );
}
