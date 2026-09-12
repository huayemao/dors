"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FileItem, FileGroupItem } from "./types";
import { GroupSidebar } from "./GroupSidebar";
import { FileToolbar } from "./FileToolbar";
import { FileGridView } from "./FileGridView";
import { FileListView } from "./FileListView";
import { FileReferenceModal } from "./FileReferenceModal";
import { GroupManageModal } from "./GroupManageModal";
import { MoveGroupModal } from "./MoveGroupModal";
import { UploadModal } from "./UploadModal";
import { FileEditName } from "../FileEditName";
import { FileReuploadModal } from "../FileReuploadModal";
import { Modal } from "../Base/Modal";
import { BaseCard, BasePagination } from "@glint-ui/react";
import toast from "react-hot-toast";

interface Props {
  files: FileItem[];
  totalItems: number;
  groups: FileGroupItem[];
  totalCount: number;
  ungroupedCount: number;
  currentPage: number;
  perPage: number;
  currentSearch: string;
  currentGroupId: number | null | "all" | "ungrouped";
  currentSort: string;
  currentType: string;
}

export function FileManagerClient({
  files,
  totalItems,
  groups,
  totalCount,
  ungroupedCount,
  currentPage,
  perPage,
  currentSearch,
  currentGroupId,
  currentSort,
  currentType,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 视图模式：grid 或 list，存储在 localStorage
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dors_file_view_mode");
      if (saved === "grid" || saved === "list") {
        setViewMode(saved);
      }
    } catch {}
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    try {
      localStorage.setItem("dors_file_view_mode", mode);
    } catch {}
  };

  // 本地搜索状态与即时更新
  const [search, setSearch] = useState(currentSearch);
  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  // 多选选中的文件 ID 列表
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 页面切换时清空勾选
  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage, currentGroupId, currentType, currentSearch]);

  // 各类弹窗状态
  const [referenceFile, setReferenceFile] = useState<FileItem | null>(null);
  const [editNameFile, setEditNameFile] = useState<FileItem | null>(null);
  const [reuploadFile, setReuploadFile] = useState<FileItem | null>(null);
  const [moveGroupFiles, setMoveGroupFiles] = useState<number[]>([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<FileGroupItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // 更新 URL 参数辅助函数
  const updateUrl = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // 搜索防抖与提交
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== currentSearch) {
        updateUrl({ search: search || null, page: "1" });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // 分组切换
  const handleSelectGroup = (groupId: number | null | "all" | "ungrouped") => {
    updateUrl({
      group:
        groupId === "all" || groupId === null
          ? null
          : groupId === "ungrouped"
          ? "ungrouped"
          : String(groupId),
      page: "1",
    });
  };

  // 类型过滤切换
  const handleTypeFilterChange = (type: string) => {
    updateUrl({
      type: type === "all" ? null : type,
      page: "1",
    });
  };

  // 排序切换
  const handleSortChange = (sort: string) => {
    updateUrl({
      sort: sort === "createdAt_desc" ? null : sort,
      page: "1",
    });
  };

  // 全选/取消全选本页
  const isAllSelected = files.length > 0 && selectedIds.length === files.length;
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(files.map((f) => f.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 批量移动分组
  const handleBatchMove = () => {
    if (selectedIds.length === 0) return;
    setMoveGroupFiles(selectedIds);
    setIsMoveModalOpen(true);
  };

  // 单文件移动分组
  const handleSingleMove = (file: FileItem) => {
    setMoveGroupFiles([file.id]);
    setIsMoveModalOpen(true);
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `确定要永久删除选中的 ${selectedIds.length} 个文件吗？此操作不可逆！`
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/files/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", fileIds: selectedIds }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "批量删除失败");
      }
      toast.success(`成功删除 ${selectedIds.length} 个文件`);
      setSelectedIds([]);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "删除失败");
    }
  };

  // 单文件删除
  const handleDeleteFile = async (file: FileItem) => {
    if (!window.confirm(`确定要永久删除文件「${file.displayName}」吗？`)) {
      return;
    }

    try {
      const res = await fetch(`/api/files/${file.id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("删除失败");
      }
      toast.success("文件已删除");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "删除失败");
    }
  };

  return (
    <div className="space-y-4">
      {/* 主布局：左右科学分栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 左侧文件分组侧边栏 */}
        <div className="lg:col-span-3 xl:col-span-3 2xl:col-span-2">
          <BaseCard shadow="flat" className="p-4 rounded-2xl bg-white dark:bg-muted-900 border border-muted-200/80 dark:border-muted-800">
            <GroupSidebar
              groups={groups}
              totalCount={totalCount}
              ungroupedCount={ungroupedCount}
              selectedGroupId={currentGroupId}
              onSelectGroup={handleSelectGroup}
              onOpenCreateGroup={() => {
                setGroupToEdit(null);
                setIsGroupModalOpen(true);
              }}
              onOpenEditGroup={(g) => {
                setGroupToEdit(g);
                setIsGroupModalOpen(true);
              }}
              onRefresh={() => router.refresh()}
            />
          </BaseCard>
        </div>

        {/* 右侧主工作区 */}
        <div className="lg:col-span-9 xl:col-span-9 2xl:col-span-10 space-y-4">
          <BaseCard shadow="flat" className="p-4 md:p-5 rounded-2xl bg-white dark:bg-muted-900 border border-muted-200/80 dark:border-muted-800 space-y-4">
            {/* 工具栏 */}
            <FileToolbar
              search={search}
              onSearchChange={setSearch}
              typeFilter={currentType}
              onTypeFilterChange={handleTypeFilterChange}
              sortBy={currentSort}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              selectedCount={selectedIds.length}
              totalCountOnPage={files.length}
              isAllSelected={isAllSelected}
              onSelectAll={handleSelectAll}
              onClearSelection={() => setSelectedIds([])}
              onBatchMove={handleBatchMove}
              onBatchDelete={handleBatchDelete}
              onOpenUpload={() => setIsUploadModalOpen(true)}
            />

            {/* 文件内容展示区 */}
            <div className={`transition-opacity duration-150 ${isPending ? "opacity-60" : "opacity-100"}`}>
              {viewMode === "grid" ? (
                <FileGridView
                  files={files}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onOpenReference={(file) => setReferenceFile(file)}
                  onOpenEditName={(file) => setEditNameFile(file)}
                  onOpenReupload={(file) => setReuploadFile(file)}
                  onOpenMoveGroup={handleSingleMove}
                  onDeleteFile={handleDeleteFile}
                />
              ) : (
                <FileListView
                  files={files}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onOpenReference={(file) => setReferenceFile(file)}
                  onOpenEditName={(file) => setEditNameFile(file)}
                  onOpenReupload={(file) => setReuploadFile(file)}
                  onOpenMoveGroup={handleSingleMove}
                  onDeleteFile={handleDeleteFile}
                />
              )}
            </div>

            {/* 分页组件 */}
            <div className="pt-2 flex items-center justify-between border-t border-muted-100 dark:border-muted-800">
              <span className="text-xs text-muted-400">
                显示本页 {files.length} 项，共 {totalItems} 项
              </span>
              <BasePagination
                routerQueryKey="page"
                totalItems={totalItems}
                itemPerPage={perPage}
                currentPage={currentPage}
                maxLinksDisplayed={5}
                rounded="full"
              />
            </div>
          </BaseCard>
        </div>
      </div>

      {/* 弹窗：查看文章引用分析 */}
      <FileReferenceModal
        file={referenceFile}
        open={Boolean(referenceFile)}
        onClose={() => setReferenceFile(null)}
      />

      {/* 弹窗：新建或重命名分组 */}
      <GroupManageModal
        open={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setGroupToEdit(null);
        }}
        groupToEdit={groupToEdit}
        onSuccess={() => router.refresh()}
      />

      {/* 弹窗：移动文件分组 */}
      <MoveGroupModal
        open={isMoveModalOpen}
        onClose={() => {
          setIsMoveModalOpen(false);
          setMoveGroupFiles([]);
        }}
        fileIds={moveGroupFiles}
        groups={groups}
        currentGroupId={
          typeof currentGroupId === "number" ? currentGroupId : null
        }
        onSuccess={() => {
          setSelectedIds([]);
          router.refresh();
        }}
      />

      {/* 弹窗：上传文件 */}
      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        groups={groups}
        defaultGroupId={
          typeof currentGroupId === "number" ? currentGroupId : null
        }
        onSuccess={() => router.refresh()}
      />

      {/* 弹窗：修改文件名 */}
      {editNameFile && (
        <Modal
          open={Boolean(editNameFile)}
          onClose={() => setEditNameFile(null)}
          title="修改文件名"
          size="md"
        >
          <FileEditName
            file={editNameFile}
            onUpdate={() => {
              setEditNameFile(null);
              router.refresh();
            }}
          />
        </Modal>
      )}

      {/* 弹窗：重新上传替换文件 */}
      {reuploadFile && (
        <FileReuploadModal
          file={reuploadFile}
          open={Boolean(reuploadFile)}
          onClose={() => setReuploadFile(null)}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}
