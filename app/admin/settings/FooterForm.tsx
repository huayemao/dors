"use client";

import { useState, useTransition } from "react";
import {
  FooterConfig,
  FooterColumn,
  FooterLinkItem,
  DEFAULT_FOOTER_CONFIG,
  parseFooterConfig,
} from "@/lib/isomorphic/footer";
import { BaseButton, BaseInput } from "@glint-ui/react";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  ExternalLink,
  Eye,
  PanelBottom,
} from "lucide-react";
import { SITE_META } from "@/constants";

interface FooterFormProps {
  settings: {
    key: string;
    value: any;
  }[];
}

export function FooterForm({ settings }: FooterFormProps) {
  const initialValue = (() => {
    const raw = settings.find((e) => e.key === "footer_config")?.value;
    return parseFooterConfig(raw);
  })();

  const [config, setConfig] = useState<FooterConfig>(initialValue);
  const [isPending, startTransition] = useTransition();
  const [showPreview, setShowPreview] = useState(true);

  // 更新品牌描述
  const handleBrandDescChange = (val: string) => {
    setConfig((prev) => ({ ...prev, brandDescription: val }));
  };

  // 添加新列
  const handleAddColumn = () => {
    const newColId = "col_" + Date.now();
    setConfig((prev) => ({
      ...prev,
      columns: [
        ...prev.columns,
        {
          id: newColId,
          title: "新分组",
          links: [{ id: "link_" + Date.now(), title: "示例链接", href: "/" }],
        },
      ],
    }));
  };

  // 删除列
  const handleDeleteColumn = (colIndex: number) => {
    if (config.columns.length <= 1) {
      toast.error("至少保留一个分组列");
      return;
    }
    setConfig((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, idx) => idx !== colIndex),
    }));
  };

  // 移动列顺序
  const handleMoveColumn = (colIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? colIndex - 1 : colIndex + 1;
    if (targetIndex < 0 || targetIndex >= config.columns.length) return;

    const newCols = [...config.columns];
    const [moved] = newCols.splice(colIndex, 1);
    newCols.splice(targetIndex, 0, moved);
    setConfig((prev) => ({ ...prev, columns: newCols }));
  };

  // 更新列标题
  const handleColumnTitleChange = (colIndex: number, title: string) => {
    setConfig((prev) => {
      const newCols = [...prev.columns];
      newCols[colIndex] = { ...newCols[colIndex], title };
      return { ...prev, columns: newCols };
    });
  };

  // 向指定列添加链接
  const handleAddLink = (colIndex: number) => {
    const newLinkId = "link_" + Date.now();
    setConfig((prev) => {
      const newCols = [...prev.columns];
      const col = newCols[colIndex];
      newCols[colIndex] = {
        ...col,
        links: [...col.links, { id: newLinkId, title: "", href: "" }],
      };
      return { ...prev, columns: newCols };
    });
  };

  // 删除指定列中的链接
  const handleDeleteLink = (colIndex: number, linkIndex: number) => {
    setConfig((prev) => {
      const newCols = [...prev.columns];
      const col = newCols[colIndex];
      newCols[colIndex] = {
        ...col,
        links: col.links.filter((_, idx) => idx !== linkIndex),
      };
      return { ...prev, columns: newCols };
    });
  };

  // 移动链接顺序
  const handleMoveLink = (
    colIndex: number,
    linkIndex: number,
    direction: "up" | "down"
  ) => {
    const targetIndex = direction === "up" ? linkIndex - 1 : linkIndex + 1;
    const col = config.columns[colIndex];
    if (targetIndex < 0 || targetIndex >= col.links.length) return;

    setConfig((prev) => {
      const newCols = [...prev.columns];
      const targetCol = { ...newCols[colIndex] };
      const newLinks = [...targetCol.links];
      const [moved] = newLinks.splice(linkIndex, 1);
      newLinks.splice(targetIndex, 0, moved);
      targetCol.links = newLinks;
      newCols[colIndex] = targetCol;
      return { ...prev, columns: newCols };
    });
  };

  // 修改链接属性
  const handleLinkChange = (
    colIndex: number,
    linkIndex: number,
    field: "title" | "href",
    val: string
  ) => {
    setConfig((prev) => {
      const newCols = [...prev.columns];
      const targetCol = { ...newCols[colIndex] };
      const newLinks = [...targetCol.links];
      newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: val };
      targetCol.links = newLinks;
      newCols[colIndex] = targetCol;
      return { ...prev, columns: newCols };
    });
  };

  // 恢复默认设置
  const handleResetToDefault = () => {
    if (confirm("确定要将页脚重置为初始默认条目吗？")) {
      setConfig(DEFAULT_FOOTER_CONFIG);
      toast.success("已重置为默认条目，点击“保存配置”以提交生效");
    }
  };

  // 保存设置
  const handleSave = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: "footer_config",
            value: config,
          }),
        });

        if (response.ok) {
          toast.success("页脚配置保存成功！");
        } else {
          toast.error("保存失败，请稍后重试");
        }
      } catch (e) {
        console.error("保存页脚出错:", e);
        toast.error("网络请求错误，保存失败");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 操作顶部栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-muted-800 rounded-xl border border-muted-200 dark:border-muted-700 shadow-sm">
        <div className="flex items-center gap-2">
          <PanelBottom className="w-5 h-5 text-primary-500" />
          <span className="font-semibold text-muted-800 dark:text-muted-100">
            页脚条目管理
          </span>
          <span className="text-xs text-muted-400">
            （共 {config.columns.length} 个分组列）
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BaseButton
            size="sm"
            variant="pastel"
            onClick={() => setShowPreview((v) => !v)}
          >
            <Eye className="w-4 h-4 mr-1 inline" />
            {showPreview ? "隐藏预览" : "展开预览"}
          </BaseButton>
          <BaseButton size="sm" variant="pastel" onClick={handleResetToDefault}>
            <RotateCcw className="w-4 h-4 mr-1 inline" />
            恢复默认
          </BaseButton>
          <BaseButton
            size="sm"
            color="primary"
            disabled={isPending}
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-1 inline" />
            {isPending ? "保存中..." : "保存配置"}
          </BaseButton>
        </div>
      </div>

      {/* 站点简介与描述设置 */}
      <div className="p-4 bg-white dark:bg-muted-800 rounded-xl border border-muted-200 dark:border-muted-700 shadow-sm space-y-2">
        <label className="block text-sm font-semibold text-muted-800 dark:text-muted-100">
          品牌简介描述
        </label>
        <textarea
          rows={2}
          value={config.brandDescription || ""}
          onChange={(e) => handleBrandDescChange(e.target.value)}
          placeholder="展示在页脚 Logo 下方的简介描述文字"
          className="w-full text-sm rounded-lg border border-muted-300 dark:border-muted-700 bg-muted-50 dark:bg-muted-900/50 p-2.5 text-muted-700 dark:text-muted-200 focus:border-primary-500 focus:outline-none"
        />
      </div>

      {/* 分组列管理 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-muted-700 dark:text-muted-200">
            分组列表（栏目）
          </h3>
          <BaseButton size="sm" color="primary" onClick={handleAddColumn}>
            <Plus className="w-4 h-4 mr-1 inline" />
            添加分组列
          </BaseButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.columns.map((col, colIdx) => (
            <div
              key={col.id || colIdx}
              className="flex flex-col bg-white dark:bg-muted-800 rounded-xl border border-muted-200 dark:border-muted-700 shadow-sm overflow-hidden"
            >
              {/* 列头部 */}
              <div className="p-3 bg-muted-50 dark:bg-muted-900/50 border-b border-muted-200 dark:border-muted-700 flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={col.title}
                  onChange={(e) =>
                    handleColumnTitleChange(colIdx, e.target.value)
                  }
                  placeholder="分组标题（如：花园）"
                  className="font-semibold text-sm bg-transparent border-b border-transparent hover:border-muted-300 focus:border-primary-500 focus:outline-none px-1 text-muted-800 dark:text-muted-100 flex-1"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={colIdx === 0}
                    onClick={() => handleMoveColumn(colIdx, "up")}
                    className="p-1 text-muted-400 hover:text-muted-700 dark:hover:text-muted-200 disabled:opacity-30"
                    title="前移分组"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={colIdx === config.columns.length - 1}
                    onClick={() => handleMoveColumn(colIdx, "down")}
                    className="p-1 text-muted-400 hover:text-muted-700 dark:hover:text-muted-200 disabled:opacity-30"
                    title="后移分组"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteColumn(colIdx)}
                    className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    title="删除分组"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 链接条目列表 */}
              <div className="p-3 space-y-2 flex-1 max-h-[380px] overflow-y-auto">
                {col.links.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-400">
                    暂无链接条目，请点击下方添加
                  </div>
                ) : (
                  col.links.map((link, linkIdx) => (
                    <div
                      key={link.id || linkIdx}
                      className="p-2 rounded-lg bg-muted-50 dark:bg-muted-900/60 border border-muted-200/80 dark:border-muted-700/80 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-muted-400 font-mono text-[10px]">
                          #{linkIdx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={linkIdx === 0}
                            onClick={() =>
                              handleMoveLink(colIdx, linkIdx, "up")
                            }
                            className="p-0.5 text-muted-400 hover:text-muted-600 dark:hover:text-muted-200 disabled:opacity-30"
                            title="上移"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={linkIdx === col.links.length - 1}
                            onClick={() =>
                              handleMoveLink(colIdx, linkIdx, "down")
                            }
                            className="p-0.5 text-muted-400 hover:text-muted-600 dark:hover:text-muted-200 disabled:opacity-30"
                            title="下移"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteLink(colIdx, linkIdx)
                            }
                            className="p-0.5 text-red-500 hover:text-red-700"
                            title="删除"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) =>
                          handleLinkChange(
                            colIdx,
                            linkIdx,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="显示标题（如：小记）"
                        className="w-full px-2 py-1 text-xs rounded border border-muted-200 dark:border-muted-700 bg-white dark:bg-muted-800 text-muted-700 dark:text-muted-200 focus:border-primary-500 focus:outline-none"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) =>
                            handleLinkChange(
                              colIdx,
                              linkIdx,
                              "href",
                              e.target.value
                            )
                          }
                          placeholder="链接地址（如：/notes 或 https://...）"
                          className="w-full px-2 py-1 text-xs font-mono rounded border border-muted-200 dark:border-muted-700 bg-white dark:bg-muted-800 text-muted-700 dark:text-muted-200 focus:border-primary-500 focus:outline-none"
                        />
                        {link.href && (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-muted-400 hover:text-primary-500"
                            title="在新窗口打开测试"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 列底部操作 */}
              <div className="p-2 border-t border-muted-200 dark:border-muted-700 bg-white dark:bg-muted-800 text-center">
                <button
                  type="button"
                  onClick={() => handleAddLink(colIdx)}
                  className="text-xs text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加链接
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 实时前台展示预览 */}
      {showPreview && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary-500" />
            <h3 className="font-semibold text-sm text-muted-700 dark:text-muted-200">
              效果预览
            </h3>
          </div>
          <div className="border border-muted-200 dark:border-muted-700 rounded-xl overflow-hidden shadow-sm">
            <footer className="group relative bg-muted-50 dark:bg-muted-800 text-muted-600 body-font overflow-hidden">
              <div className="relative w-full max-w-7xl px-5 py-12 mx-auto">
                <div className="flex flex-col md:flex-row gap-6 flex-wrap md:text-left text-center -mx-4">
                  {/* 品牌列 */}
                  <div className="w-full md:w-1/4 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left px-4">
                    <div className="flex flex-col md:flex-row gap-3 title-font font-medium items-center md:justify-start justify-center text-muted-800 dark:text-white">
                      <img
                        className="h-10"
                        src="/favicon.svg"
                        alt="dors logo"
                        width="40"
                        height="40"
                      />
                      <span className="font-heading font-bold text-xl">
                        Dors
                      </span>
                    </div>
                    <p className="font-sans text-xs w-full max-w-xs mx-auto md:max-w-[220px] md:mx-0 mt-2 text-muted-500 dark:text-muted-400">
                      {config.brandDescription}
                    </p>
                  </div>

                  {/* 动态列 */}
                  {config.columns.map((col, idx) => (
                    <div key={idx} className="w-full md:flex-1 px-4">
                      <h2 className="font-heading font-semibold text-muted-800 dark:text-white tracking-widest text-xs mb-3">
                        {col.title || "未命名分组"}
                      </h2>
                      <ul className="font-sans list-none space-y-1.5 mb-6 text-xs">
                        {col.links?.map((link, lIdx) => (
                          <li key={lIdx}>
                            <span className="text-muted-600 dark:text-muted-400 hover:text-primary-500">
                              {link.title || "未命名链接"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative border-t bg-muted-100 dark:bg-muted-900">
                <div className="w-full max-w-7xl mx-auto py-3 px-5 flex flex-wrap flex-col sm:flex-row text-xs text-muted-500">
                  <p className="text-center sm:text-left">
                    © 2022 - present. All Rights Reserved.
                    {SITE_META.ICP && ` | ${SITE_META.ICP}`}
                  </p>
                  <span className="sm:ml-auto sm:mt-0 mt-2 text-center text-primary-500">
                    花野猫 打造
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}

      {/* 底部保存按钮 */}
      <div className="flex justify-end pt-4">
        <BaseButton
          color="primary"
          size="md"
          disabled={isPending}
          onClick={handleSave}
        >
          <Save className="w-4 h-4 mr-1 inline" />
          {isPending ? "保存中..." : "保存配置"}
        </BaseButton>
      </div>
    </div>
  );
}
