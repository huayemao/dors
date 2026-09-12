"use client";

import React from "react";
import {
  SearchIcon,
  XIcon,
  LayoutGridIcon,
  ListIcon,
  UploadIcon,
  Trash2Icon,
  FolderInputIcon,
  ArrowUpDownIcon,
  CheckSquareIcon,
  SquareIcon,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayersIcon,
} from "lucide-react";
import { BaseButton, BaseDropdown, BaseDropdownItem } from "@glint-ui/react";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  selectedCount: number;
  totalCountOnPage: number;
  isAllSelected: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBatchMove: () => void;
  onBatchDelete: () => void;
  onOpenUpload: () => void;
}

const TYPE_FILTERS = [
  { key: "all", label: "全部", icon: LayersIcon },
  { key: "image", label: "图片", icon: ImageIcon },
  { key: "video", label: "视频", icon: VideoIcon },
  { key: "audio", label: "音频", icon: MusicIcon },
  { key: "document", label: "文档", icon: FileTextIcon },
  { key: "other", label: "其他", icon: HelpCircleIcon },
];

const SORT_OPTIONS = [
  { key: "createdAt_desc", label: "最新上传" },
  { key: "createdAt_asc", label: "最早上传" },
  { key: "size_desc", label: "文件从大到小" },
  { key: "size_asc", label: "文件从小到大" },
  { key: "displayName_asc", label: "名称 A → Z" },
  { key: "displayName_desc", label: "名称 Z → A" },
];

export function FileToolbar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedCount,
  totalCountOnPage,
  isAllSelected,
  onSelectAll,
  onClearSelection,
  onBatchMove,
  onBatchDelete,
  onOpenUpload,
}: Props) {
  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.key === sortBy)?.label || "最新上传";

  return (
    <div className="space-y-3 w-full">
      {/* 顶部主工具栏：搜索、排序、视图切换、上传 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 搜索框 */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索文件名、原始显示名..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-muted-200 dark:border-muted-700 bg-white dark:bg-muted-900 text-muted-900 dark:text-white placeholder-muted-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all shadow-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted-100 dark:hover:bg-muted-800 text-muted-400 hover:text-muted-600"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 右侧控制：排序、视图切换、上传 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 排序下拉 */}
          <BaseDropdown
            variant="button"
            renderButton={() => (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-muted-200 dark:border-muted-700 bg-white dark:bg-muted-900 text-muted-700 dark:text-muted-200 hover:bg-muted-50 dark:hover:bg-muted-800 transition-colors shadow-sm"
              >
                <ArrowUpDownIcon className="w-3.5 h-3.5 text-muted-400" />
                <span>{currentSortLabel}</span>
              </button>
            )}
          >
            {SORT_OPTIONS.map((opt) => (
              <BaseDropdownItem
                key={opt.key}
                title={opt.label}
                onClick={() => onSortChange(opt.key)}
              />
            ))}
          </BaseDropdown>

          {/* 网格 / 列表视图切换 */}
          <div className="inline-flex p-1 rounded-xl bg-muted-100 dark:bg-muted-800 border border-muted-200 dark:border-muted-700">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-muted-900 text-primary-500 shadow-sm"
                  : "text-muted-500 hover:text-muted-800 dark:hover:text-muted-200"
              }`}
              title="卡片网格视图"
            >
              <LayoutGridIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-muted-900 text-primary-500 shadow-sm"
                  : "text-muted-500 hover:text-muted-800 dark:hover:text-muted-200"
              }`}
              title="详细列表视图"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          {/* 上传文件按钮 */}
          <button
            type="button"
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UploadIcon className="w-3.5 h-3.5" />
            <span>上传文件</span>
          </button>
        </div>
      </div>

      {/* 第二栏：文件类型筛选 Pills */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 flex-nowrap">
          {TYPE_FILTERS.map((f) => {
            const Icon = f.icon;
            const isActive = typeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => onTypeFilterChange(f.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700 font-semibold"
                    : "text-muted-600 dark:text-muted-300 hover:bg-muted-100 dark:hover:bg-muted-800 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* 全选快捷项 */}
        <button
          type="button"
          onClick={onSelectAll}
          className="text-xs font-medium text-muted-500 hover:text-primary-600 dark:text-muted-400 dark:hover:text-primary-400 inline-flex items-center gap-1 flex-shrink-0 px-2 py-1 rounded hover:bg-muted-100 dark:hover:bg-muted-800 transition-colors"
        >
          {isAllSelected ? (
            <>
              <CheckSquareIcon className="w-3.5 h-3.5 text-primary-500" />
              <span>全选 (已选本页)</span>
            </>
          ) : (
            <>
              <SquareIcon className="w-3.5 h-3.5" />
              <span>全选本页</span>
            </>
          )}
        </button>
      </div>

      {/* 批量操作浮层 (当有勾选项时展示) */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20">
              已选中 {selectedCount} 项
            </span>
            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs text-white/80 hover:text-white underline hover:no-underline"
            >
              取消选择
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBatchMove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FolderInputIcon className="w-3.5 h-3.5" />
              <span>移动到分组</span>
            </button>
            <button
              type="button"
              onClick={onBatchDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
            >
              <Trash2Icon className="w-3.5 h-3.5" />
              <span>批量删除</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
