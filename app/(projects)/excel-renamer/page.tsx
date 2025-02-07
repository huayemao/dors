"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { BaseButton } from "@shuriken-ui/react";
import {
  FileSpreadsheet,
  FolderPlus,
  Folder,
  Play,
  Loader,
  ArrowRight,
} from "lucide-react";

interface FileInfo {
  originalName: string;
  newName: string | null;
  path: string;
  error?: string;
}

const ExcelRenamer = () => {
  const [selectedDir, setSelectedDir] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [processing, setProcessing] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [calculating, setCalculating] = useState(false);

  const extractFileName = (rows: string[][]): string => {
    for (const row of rows) {
      // 将每行的所有单元格文本拼接起来
      const rowText = row
        .map((cell) => String(cell || "").trim())
        .join(" ")
        .trim()
        .replaceAll("\n", " ");

      if (!rowText.trim()) continue;

      // 检查是否仅为"附件+数字"的格式
      if (/^附件\d*：?:?$/.test(rowText)) {
        continue;
      }

      // 找到第一个有效的文本就直接返回
      if (rowText) {
        console.log(rowText + "oo");
        return rowText;
      }
    }
    return "";
  };

  const handleFolderSelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setSelectedDir(dirHandle);
      setCalculating(true);

      const fileInfos: FileInfo[] = [];
      for await (const entry of dirHandle.values()) {
        if (entry.kind === "file" && entry.name.match(/\.(xlsx|xls)$/i)) {
          try {
            const fileHandle = await dirHandle.getFileHandle(entry.name);
            const fileData = await fileHandle.getFile();
            const wb = await XLSX.read(await fileData.arrayBuffer());
            const firstSheet = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet, {
              header: 1,
              defval: "",
            }) as string[][];

            const newFileName = extractFileName(rows);
            const extension = entry.name.split(".").pop();

            fileInfos.push({
              originalName: entry.name,
              newName: newFileName ? `${newFileName}.${extension}` : null,
              path: entry.name,
            });
          } catch (error) {
            fileInfos.push({
              originalName: entry.name,
              newName: null,
              path: entry.name,
              error: "读取失败",
            });
          }
        }
      }
      setFiles(fileInfos);
    } catch (error) {
      console.error(error);
      toast.error("选择文件夹失败");
    } finally {
      setCalculating(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedDir) return;
    setProcessing(true);

    try {
      for await (const entry of selectedDir.values()) {
        if (entry.kind === "file" && entry.name.match(/\.(xlsx|xls)$/i)) {
          const file = await entry.getFile();
          const buffer = await file.arrayBuffer();
          const workbook = XLSX.read(buffer);
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet, {
            header: 1,
            defval: "",
          }) as string[][];

          const newFileName = extractFileName(rows);

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
                console.error(e.message);
                toast.error(`重命名失败: ${entry.name}`);
              }
            }
          }
        }
      }

      toast.success("处理完成！");

      // 重新读取文件夹更新列表
    } catch (error) {
      console.error(error);
      toast.error("处理文件失败");
    } finally {
      // await handleFolderSelect();
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
                disabled={processing || calculating}
              >
                <FolderPlus className="w-5 h-5 me-2" />
                {calculating ? "计算中..." : "选择文件夹"}
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

            {selectedDir && files.length > 0 && (
              <BaseButton
                variant="solid"
                color="primary"
                className="w-full sm:w-auto"
                onClick={handleProcess}
                disabled={processing || calculating || !selectedDir}
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 me-2 animate-spin" />
                    重命名中...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 me-2" />
                    开始重命名
                  </>
                )}
              </BaseButton>
            )}
          </div>

          {/* 文件列表 */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-semibold text-muted-800 dark:text-white">
                文件列表 ({files.length})
              </h2>
              <div className="divide-y divide-muted-200 dark:divide-muted-700">
                {files.map((file, index) => (
                  <div key={index} className="py-3 flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-800 dark:text-muted-200 truncate">
                        {file.originalName}
                      </p>
                    </div>
                    {file.newName && (
                      <>
                        <ArrowRight className="w-5 h-5 text-muted-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary-500 dark:text-primary-400 truncate">
                            {file.newName}
                          </p>
                        </div>
                      </>
                    )}
                    {file.error && (
                      <span className="text-sm text-danger-500">
                        {file.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelRenamer;
