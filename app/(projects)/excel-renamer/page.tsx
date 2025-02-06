"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { BaseButton } from "@shuriken-ui/react";
import { FileSpreadsheet, FolderPlus, Folder, Play, Loader } from "lucide-react";

export default function ExcelRenamer() {
  const [processing, setProcessing] = useState(false);
  const [selectedDir, setSelectedDir] = useState<FileSystemDirectoryHandle | null>(null);

  const handleFolderSelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setSelectedDir(dirHandle);
      toast.success("已选择文件夹：" + dirHandle.name);
    } catch (error) {
      console.error(error);
      toast.error("选择文件夹失败");
    }
  };

  const handleProcess = async () => {
    if (!selectedDir) return;
    
    try {
      setProcessing(true);

      // 遍历文件夹中的文件
      for await (const entry of selectedDir.values()) {
        if (entry.kind === "file" && entry.name.match(/\.(xlsx|xls)$/i)) {
          const file = await entry.getFile();

          // 读取Excel文件
          const buffer = await file.arrayBuffer();
          const workbook = XLSX.read(buffer);

          // 获取第一个工作表的所有行
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet, {
            header: 1,
            defval: "", // 空单元格返回空字符串
          }) as string[][];

          // 查找合适的文件名
          let newFileName = "";
          for (const row of rows) {
            const firstCell = String(row[0] || "").trim();
            if (!firstCell) continue;

            if (newFileName === "" && !firstCell.startsWith("附件")) {
              newFileName = firstCell;
              break;
            }

            if (firstCell.startsWith("附件")) {
              // 找到"附件"行，继续查找下一个非空行
              continue;
            }
          }

          // 使用找到的文本作为新文件名
          if (newFileName) {
            const newName = `${newFileName}.xlsx`;

            // 验证新文件名是否合法
            if (newName !== entry.name) {
              try {
                await selectedDir.getFileHandle(newName, { create: true });
                const newHandle = await selectedDir.getFileHandle(newName);
                const fileData = await entry.getFile();
                const writable = await newHandle.createWritable();
                await writable.write(fileData);
                await writable.close();
                await selectedDir.removeEntry(entry.name);
                toast.success(`已重命名: ${entry.name} → ${newName}`);
              } catch (e) {
                toast.error(`重命名失败: ${entry.name}`);
              }
            }
          }
        }
      }

      toast.success("处理完成！");
    } catch (error) {
      console.error(error);
      toast.error("处理过程中出现错误");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted-100 dark:bg-muted-900">
      <div className="container max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 p-6 rounded-xl shadow-sm space-y-6">
          {/* 标题区域 */}
          <div className="space-y-2 border-b border-muted-200 dark:border-muted-700 pb-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-primary-500" />
              <h1 className="font-heading text-2xl font-bold text-muted-800 dark:text-white">
                Excel 文件重命名助手
              </h1>
            </div>
            <p className="text-muted-500 dark:text-muted-400">
              选择一个包含Excel文件的文件夹，程序将根据每个文件的表头自动重命名这些文件。
            </p>
          </div>

          {/* 操作区域 */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <BaseButton
                variant="solid"
                color="primary"
                onClick={handleFolderSelect}
                disabled={processing}
              >
                <FolderPlus className="w-5 h-5 me-2" />
                选择文件夹
              </BaseButton>
              {selectedDir && (
                <div className="flex items-center gap-2 px-4 py-2 bg-muted-100 dark:bg-muted-700 rounded-lg">
                  <Folder className="w-5 h-5 text-primary-500" />
                  <span className="text-muted-600 dark:text-muted-200">
                    已选择：{selectedDir.name}
                  </span>
                </div>
              )}
            </div>

            {selectedDir && (
              <BaseButton 
                variant="solid"
                color="primary"
                className="w-full sm:w-auto"
                onClick={handleProcess} 
                disabled={processing || !selectedDir}
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 me-2 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 me-2" />
                    开始处理
                  </>
                )}
              </BaseButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
