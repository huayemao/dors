"use client";

import React, { useState } from "react";
import { FileGroupItem, GroupSelectType } from "./types";
import {
  FolderIcon,
  FolderPlusIcon,
  LayersIcon,
  MoreVerticalIcon,
  Edit2Icon,
  Trash2Icon,
  TagIcon,
  CheckIcon,
  Link2OffIcon,
} from "lucide-react";
import { BaseDropdown, BaseDropdownItem } from "@glint-ui/react";
import toast from "react-hot-toast";

interface Props {
  groups: FileGroupItem[];
  totalCount: number;
  ungroupedCount: number;
  unreferencedCount: number;
  selectedGroupId: GroupSelectType;
  onSelectGroup: (groupId: GroupSelectType) => void;
  onOpenCreateGroup: () => void;
  onOpenEditGroup: (group: FileGroupItem) => void;
  onRefresh: () => void;
}

export function GroupSidebar({
  groups,
  totalCount,
  ungroupedCount,
  unreferencedCount,
  selectedGroupId,
  onSelectGroup,
  onOpenCreateGroup,
  onOpenEditGroup,
  onRefresh,
}: Props) {
  const handleDeleteGroup = async (group: FileGroupItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`确定要解散分组「${group.name}」吗？\n注意：组内文件不会被删除，将自动转为「未分组」。`)) {
      return;
    }

    try {
      const res = await fetch(`/api/files/groups/${group.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "删除失败");
      }
      toast.success("分组已解散");
      if (selectedGroupId === group.id) {
        onSelectGroup("all");
      }
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "删除失败");
    }
  };

  return (
    <div className="w-full flex flex-col h-full space-y-4">
      {/* 侧边栏标题与创建按钮 */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-2">
          <FolderIcon className="w-4 h-4 text-primary-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-500 dark:text-muted-400">
            文件分组
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenCreateGroup}
          className="p-1 rounded-md text-muted-500 hover:text-primary-600 hover:bg-muted-100 dark:hover:bg-muted-800 transition-colors"
          title="新建文件组"
        >
          <FolderPlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 预设固定导航项 */}
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onSelectGroup("all")}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
            selectedGroupId === "all" || selectedGroupId === null
              ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
              : "text-muted-700 dark:text-muted-200 hover:bg-muted-100 dark:hover:bg-muted-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FolderIcon className="w-4 h-4" />
            <span>全部文件</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              selectedGroupId === "all" || selectedGroupId === null
                ? "bg-white/20 text-white"
                : "bg-muted-200 dark:bg-muted-700 text-muted-600 dark:text-muted-300"
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectGroup("ungrouped")}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
            selectedGroupId === "ungrouped"
              ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
              : "text-muted-700 dark:text-muted-200 hover:bg-muted-100 dark:hover:bg-muted-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayersIcon className="w-4 h-4" />
            <span>未分组</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              selectedGroupId === "ungrouped"
                ? "bg-white/20 text-white"
                : "bg-muted-200 dark:bg-muted-700 text-muted-600 dark:text-muted-300"
            }`}
          >
            {ungroupedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectGroup("unreferenced")}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
            selectedGroupId === "unreferenced"
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 font-bold"
              : "text-muted-700 dark:text-muted-200 hover:bg-muted-100 dark:hover:bg-muted-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Link2OffIcon className={`w-4 h-4 ${selectedGroupId === "unreferenced" ? "text-white" : "text-amber-500"}`} />
            <span>未被引用</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              selectedGroupId === "unreferenced"
                ? "bg-white/25 text-white"
                : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300"
            }`}
          >
            {unreferencedCount}
          </span>
        </button>
      </div>

      <div className="border-t border-muted-200 dark:border-muted-700 my-1" />

      {/* 自定义分组列表 */}
      <div className="space-y-1 flex-1 overflow-y-auto max-h-[500px] pr-1">
        <div className="px-2 py-1 text-[11px] font-medium text-muted-400 uppercase tracking-wider">
          我的分组 ({groups.length})
        </div>

        {groups.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-muted-400 space-y-2 border border-dashed border-muted-200 dark:border-muted-800 rounded-xl">
            <p>暂无自定义分组</p>
            <button
              type="button"
              onClick={onOpenCreateGroup}
              className="text-primary-500 hover:underline inline-flex items-center gap-1 text-xs"
            >
              <FolderPlusIcon className="w-3.5 h-3.5" />
              创建第一个分组
            </button>
          </div>
        ) : (
          groups.map((group) => {
            const isSelected = selectedGroupId === group.id;
            return (
              <div
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className={`group w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                    : "text-muted-700 dark:text-muted-200 hover:bg-muted-100 dark:hover:bg-muted-800"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125 ${
                      isSelected ? "ring-2 ring-white/60" : ""
                    }`}
                    style={{ backgroundColor: group.color || "#3b82f6" }}
                  />
                  <span className="truncate">{group.name}</span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-opacity ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-muted-200 dark:bg-muted-700 text-muted-600 dark:text-muted-300"
                    } ${!isSelected ? "group-hover:hidden" : ""}`}
                  >
                    {group.count}
                  </span>

                  {/* 悬浮操作按钮 */}
                  <div className={`items-center gap-0.5 ${!isSelected ? "hidden group-hover:flex" : "flex"}`}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditGroup(group);
                      }}
                      className={`p-1 rounded hover:bg-black/10 transition-colors ${
                        isSelected ? "text-white" : "text-muted-400 hover:text-muted-700 dark:hover:text-muted-200"
                      }`}
                      title="重命名分组"
                    >
                      <Edit2Icon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteGroup(group, e)}
                      className={`p-1 rounded hover:bg-red-500/20 transition-colors ${
                        isSelected ? "text-white hover:text-red-200" : "text-muted-400 hover:text-red-500"
                      }`}
                      title="解散分组"
                    >
                      <Trash2Icon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 底部快速新建分组按钮 */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenCreateGroup}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-xl border border-dashed border-muted-300 dark:border-muted-700 hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 text-muted-600 dark:text-muted-400 transition-all bg-muted-50/50 dark:bg-muted-800/30"
        >
          <FolderPlusIcon className="w-4 h-4" />
          <span>新建分组</span>
        </button>
      </div>
    </div>
  );
}
