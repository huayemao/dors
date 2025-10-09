"use client";
import { copyTextToClipboard, humanFileSize, getDateStr } from "@/lib/utils";
import {
  BaseButton,
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseIconBox,
  BaseList,
  BaseListItem,
  BasePlaceload,
} from "@glint-ui/react";
import { CopyIcon, FileIcon, ImageIcon, TrashIcon } from "lucide-react";
import { SITE_META } from "@/constants";
import { Figure } from "@/components/Figure";
import { FileActions } from "./FileActions";
import { FileEditName } from "./FileEditName";
import { ClientOnly } from "./ClientOnly";
import { Suspense, use, useState } from "react";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { Modal } from "./Base/Modal";

export type FileItem = {
  id: number;
  name: string;
  displayName: string;
  size: bigint | null;
  mimeType: string;
  createdAt?: Date; // 添加上传时间字段
};

export function FileList({
  list,
  admin = false,
}: {
  list?: FileItem[];
  admin?: boolean;
}) {
  return <Content list={list} admin={admin} />;
}

function Content({
  list,
  admin = false,
}: {
  list?: FileItem[];
  admin?: boolean;
}) {
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // `use` 函数期望传入一个 Promise，而当前传入的是一个函数，这里直接使用 `use` 处理 `filesPromise`
  const fileItems = list;

  const handleEdit = (file: FileItem) => {
    console.log(1999);
    setEditingFile(file);
    setIsEditModalOpen(true);
  };

  // const handleUpdate = (fileId: number, newName: string) => {
  //   setFileItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === fileId ? { ...item, original_name: newName } : item
  //     )
  //   );
  // };

  // 添加分类状态
  const [fileTypeFilter, setFileTypeFilter] = React.useState<string>("all");

  // 按文件类型分类
  const categorizedFiles = React.useMemo(() => {
    if (fileTypeFilter === "all") {
      return fileItems;
    }

    return fileItems?.filter((file) => {
      if (fileTypeFilter === "image") {
        return file.mimeType.startsWith("image/");
      } else if (fileTypeFilter === "video") {
        return file.mimeType.startsWith("video/");
      } else if (fileTypeFilter === "audio") {
        return file.mimeType.startsWith("audio/");
      } else if (fileTypeFilter === "document") {
        const docTypes = [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        return docTypes.includes(file.mimeType);
      } else if (fileTypeFilter === "other") {
        return (
          !file.mimeType.startsWith("image/") &&
          !file.mimeType.startsWith("video/") &&
          !file.mimeType.startsWith("audio/") &&
          ![
            "application/pdf",
            "text/plain",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ].includes(file.mimeType)
        );
      }
      return true;
    });
  }, [fileItems, fileTypeFilter]);

  return (
    <div className="w-full">
      {/* 文件类型过滤按钮组 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <BaseButton
          variant={fileTypeFilter === "all" ? "solid" : "pastel"}
          size="sm"
          onClick={() => setFileTypeFilter("all")}
        >
          全部文件
        </BaseButton>
        <BaseButton
          variant={fileTypeFilter === "image" ? "solid" : "pastel"}
          size="sm"
          onClick={() => setFileTypeFilter("image")}
        >
          图片
        </BaseButton>
        <BaseButton
          variant={fileTypeFilter === "video" ? "solid" : "pastel"}
          size="sm"
          onClick={() => setFileTypeFilter("video")}
        >
          视频
        </BaseButton>
        <BaseButton
          variant={fileTypeFilter === "audio" ? "solid" : "pastel"}
          size="sm"
          onClick={() => setFileTypeFilter("audio")}
        >
          音频
        </BaseButton>
        <BaseButton
          variant={fileTypeFilter === "document" ? "solid" : "pastel"}
          size="sm"
          onClick={() => setFileTypeFilter("document")}
        >
          文档
        </BaseButton>
        <BaseButton
          variant={fileTypeFilter === "other" ? "solid" : "pastel"}
          size="sm"
          onClick={() => setFileTypeFilter("other")}
        >
          其他
        </BaseButton>
      </div>

      <BaseList className="w-full">
        {categorizedFiles?.map((e, i) => {
          const sizeStr = e.size ? humanFileSize(e.size) : "unknown size";
          // 格式化上传时间
          const uploadTime = e.createdAt
            ? getDateStr(new Date(e.createdAt))
            : "未知时间";
          return (
            <BaseListItem
              key={e.id}
              //  @ts-ignore
              title={
                <span className="truncate inline-block max-w-[12em] md:max-w-xs">
                  {e.name}
                </span>
              }
              subtitle={["#" + e.id, sizeStr, e.mimeType, uploadTime].join(
                "  "
              )}
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
                      <ImageIcon
                        strokeWidth={1}
                        className="h-6 w-6"
                      ></ImageIcon>
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
    </div>
  );
}
