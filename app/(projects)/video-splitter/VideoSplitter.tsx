"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { BaseButton, BaseButtonIcon, BaseProgress } from "@shuriken-ui/react";
import { FileVideo, FolderPlus, Loader, Trash } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { cn } from "@/lib/utils";

const VideoSplitter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState<number>(10); // 默认分割时间为10秒
  const videoRef = useRef<HTMLVideoElement | null>(null); // 视频预览引用
  const ffmpegRef = useRef(new FFmpeg()); // 使用 ref 存储 FFmpeg 实例
  const messageRef = useRef<HTMLDivElement | null>(null); // 用于显示日志信息
  const [progress, setProgress] = useState(0); // 添加进度状态
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false); // 添加状态变量

  const handleFileSelect = async () => {
    try {
      // 尝试使用 showOpenFilePicker
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "视频文件",
            accept: { "video/*": [".mp4", ".mkv", ".avi"] },
          },
        ],
      });
      const file = await fileHandle.getFile();

      // 设置视频预览
      const videoUrl = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        videoRef.current.load();
      }

      setSelectedFile(file); // 移动到这里，确保在设置文件之前更新视频预览
    } catch (error) {
      console.error(error);
      // 作为后备方法，创建文件输入元素
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          // 设置视频预览
          const videoUrl = URL.createObjectURL(file);
          if (videoRef.current) {
            videoRef.current.src = videoUrl;
            videoRef.current.load();
          }
          setSelectedFile(file); // 更新文件状态
        }
      };
      input.click(); // 触发文件选择对话框
    }
  };

  const loadFFmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    // 显示初始加载提示
    if (messageRef.current) {
      messageRef.current.innerHTML = "正在加载 FFmpeg，请稍候...";
    }

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });

      setFfmpegLoaded(true); // 设置 FFmpeg 加载完成状态
      if (messageRef.current) {
        messageRef.current.innerHTML = "FFmpeg 加载完成"; // 加载完成提示
      }
    } catch (error) {
      console.error(error);
      if (messageRef.current) {
        messageRef.current.innerHTML = "加载 FFmpeg 失败"; // 加载失败提示
      }
    }
  };

  const handleProcess = async () => {
    if (!selectedFile || !ffmpegLoaded) return; // 确保 FFmpeg 已加载
    setProcessing(true);
    setProgress(0); // 重置进度

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile(
        "input.mp4",
        new Uint8Array(await selectedFile.arrayBuffer())
      );

      // 执行视频分割命令
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-c",
        "copy",
        "-map",
        "0",
        "-segment_time",
        duration.toString(),
        "-f",
        "segment",
        `${selectedFile.name.split(".")[0]}%03d.mp4`,
      ]);

      // 获取分割后的视频文件
      const files = await ffmpeg.listDir(".");
      const outputFiles = files.filter((file) => file.name != "input.mp4");

      // 创建下载链接
      outputFiles.forEach(async (outputFile) => {
        const data = await ffmpeg.readFile(outputFile.name);
        const url = URL.createObjectURL(
          new Blob([data], { type: "video/mp4" })
        );

        // 创建下载链接并触发下载
        const a = document.createElement("a");
        a.href = url;
        a.download = outputFile.name; // 这里可以根据需要修改文件名
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      console.log(`分割视频: ${selectedFile.name}，每段 ${duration} 秒`);
    } catch (error) {
      console.error(error);
      toast.error("处理视频失败");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    loadFFmpeg(); // 页面加载时调用 loadFFmpeg
  }, []); // 空依赖数组确保只在组件挂载时调用

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (videoRef.current) {
      videoRef.current.src = ""; // 清空视频预览
      videoRef.current.load();
    }
  };

  return (
    <div className="bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 p-6 rounded-xl shadow-sm space-y-6">
      {/* 标题区域 */}
      <div className="space-y-2 border-b border-muted-200 dark:border-muted-700 pb-4">
        <div className="flex items-center gap-2">
          <FileVideo className="w-6 h-6 text-primary-500" />
          <h1 className="font-heading text-2xl font-bold text-muted-800 dark:text-white">
            视频分割助手
          </h1>
        </div>
        <p className="text-muted-500 dark:text-muted-400">
          选择一个视频文件，程序将根据指定的时间间隔进行分割。
        </p>
      </div>
      {/* 视频预览区域 */}
      <div className="flex justify-center">
        <div className="relative w-full min-h-72 max-h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            controls
            className={cn("w-full h-full object-contain", {
              hidden: !selectedFile,
            })} // 使用 cn 函数控制显隐
          >
            <source src="" type="video/mp4" />
            您的浏览器不支持视频标签。
          </video>
          {!selectedFile && ( // 当没有选择文件时显示提示信息
            <div className="flex items-center justify-center h-full text-muted-500 dark:text-muted-400">
              请选择一个视频文件以进行预览
            </div>
          )}
        </div>
      </div>
      {/* 操作区域 */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <BaseButton
            variant="solid"
            color="primary"
            onClick={handleFileSelect}
            disabled={processing}
            className="flex items-center"
            data-nui-tooltip="选择视频文件"
          >
            <FolderPlus className="w-5 h-5 me-2" />
            选择视频文件
          </BaseButton>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border rounded p-2 w-32"
            placeholder="分割时间（秒）"
          />
        </div>

        <div className="flex items-center gap-4">
          <BaseButton
            variant="solid"
            color="primary"
            onClick={handleProcess}
            disabled={processing || !selectedFile}
            className="flex items-center"
          >
            {processing ? (
              <>
                <Loader className="w-5 h-5 me-2 animate-spin" />
                分割中...
              </>
            ) : (
              <>
                <FileVideo className="w-5 h-5 me-2" />
                开始分割
              </>
            )}
          </BaseButton>

          <BaseButtonIcon
            data-nui-tooltip="删除视频文件"
            color="danger" // 使用不同的颜色以区分删除按钮
            onClick={handleRemoveFile}
            disabled={!selectedFile}
          >
            <Trash className="w-5 h-5" />
          </BaseButtonIcon>
        </div>
      </div>
      <div ref={messageRef}></div> {/* 显示日志信息的区域 */}
      {/* 进度条区域 */}
      <BaseProgress value={progress} max={100} /> {/* 添加进度条 */}
    </div>
  );
};

export default VideoSplitter;
