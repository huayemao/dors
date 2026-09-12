"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/Base/Modal";
import { FileItem, ReferenceData } from "./types";
import { copyTextToClipboard, humanFileSize, getDateStr } from "@/lib/utils";
import { SITE_META } from "@/constants";
import {
  ExternalLinkIcon,
  FileTextIcon,
  CopyIcon,
  CheckIcon,
  ImageIcon,
  Loader2Icon,
  EditIcon,
  TagIcon,
  BookOpenIcon,
  AlertCircleIcon,
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  file: FileItem | null;
  open: boolean;
  onClose: () => void;
}

export function FileReferenceModal({ file, open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReferenceData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !file) {
      setData(null);
      return;
    }

    setLoading(true);
    fetch(`/api/files/${file.id}/references`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          setData(res);
        }
      })
      .catch((err) => {
        toast.error("加载引用信息失败");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, file]);

  const handleCopy = (text: string, key: string) => {
    copyTextToClipboard(text).then(() => {
      setCopiedKey(key);
      toast.success("已复制到剪贴板");
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  if (!file) return null;

  const fileUrl = `${SITE_META.url}/api/files/${file.name}`;
  const isImage = file.mimeType.startsWith("image/");
  const mdImg = `![${file.displayName}](/api/files/${file.name})`;
  const mdLink = `[${file.displayName}](/api/files/${file.name})`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-primary-500" />
          <span>文件引用分析</span>
        </div>
      }
      size="2xl"
    >
      <div className="space-y-6">
        {/* 文件概要卡片 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-muted-50 dark:bg-muted-900/50 border border-muted-200 dark:border-muted-700">
          <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted-100 dark:bg-muted-800 flex items-center justify-center flex-shrink-0 border border-muted-200 dark:border-muted-700">
            {isImage ? (
              <img
                src={`${SITE_META.url}/api/files/${file.name}?thumbnail=true`}
                alt={file.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <FileTextIcon className="w-10 h-10 text-muted-400" />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-semibold text-muted-900 dark:text-white truncate text-base" title={file.displayName}>
              {file.displayName}
            </h4>
            <p className="text-xs text-muted-500 dark:text-muted-400 font-mono truncate" title={file.name}>
              {file.name}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-600 dark:text-muted-300 pt-1">
              <span className="px-2 py-0.5 rounded-full bg-muted-200/70 dark:bg-muted-800 font-medium">
                {file.size ? humanFileSize(file.size) : "未知大小"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-muted-200/70 dark:bg-muted-800">
                {file.mimeType}
              </span>
              {file.group && (
                <span className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-medium inline-flex items-center gap-1">
                  <TagIcon className="w-3 h-3" />
                  {file.group.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
            {isImage && (
              <button
                type="button"
                onClick={() => handleCopy(mdImg, "mdImg")}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/30 dark:hover:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/40 transition-colors"
              >
                {copiedKey === "mdImg" ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
                复制图片 Markdown
              </button>
            )}
            <button
              type="button"
              onClick={() => handleCopy(mdLink, "mdLink")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted-100 hover:bg-muted-200 dark:bg-muted-800 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-200 transition-colors"
            >
              {copiedKey === "mdLink" ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
              复制链接 Markdown
            </button>
          </div>
        </div>

        {/* 引用文章列表区 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold text-muted-800 dark:text-muted-100 flex items-center gap-2">
              <span>被引用文章</span>
              {data && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-bold">
                  {data.totalReferences} 篇
                </span>
              )}
            </h5>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-400 gap-3">
              <Loader2Icon className="w-8 h-8 animate-spin text-primary-500" />
              <p className="text-sm">正在检索全站文章引用记录...</p>
            </div>
          ) : !data || data.posts.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-muted-50/50 dark:bg-muted-900/30 border border-dashed border-muted-200 dark:border-muted-750 space-y-2">
              <AlertCircleIcon className="w-8 h-8 text-muted-400 mx-auto" />
              <p className="text-sm font-medium text-muted-700 dark:text-muted-200">
                暂未在任何文章中被引用
              </p>
              <p className="text-xs text-muted-400 max-w-sm mx-auto">
                该文件目前未通过 Markdown 图片或链接形式被文章收录，可放心替换、移动或删除。
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-xl border border-muted-200 dark:border-muted-700 bg-white dark:bg-muted-800/80 shadow-sm hover:border-primary-300 dark:hover:border-primary-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-muted-100 dark:bg-muted-700 text-muted-600 dark:text-muted-300">
                          #{post.id}
                        </span>
                        <h6 className="font-semibold text-muted-900 dark:text-white text-sm">
                          {post.title}
                        </h6>
                        {post.isCover && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
                            文章封面
                          </span>
                        )}
                        {post.published_at ? (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                            已发布
                          </span>
                        ) : (
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted-100 dark:bg-muted-700 text-muted-500">
                            草稿
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-400">
                        更新于 {post.updated_at ? getDateStr(new Date(post.updated_at)) : "未知"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`/admin/posts/${post.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-muted-100 hover:bg-muted-200 dark:bg-muted-700 dark:hover:bg-muted-600 text-muted-700 dark:text-muted-200 transition-colors"
                      >
                        <EditIcon className="w-3.5 h-3.5" />
                        <span>在后台编辑</span>
                      </a>
                      <a
                        href={post.slug ? `/${post.slug}` : `/posts/${post.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/40 dark:hover:bg-primary-950/80 text-primary-600 dark:text-primary-400 transition-colors"
                      >
                        <span>查看文章</span>
                        <ExternalLinkIcon className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* 引用上下文预览 */}
                  {post.snippets && post.snippets.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs text-muted-400 font-medium">引用代码 / 片段：</p>
                      <div className="space-y-1">
                        {post.snippets.map((snip, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded bg-muted-50 dark:bg-muted-900 border border-muted-200/60 dark:border-muted-800 text-xs font-mono text-muted-700 dark:text-muted-300 break-all select-all hover:bg-muted-100/70 dark:hover:bg-muted-900/80 transition-colors"
                          >
                            {snip}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
