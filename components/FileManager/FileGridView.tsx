"use client";

import React, { useState } from "react";
import { FileItem } from "./types";
import { SITE_META } from "@/constants";
import { copyTextToClipboard, humanFileSize, getDateStr } from "@/lib/utils";
import {
  FileIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  FileTextIcon,
  MoreVerticalIcon,
  CopyIcon,
  BookOpenIcon,
  EditIcon,
  UploadIcon,
  Trash2Icon,
  TagIcon,
  FolderInputIcon,
  CheckIcon,
  CheckSquareIcon,
  SquareIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { BaseDropdown, BaseDropdownItem } from "@glint-ui/react";
import toast from "react-hot-toast";

interface Props {
  files: FileItem[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onOpenReference: (file: FileItem) => void;
  onOpenEditName: (file: FileItem) => void;
  onOpenReupload: (file: FileItem) => void;
  onOpenMoveGroup: (file: FileItem) => void;
  onDeleteFile: (file: FileItem) => void;
}

export function FileGridView({
  files,
  selectedIds,
  onToggleSelect,
  onOpenReference,
  onOpenEditName,
  onOpenReupload,
  onOpenMoveGroup,
  onDeleteFile,
}: Props) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyMarkdown = (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const isImage = file.mimeType.startsWith("image/");
    const md = isImage
      ? `![${file.displayName}](/api/files/${file.name})`
      : `[${file.displayName}](/api/files/${file.name})`;
    copyTextToClipboard(md).then(() => {
      setCopiedId(file.id);
      toast.success("已复制 Markdown 代码");
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const handleCopyUrl = (file: FileItem) => {
    const url = `${SITE_META.url}/api/files/${file.name}`;
    copyTextToClipboard(url).then(() => {
      toast.success("已复制文件直链");
    });
  };

  if (files.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl bg-white dark:bg-muted-900 border border-dashed border-muted-200 dark:border-muted-800 space-y-3">
        <ImageIcon className="w-12 h-12 text-muted-300 dark:text-muted-600 mx-auto" />
        <p className="text-sm font-medium text-muted-700 dark:text-muted-200">
          暂无匹配文件
        </p>
        <p className="text-xs text-muted-400">
          尝试清空搜索条件或切换分组，也可以点击右上角上传新文件
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {files.map((file) => {
        const isSelected = selectedIds.includes(file.id);
        const isImage = file.mimeType.startsWith("image/");
        const isVideo = file.mimeType.startsWith("video/");
        const isAudio = file.mimeType.startsWith("audio/");
        const isDoc = [
          "application/pdf",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.mimeType);

        const uploadDate = file.createdAt
          ? getDateStr(new Date(file.createdAt))
          : "未知时间";

        return (
          <div
            key={file.id}
            onClick={() => onToggleSelect(file.id)}
            className={`group relative flex flex-col rounded-2xl border bg-white dark:bg-muted-900 cursor-pointer transition-all duration-200 hover:shadow-lg hover:z-20 focus-within:z-30 ${
              isSelected
                ? "border-primary-500 ring-2 ring-primary-500/20 shadow-md bg-primary-50/10 dark:bg-primary-950/10"
                : "border-muted-200/80 dark:border-muted-800 hover:border-muted-300 dark:hover:border-muted-700"
            }`}
          >
            {/* 顶部悬浮控制栏：勾选框与菜单 */}
            <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(file.id);
                }}
                className={`pointer-events-auto p-1 rounded-lg backdrop-blur-md transition-all ${
                  isSelected
                    ? "bg-primary-500 text-white shadow"
                    : "bg-white/80 dark:bg-muted-900/80 text-muted-400 hover:text-muted-700 dark:hover:text-white opacity-0 group-hover:opacity-100 shadow-sm"
                }`}
              >
                {isSelected ? (
                  <CheckSquareIcon className="w-4 h-4" />
                ) : (
                  <SquareIcon className="w-4 h-4" />
                )}
              </button>

              <div
                className="pointer-events-auto opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <BaseDropdown
                  fixed
                  placement="bottom-end"
                  classes={{
                    menu: "z-50 min-w-[170px] shadow-2xl border border-muted-200/80 dark:border-muted-700",
                  }}
                  renderButton={(open) => (
                    <button
                      type="button"
                      className={`p-1 rounded-lg backdrop-blur-md text-muted-600 dark:text-muted-300 hover:text-muted-900 dark:hover:text-white shadow-sm transition-colors ${
                        open ? "bg-white dark:bg-muted-800 ring-2 ring-primary-500" : "bg-white/80 dark:bg-muted-900/80"
                      }`}
                    >
                      <MoreVerticalIcon className="w-4 h-4" />
                    </button>
                  )}
                >
                  <BaseDropdownItem
                    start={<BookOpenIcon className="w-4 h-4 text-primary-500" />}
                    title="查看文章引用"
                    onClick={() => onOpenReference(file)}
                  />
                  <BaseDropdownItem
                    start={<CopyIcon className="w-4 h-4" />}
                    title="复制 Markdown"
                    onClick={(e) => handleCopyMarkdown(file, e as any)}
                  />
                  <BaseDropdownItem
                    start={<ExternalLinkIcon className="w-4 h-4" />}
                    title="复制文件直链"
                    onClick={() => handleCopyUrl(file)}
                  />
                  <BaseDropdownItem
                    start={<FolderInputIcon className="w-4 h-4" />}
                    title="修改所属分组"
                    onClick={() => onOpenMoveGroup(file)}
                  />
                  <BaseDropdownItem
                    start={<EditIcon className="w-4 h-4" />}
                    title="重命名显示名"
                    onClick={() => onOpenEditName(file)}
                  />
                  <BaseDropdownItem
                    start={<UploadIcon className="w-4 h-4" />}
                    title="重新上传替换"
                    onClick={() => onOpenReupload(file)}
                  />
                  <BaseDropdownItem
                    start={<Trash2Icon className="w-4 h-4 text-red-500" />}
                    title="删除文件"
                    onClick={() => onDeleteFile(file)}
                  />
                </BaseDropdown>
              </div>
            </div>

            {/* 预览展示区 */}
            <div className="relative aspect-[4/3] w-full rounded-t-2xl bg-muted-100/60 dark:bg-muted-800/50 flex items-center justify-center overflow-hidden border-b border-muted-100 dark:border-muted-800">
              {isImage ? (
                <img
                  src={`${SITE_META.url}/api/files/${file.name}?thumbnail=true`}
                  alt={file.displayName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback on thumbnail error
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : isVideo ? (
                <div className="flex flex-col items-center gap-1 text-purple-500">
                  <VideoIcon className="w-10 h-10 stroke-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
                    VIDEO
                  </span>
                </div>
              ) : isAudio ? (
                <div className="flex flex-col items-center gap-1 text-emerald-500">
                  <MusicIcon className="w-10 h-10 stroke-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                    AUDIO
                  </span>
                </div>
              ) : isDoc ? (
                <div className="flex flex-col items-center gap-1 text-blue-500">
                  <FileTextIcon className="w-10 h-10 stroke-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                    DOC
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-400">
                  <FileIcon className="w-10 h-10 stroke-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-muted-200 dark:bg-muted-700 text-muted-600 dark:text-muted-300">
                    FILE
                  </span>
                </div>
              )}

              {/* 分组标签浮标 */}
              {file.group && (
                <div className="absolute bottom-2 left-2 z-10">
                  <span
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-white shadow-sm"
                    style={{ backgroundColor: file.group.color || "#3b82f6" }}
                  >
                    <TagIcon className="w-2.5 h-2.5" />
                    <span className="truncate max-w-[80px]">{file.group.name}</span>
                  </span>
                </div>
              )}
            </div>

            {/* 文件信息与快捷操作 */}
            <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-1">
                <h5
                  className="text-xs font-semibold text-muted-800 dark:text-muted-100 truncate"
                  title={file.displayName}
                >
                  {file.displayName}
                </h5>
                <div className="flex items-center justify-between text-[11px] text-muted-400">
                  <span>{file.size ? humanFileSize(file.size) : "未知"}</span>
                  <span>{uploadDate}</span>
                </div>
              </div>

              {/* 快捷操作区 */}
              <div className="pt-2 border-t border-muted-100 dark:border-muted-800 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenReference(file);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[11px] font-medium bg-muted-100 hover:bg-primary-50 dark:bg-muted-800 dark:hover:bg-primary-950/40 text-muted-600 hover:text-primary-600 dark:text-muted-300 dark:hover:text-primary-400 transition-colors"
                  title="查看该文件在哪些文章中被引用"
                >
                  <BookOpenIcon className="w-3 h-3" />
                  <span>查看引用</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleCopyMarkdown(file, e)}
                  className="p-1 rounded-lg text-muted-500 hover:text-primary-600 hover:bg-muted-100 dark:hover:bg-muted-800 transition-colors"
                  title="复制 Markdown 引用代码"
                >
                  {copiedId === file.id ? (
                    <CheckIcon className="w-3.5 h-3.5 text-primary-500" />
                  ) : (
                    <CopyIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
