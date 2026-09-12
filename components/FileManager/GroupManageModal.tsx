"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/Base/Modal";
import { BaseButton, BaseInput } from "@glint-ui/react";
import { FolderPlusIcon, EditIcon, CheckIcon } from "lucide-react";
import { FileGroupItem } from "./types";
import toast from "react-hot-toast";

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#ef4444", // red
  "#64748b", // slate
];

interface Props {
  open: boolean;
  onClose: () => void;
  groupToEdit?: FileGroupItem | null;
  onSuccess: () => void;
}

export function GroupManageModal({ open, onClose, groupToEdit, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (groupToEdit) {
        setName(groupToEdit.name);
        setColor(groupToEdit.color || "#3b82f6");
      } else {
        setName("");
        setColor("#3b82f6");
      }
    }
  }, [open, groupToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("请输入分组名称");
      return;
    }

    setSubmitting(true);
    try {
      if (groupToEdit) {
        // Update
        const res = await fetch(`/api/files/groups/${groupToEdit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed, color }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "修改失败");
        }
        toast.success("分组已更新");
      } else {
        // Create
        const res = await fetch("/api/files/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed, color }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "创建失败");
        }
        toast.success("分组创建成功");
      }
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
          {groupToEdit ? (
            <EditIcon className="w-5 h-5 text-primary-500" />
          ) : (
            <FolderPlusIcon className="w-5 h-5 text-primary-500" />
          )}
          <span>{groupToEdit ? "重命名分组" : "创建新文件组"}</span>
        </div>
      }
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-muted-700 dark:text-muted-300 mb-1.5">
            分组名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：文章配图、壁纸、文档资料..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-muted-300 dark:border-muted-700 bg-white dark:bg-muted-900 text-muted-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            autoFocus
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-700 dark:text-muted-300 mb-2">
            分组标签色
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-black/10 dark:border-white/10"
                style={{ backgroundColor: c }}
              >
                {color === c && <CheckIcon className="w-4 h-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-muted-200 dark:border-muted-700">
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
            {groupToEdit ? "保存修改" : "确认创建"}
          </BaseButton>
        </div>
      </form>
    </Modal>
  );
}
