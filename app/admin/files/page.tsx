import prisma from "@/lib/prisma";
import {
  BaseButtonIcon,
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseList,
  BaseListItem,
} from "@shuriken-ui/react";
import { EllipsisIcon, FileIcon, TrashIcon } from "lucide-react";
import { UploadForm } from "../../../components/UploadForm";

export default async function UploadTest() {
  const list = await prisma.file.findMany({
    select: {
      id: true,
      name: true,
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
              end={
                <BaseDropdown
                  renderButton={
                    <BaseButtonIcon size="sm" rounded="full" className="h-5 w-5">
                      <EllipsisIcon></EllipsisIcon>
                    </BaseButtonIcon>
                  }
                >
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
