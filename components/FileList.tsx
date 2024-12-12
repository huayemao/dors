"use client";
import { copyTextToClipboard, humanFileSize } from "@/lib/utils";
import {
  BaseButton,
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseIconBox,
  BaseList,
  BaseListItem,
  BasePlaceload,
} from "@shuriken-ui/react";
import { CopyIcon, FileIcon, ImageIcon, TrashIcon } from "lucide-react";
import { SITE_META } from "@/constants";
import { Figure } from "@/components/Figure";
import { FileActions } from "./FileActions";
import { ClientOnly } from "./ClientOnly";
import { Suspense, use } from "react";

export type FileItem = {
  id: number;
  name: string;
  size: bigint | null;
  mimeType: string;
};

export function FileList({
  list,
  admin = false,
}: {
  list?: FileItem[];
  admin?: boolean;
}) {
  return (
    <Suspense
      fallback={
        <div>
          <BasePlaceload className="h-4 w-full rounded" />
          <BasePlaceload className="h-4 w-3/4 rounded" />
        </div>
      }
    >
      <Content list={list} admin={admin} />
    </Suspense>
  );
}

function Content({
  list,
  admin = false,
}: {
  list?: FileItem[];
  admin?: boolean;
}) {
  const filesPromise = list
    ? new Promise((resolve) => {
        resolve(list);
      })
    : fetch("/api/files/getLatestFile").then((res) => res.json());
  const fileItems: FileItem[] = use(filesPromise);

  return (
    <BaseList className="w-full">
      {fileItems.map((e, i) => {
        const sizeStr = e.size ? humanFileSize(e.size) : "unknown size";
        return (
          <BaseListItem
            key={e.id}
            //  @ts-ignore
            title={
              <span className="truncate inline-block max-w-[12em] md:max-w-xs">
                {e.name}
              </span>
            }
            subtitle={["#" + e.id, sizeStr, e.mimeType].join("  ")}
            end={
              <ClientOnly>
                <FileActions e={e} admin={admin} />
              </ClientOnly>
            }
          >
            <BaseDropdown
              variant="text"
              renderButton={() => (
                <BaseIconBox
                  mask="blob"
                  color="success"
                  rounded="none"
                  variant="pastel"
                  size="md"
                >
                  {e.mimeType.startsWith("image") ? (
                    // @ts-ignore
                    <ImageIcon strokeWidth={1} className="h-6 w-6"></ImageIcon>
                  ) : (
                    <FileIcon strokeWidth={1} className="h-6 w-6"></FileIcon>
                  )}
                </BaseIconBox>
              )}
            >
              <div>
                <Figure
                  ignoreCaption
                  alt={e.name}
                  src={encodeURI(`${SITE_META.url}/api/files/${e.name}`)}
                />
              </div>
            </BaseDropdown>
            {/* <Popover  className="relative">
                    <Popover.Button>
                        <div className="flex items-center w-10 h-10">
                            {e.mimeType.startsWith("image") ? (
                                // @ts-ignore
                                <ImageIcon strokeWidth={1} className="h-6 w-6"></ImageIcon>
                            ) : (
                                <FileIcon strokeWidth={1} className="h-6 w-6"></FileIcon>
                            )}
                        </div>
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10">
                        <BaseCard shadow="flat" className="w-64 h-48 grid grid-cols-2">
                            <Figure loading="lazy" ignoreCaption width={40} height={40} alt={e.name} src={encodeURI(`${SITE_META.url}/api/files/${e.name}`)} />
                        </BaseCard>
                    </Popover.Panel>
                </Popover> */}
          </BaseListItem>
        );
      })}
    </BaseList>
  );
}
