"use client";

import React, { useState } from "react";
import { Modal } from "@/components/Base/Modal";
import { BaseButton } from "@glint-ui/react";
import { FolderIcon, MoveRightIcon, CheckIcon, LayersIcon } from "lucide-react";
import { FileGroupItem } from "./types";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  fileIds: number[];
  groups: FileGroupItem[];
  currentGroupId?: number | null;
  onSuccess: () => void;
}

export function MoveGroupModal({
  open,
  onClose,
  fileIds,
  groups,
  currentGroupId,
  onSuccess,
}: Props) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(
    currentGroupId ?? null
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileIds.length === 0) return;

    setSubmitting(true);
    try {
      if (fileIds.length === 1) {
        // Single file update
        const res = await fetch(`/api/files/${fileIds[0]}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: selectedGroupId }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "移动失败");
        }
      } else {
        // Batch move
        const res = await fetch("/api/files/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "move",
            fileIds,
            groupId: selectedGroupId,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "批量移动失败");
        }
      }

      toast.success(
        selectedGroupId
          ? `已移动 ${fileIds.length} 个文件到指定分组`
          : `已将 ${fileIds.length} 个文件移出分组`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "操作失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <MoveRightIcon className="w-5 h-5 text-primary-500" />
          <span>移动到分组 ({fileIds.length} 项)</span>
        </div>
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-muted-500 dark:text-muted-400">
          选择目标文件组，文件将被归类至该组以便分类查看与检索：
        </p>

        <div className="max-h-60 overflow-y-auto space-y-1.5 p-1">
          {/* 未分组选项 */}
          <button
            type="button"
            onClick={() => setSelectedGroupId(null)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left ${
              selectedGroupId === null
                ? "border-primary-500 bg-primary-50/70 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 font-medium"
                : "border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800 text-muted-700 dark:text-muted-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <LayersIcon className="w-5 h-5 text-muted-400" />
              <span>未分组 (移出当前组)</span>
            </div>
            {selectedGroupId === null && (
              <CheckIcon className="w-4 h-4 text-primary-500" />
            )}
          </button>

          {/* 各自定义分组 */}
          {groups.map((group) => {
            const isSelected = selectedGroupId === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroupId(group.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left ${
                  isSelected
                    ? "border-primary-500 bg-primary-50/70 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 font-medium"
                    : "border-muted-200 dark:border-muted-700 hover:bg-muted-50 dark:hover:bg-muted-800 text-muted-700 dark:text-muted-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: group.color || "#3b82f6" }}
                  />
                  <span className="truncate">{group.name}</span>
                  <span className="text-xs text-muted-400 font-normal">
                    ({group.count} 个文件)
                  </span>
                </div>
                {isSelected && (
                  <CheckIcon className="w-4 h-4 text-primary-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-muted-200 dark:border-muted-700">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-medium rounded-lg text-muted-600 hover:bg-muted-100 dark:text-muted-300 dark:hover:bg-muted-800 transition-colors"
          >
            取消
          </button>
          <BaseButton
            type="submit"
            color="primary"
            size="sm"
            loading={submitting}
            disabled={submitting}
          >
            确认移动
          </BaseButton>
        </div>
      </form>
    </Modal>
  );
}
