import prisma from "@/lib/prisma";
import {
  BaseCard,
  BaseDropdownItem,
  BaseList,
  BaseListItem,
} from "@shuriken-ui/react";
import { FileIcon, TrashIcon } from "lucide-react";
import { ActionDropdown } from "../../../components/ActionDropdown";
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
                <ActionDropdown>
                  <BaseDropdownItem>
                    <TrashIcon></TrashIcon>
                  </BaseDropdownItem>
                </ActionDropdown>
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
