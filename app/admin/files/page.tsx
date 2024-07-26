import prisma from "@/lib/prisma";
import { humanFileSize } from "@/lib/utils";
import {
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseList,
  BaseListItem,
} from "@shuriken-ui/react";
import { FileIcon, ImageIcon, TrashIcon } from "lucide-react";
import { UploadForm } from "../../../components/UploadForm";

export default async function UploadTest() {

  const list = await prisma.file.findMany({
    select: {
      id: true,
      name: true,
      size: true,
      mimeType: true,
    },
  });

  

  return (
    <div>
      <BaseCard className="py-4 pt-20 md:px-12 bg-white">
        <BaseList className="max-w-xl">
          {list.map((e) => (
            <BaseListItem
              key={e.id}
              title={e.name}
              subtitle={
                e.size ? humanFileSize(e.size / BigInt(8)) : "unknown size"
              }
              end={
                <BaseDropdown variant="context">
                  <BaseDropdownItem>
                    <TrashIcon></TrashIcon>
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
