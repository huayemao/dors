"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { BaseButton, BaseProgress } from "@shuriken-ui/react";
import {
  FileSpreadsheet,
  FolderPlus,
  Folder,
  Play,
  Loader,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface FileInfo {
  originalName: string;
  newName: string | null;
  path: string;
  error?: string;
  needsRename: boolean;
}

async function extractFileName(
  fileHandle: FileSystemFileHandle
): Promise<string | null> {
  const fileData = await fileHandle.getFile();
  const wb = await XLSX.read(await fileData.arrayBuffer());
  const firstSheet = wb.Sheets[wb.SheetNames[0]];
  let rows = XLSX.utils.sheet_to_json(firstSheet, {
    header: 1,
    defval: "",
    range: "A1:Z100",
  }) as string[][];

  // 检查 rows 是否为空，如果为空则读取其他 sheets
  if (rows.length === 0) {
    for (let i = 1; i < wb.SheetNames.length; i++) {
      const sheet = wb.Sheets[wb.SheetNames[i]];
      rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        range: "A1:Z100",
      }) as string[][];
      if (rows.length > 0) {
        break; // 找到非空的 rows，退出循环
      }
    }
  }

  const extension = fileHandle.name.split(".").pop() || "";
  for (const row of rows) {
    const rowText = row
      .map((cell) => String(cell || "").trim())
      .join(" ")
      .trim()
      .replaceAll("\n", " ");

    if (!rowText.trim()) continue;

    if (/^附件\d*：?:?$/.test(rowText)) {
      continue;
    }

    if (rowText) {
      return `${rowText}.${extension}`;
    }
  }
  return null;
}

const ExcelRenamer = () => {
  const [selectedDir, setSelectedDir] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [processing, setProcessing] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [progress, setProgress] = useState(0);

  const scanDirectory = async (dirHandle: FileSystemDirectoryHandle) => {
    setCalculating(true);
    setProgress(0);
    let totalFiles = 0;
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file" && entry.name.match(/\.(xlsx|xls)$/i)) {
        totalFiles++;
      }
    }
    // 重新遍历以获取文件信息
    const fileInfos: FileInfo[] = [];
    let processedFiles = 0;

    try {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === "file" && entry.name.match(/\.(xlsx|xls)$/i)) {
          try {
            const fileHandle = await dirHandle.getFileHandle(entry.name);
            const newName = await extractFileName(fileHandle);

            fileInfos.push({
              originalName: entry.name,
              newName: newName,
              path: entry.name,
              needsRename: newName !== null && newName !== entry.name,
            });
          } catch (error) {
            fileInfos.push({
              originalName: entry.name,
              newName: null,
              path: entry.name,
              error: "读取失败",
              needsRename: false,
            });
          }
        }
        processedFiles++;
        setProgress((processedFiles / totalFiles) * 100);
        setFiles([...fileInfos]);
      }
    } catch (error) {
      console.error(error);
      toast.error("扫描文件夹失败");
    } finally {
      setCalculating(false);
    }
  };

  const handleFolderSelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setSelectedDir(dirHandle);
      await scanDirectory(dirHandle);
    } catch (error) {
      console.error(error);
      toast.error("选择文件夹失败");
    }
  };

  const handleRefresh = async () => {
    if (!selectedDir) return;
    await scanDirectory(selectedDir);
    toast.success("文件列表已更新");
  };

  const handleProcess = async () => {
    if (!selectedDir) return;
    setProcessing(true);

    try {
      for (const file of files) {
        if (file.newName && file.newName !== file.originalName) {
          try {
            const fileHandle = await selectedDir.getFileHandle(
              file.originalName
            );
            await selectedDir.getFileHandle(file.newName, { create: true });
            const newHandle = await selectedDir.getFileHandle(file.newName);
            const fileData = await fileHandle.getFile();
            const writable = await newHandle.createWritable();
            await writable.write(fileData);
            await writable.close();
            await selectedDir.removeEntry(file.originalName);
            toast.success(`已重命名: ${file.originalName} → ${file.newName}`);
          } catch (e) {
            console.error(e.message);
            toast.error(`重命名失败: ${file.originalName}`);
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
      <div className="container max-w-5xl mx-auto py-10 px-4">
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
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted-100 dark:bg-muted-700 rounded-lg">
                    <Folder className="w-5 h-5 text-primary-500" />
                    <span className="text-muted-600 dark:text-muted-200">
                      已选择：{selectedDir.name}
                    </span>
                  </div>
                  <BaseButton
                    variant="outline"
                    color="primary"
                    onClick={handleRefresh}
                    disabled={processing || calculating}
                  >
                    <RefreshCw
                      className={`w-5 h-5 ${calculating ? "animate-spin" : ""}`}
                    />
                  </BaseButton>
                </>
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
            {/* 进度条区域 */}
            {calculating && <BaseProgress value={progress} max={100} />}
          {/* 文件列表 */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-semibold text-muted-800 dark:text-white">
                文件列表 ({files.length})
              </h2>
              <div className="divide-y divide-muted-200 dark:divide-muted-700">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="py-3 grid grid-cols-[2rem_minmax(0,1fr)_2rem_minmax(0,1fr)_auto] items-center gap-6"
                  >
                    <FileSpreadsheet className="w-5 h-5 text-primary-500" />
                    <div className="min-w-0">
                      <p className="text-sm text-muted-800 dark:text-muted-200 truncate">
                        {file.originalName}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-muted-400" />
                    </div>
                    <div className="min-w-0">
                      {file.newName ? (
                        <p
                          className={`text-sm truncate ${
                            file.needsRename
                              ? "text-primary-500 dark:text-primary-400"
                              : "text-muted-500 dark:text-muted-400"
                          }`}
                        >
                          {file.newName}
                        </p>
                      ) : file.error ? (
                        <p className="text-sm text-danger-500">{file.error}</p>
                      ) : null}
                    </div>
                    <div className="w-20 flex justify-end">
                      {file.newName && !file.needsRename && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted-100 dark:bg-muted-700 text-muted-500 dark:text-muted-300">
                          无需重命名
                        </span>
                      )}
                    </div>
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
