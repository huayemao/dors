"use client";

import React, { useState, useCallback } from "react";
import { Modal } from "@/components/Base/Modal";
import { BaseButton, BaseProgress } from "@glint-ui/react";
import {
  UploadCloudIcon,
  XIcon,
  CheckCircle2Icon,
  FileIcon,
  TagIcon,
  ImageIcon,
} from "lucide-react";
import { FileGroupItem } from "./types";
import { copyTextToClipboard, humanFileSize } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  groups: FileGroupItem[];
  defaultGroupId?: number | null;
  onSuccess: () => void;
}

export function UploadModal({
  open,
  onClose,
  groups,
  defaultGroupId,
  onSuccess,
}: Props) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    defaultGroupId ?? null
  );
  const [uploadOriginal, setUploadOriginal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<"idle" | "uploading" | "done">("idle");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFilesSelected = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles = Array.from(selectedFiles);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = useCallback(() => {
    if (files.length === 0) {
      toast.error("请先选择要上传的文件");
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.timeout = 400000;

    xhr.upload.addEventListener("loadstart", () => {
      setStage("uploading");
      setProgress(0);
      toast("开始上传文件...");
    });

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const val = Math.round((event.loaded / event.total) * 100);
        setProgress(val);
      }
    });

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    formData.append("uploadOriginal", uploadOriginal.toString());
    if (selectedGroupId) {
      formData.append("groupId", selectedGroupId.toString());
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setStage("done");
        toast.success(`成功上传 ${files.length} 个文件`);
        copyTextToClipboard(xhr.responseText);
        setTimeout(() => {
          onSuccess();
          onClose();
          // Reset
          setFiles([]);
          setStage("idle");
          setProgress(0);
        }, 1200);
      } else {
        toast.error("上传失败：" + xhr.statusText);
        setStage("idle");
      }
    });

    xhr.addEventListener("error", () => {
      toast.error("网络错误，上传失败");
      setStage("idle");
    });

    xhr.open("POST", "/api/files", true);
    xhr.send(formData);
  }, [files, uploadOriginal, selectedGroupId, onSuccess, onClose]);

  return (
    <Modal
      open={open}
      onClose={() => {
        if (stage !== "uploading") {
          onClose();
          setFiles([]);
          setStage("idle");
        }
      }}
      title={
        <div className="flex items-center gap-2">
          <UploadCloudIcon className="w-5 h-5 text-primary-500" />
          <span>上传文件</span>
        </div>
      }
      size="lg"
    >
      <div className="space-y-4">
        {/* 选择上传目标分组与原图选项 */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted-50 dark:bg-muted-900 border border-muted-200 dark:border-muted-800">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-muted-400" />
            <span className="text-xs font-medium text-muted-700 dark:text-muted-300">
              归入分组：
            </span>
            <select
              value={selectedGroupId ?? ""}
              onChange={(e) =>
                setSelectedGroupId(e.target.value ? parseInt(e.target.value, 10) : null)
              }
              className="text-xs px-2.5 py-1.5 rounded-lg border border-muted-300 dark:border-muted-700 bg-white dark:bg-muted-800 text-muted-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">未分组</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-600 dark:text-muted-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uploadOriginal}
              onChange={(e) => setUploadOriginal(e.target.checked)}
              className="rounded border-muted-300 text-primary-500 focus:ring-primary-500"
            />
            <span>上传原始图片（不进行 WebP 压缩）</span>
          </label>
        </div>

        {/* 拖拽上传区域 */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            handleFilesSelected(e.dataTransfer.files);
          }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragOver
              ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 scale-[1.01]"
              : "border-muted-300 dark:border-muted-700 hover:border-primary-400 bg-white dark:bg-muted-900"
          }`}
        >
          <input
            type="file"
            multiple
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={stage === "uploading"}
          />
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/50 text-primary-500 flex items-center justify-center mb-1">
              <UploadCloudIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-muted-800 dark:text-muted-100">
              点击或将文件拖拽至此处上传
            </p>
            <p className="text-xs text-muted-400">
              支持图片、音频、视频、PDF、文档等多种格式，支持多选批量上传
            </p>
          </div>
        </div>

        {/* 待上传文件列表 */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-700 dark:text-muted-300">
              <span>待上传文件 ({files.length})</span>
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-muted-400 hover:text-red-500"
                disabled={stage === "uploading"}
              >
                清空列表
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 p-1 rounded-xl bg-muted-50/50 dark:bg-muted-900/40 border border-muted-200 dark:border-muted-800">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-muted-800 border border-muted-200/60 dark:border-muted-700 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className="truncate font-medium text-muted-800 dark:text-muted-100">
                      {file.name}
                    </span>
                    <span className="text-muted-400 text-[11px] flex-shrink-0 font-mono">
                      ({humanFileSize(file.size)})
                    </span>
                  </div>
                  {stage !== "uploading" && (
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1 text-muted-400 hover:text-red-500 rounded"
                    >
                      <XIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 上传进度条 */}
        {stage === "uploading" && (
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-medium text-primary-600 dark:text-primary-400">
              <span>正在上传...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted-200 dark:bg-muted-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {stage === "done" && (
          <div className="flex items-center justify-center gap-2 py-3 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2Icon className="w-5 h-5" />
            <span>上传完成！Markdown 代码已复制到剪贴板</span>
          </div>
        )}

        {/* 底部按钮栏 */}
        <div className="pt-3 flex items-center justify-end gap-2 border-t border-muted-200 dark:border-muted-700">
          <button
            type="button"
            onClick={onClose}
            disabled={stage === "uploading"}
            className="px-4 py-2 text-xs font-medium rounded-lg text-muted-600 hover:bg-muted-100 dark:text-muted-300 dark:hover:bg-muted-800 transition-colors"
          >
            取消
          </button>
          <BaseButton
            type="button"
            color="primary"
            size="sm"
            onClick={handleUpload}
            loading={stage === "uploading"}
            disabled={files.length === 0 || stage === "uploading"}
          >
            {stage === "uploading" ? "上传中..." : `开始上传 (${files.length})`}
          </BaseButton>
        </div>
      </div>
    </Modal>
  );
}
