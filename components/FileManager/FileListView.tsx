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

export function FileListView({
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
        <FileTextIcon className="w-12 h-12 text-muted-300 dark:text-muted-600 mx-auto" />
        <p className="text-sm font-medium text-muted-700 dark:text-muted-200">
          暂无匹配文件
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-muted-200/80 dark:border-muted-800 bg-white dark:bg-muted-900 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-muted-200 dark:border-muted-800 bg-muted-50/50 dark:bg-muted-800/50 text-muted-500 dark:text-muted-400 font-medium">
              <th className="py-3 px-4 w-10 text-center">#</th>
              <th className="py-3 px-4 w-14 text-center">预览</th>
              <th className="py-3 px-4 min-w-[200px]">文件名</th>
              <th className="py-3 px-4 w-28">所属分组</th>
              <th className="py-3 px-4 w-24">文件大小</th>
              <th className="py-3 px-4 w-32">文章引用</th>
              <th className="py-3 px-4 w-32">上传时间</th>
              <th className="py-3 px-4 w-20 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted-100 dark:divide-muted-800">
            {files.map((file) => {
              const isSelected = selectedIds.includes(file.id);
              const isImage = file.mimeType.startsWith("image/");
              const uploadDate = file.createdAt
                ? getDateStr(new Date(file.createdAt))
                : "未知时间";

              return (
                <tr
                  key={file.id}
                  onClick={() => onToggleSelect(file.id)}
                  className={`cursor-pointer transition-colors hover:bg-muted-50 dark:hover:bg-muted-800/60 ${
                    isSelected
                      ? "bg-primary-50/40 dark:bg-primary-950/20"
                      : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onToggleSelect(file.id)}
                      className="p-1 rounded text-muted-400 hover:text-primary-500"
                    >
                      {isSelected ? (
                        <CheckSquareIcon className="w-4 h-4 text-primary-500" />
                      ) : (
                        <SquareIcon className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* 缩略图 */}
                  <td className="py-2 px-4 text-center">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted-100 dark:bg-muted-800 border border-muted-200/60 dark:border-muted-700 flex items-center justify-center mx-auto">
                      {isImage ? (
                        <img
                          src={`${SITE_META.url}/api/files/${file.name}?thumbnail=true`}
                          alt={file.displayName}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileIcon className="w-5 h-5 text-muted-400" />
                      )}
                    </div>
                  </td>

                  {/* 文件名 */}
                  <td className="py-3 px-4">
                    <div className="space-y-0.5 max-w-xs md:max-w-md">
                      <p className="font-semibold text-muted-900 dark:text-white truncate" title={file.displayName}>
                        {file.displayName}
                      </p>
                      <p className="text-[11px] text-muted-400 font-mono truncate" title={file.name}>
                        {file.name}
                      </p>
                    </div>
                  </td>

                  {/* 分组 */}
                  <td className="py-3 px-4">
                    {file.group ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-white truncate max-w-[100px]"
                        style={{ backgroundColor: file.group.color || "#3b82f6" }}
                      >
                        <TagIcon className="w-2.5 h-2.5 flex-shrink-0" />
                        <span className="truncate">{file.group.name}</span>
                      </span>
                    ) : (
                      <span className="text-muted-400 text-[11px]">未分组</span>
                    )}
                  </td>

                  {/* 大小 */}
                  <td className="py-3 px-4 font-mono text-muted-600 dark:text-muted-300">
                    {file.size ? humanFileSize(file.size) : "-"}
                  </td>

                  {/* 查看引用 */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onOpenReference(file)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/40 dark:hover:bg-primary-950/80 text-primary-600 dark:text-primary-400 transition-colors"
                    >
                      <BookOpenIcon className="w-3.5 h-3.5" />
                      <span>查看引用</span>
                    </button>
                  </td>

                  {/* 上传时间 */}
                  <td className="py-3 px-4 text-muted-500 dark:text-muted-400 whitespace-nowrap">
                    {uploadDate}
                  </td>

                  {/* 操作 */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleCopyMarkdown(file, e)}
                        className="p-1 rounded-md text-muted-400 hover:text-primary-500 hover:bg-muted-100 dark:hover:bg-muted-800 transition-colors"
                        title="复制 Markdown"
                      >
                        {copiedId === file.id ? (
                          <CheckIcon className="w-4 h-4 text-primary-500" />
                        ) : (
                          <CopyIcon className="w-4 h-4" />
                        )}
                      </button>

                      <BaseDropdown
                        fixed
                        placement="bottom-end"
                        classes={{
                          menu: "z-50 min-w-[170px] shadow-2xl border border-muted-200/80 dark:border-muted-700",
                        }}
                        renderButton={(open) => (
                          <button
                            type="button"
                            className={`p-1 rounded-md transition-colors ${
                              open
                                ? "bg-muted-200 dark:bg-muted-700 text-muted-900 dark:text-white ring-1 ring-primary-500"
                                : "text-muted-400 hover:text-muted-700 dark:hover:text-muted-200 hover:bg-muted-100 dark:hover:bg-muted-800"
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
