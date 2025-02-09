"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { BaseButton, BaseButtonIcon } from "@shuriken-ui/react";
import { FileVideo, FolderPlus, Loader } from "lucide-react";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const VideoSplitter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState<number>(10); // 默认分割时间为10秒
  const videoRef = useRef<HTMLVideoElement | null>(null); // 视频预览引用
  const ffmpegRef = useRef(new FFmpeg()); // 使用 ref 存储 FFmpeg 实例
  const messageRef = useRef<HTMLDivElement | null>(null); // 用于显示日志信息

  const handleFileSelect = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "视频文件",
            accept: { "video/*": [".mp4", ".mkv", ".avi"] },
          },
        ],
      });
      const file = await fileHandle.getFile();
      setSelectedFile(file);

      // 设置视频预览
      const videoUrl = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        videoRef.current.load();
      }
    } catch (error) {
      console.error(error);
      toast.error("选择文件失败");
    }
  };

  const loadFFmpeg = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      if (messageRef.current) {
        messageRef.current.innerHTML = message; // 显示日志信息
      }
      console.log(message);
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    setProcessing(true);

    try {
      await loadFFmpeg(); // 加载 FFmpeg
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.mp4', new Uint8Array(await selectedFile.arrayBuffer()));

      // 执行视频分割命令
      await ffmpeg.exec(['-i', 'input.mp4', '-c', 'copy', '-map', '0', '-segment_time', duration.toString(), '-f', 'segment', 'output%03d.mp4']);

      // 获取分割后的视频文件
      const files = await ffmpeg.listDir('.');
      const outputFiles = files.filter(file => file.name.endsWith('.mp4'));

      // 创建下载链接
      outputFiles.forEach(async (outputFile) => {
        const data = await ffmpeg.readFile(outputFile.name);
        const url = URL.createObjectURL(new Blob([data], { type: 'video/mp4' }));

        // 创建下载链接并触发下载
        const a = document.createElement('a');
        a.href = url;
        a.download = outputFile.name;
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (videoRef.current) {
      videoRef.current.src = ""; // 清空视频预览
      videoRef.current.load();
    }
  };

  return (
    <div className="min-h-screen bg-muted-100 dark:bg-muted-900 flex flex-col items-center">
      <div className="container max-w-5xl mx-auto py-10 px-4">
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
            <div className="relative w-full max-w-md h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {selectedFile ? (
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-full object-cover"
                >
                  <source src="" type="video/mp4" />
                  您的浏览器不支持视频标签。
                </video>
              ) : (
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
                <FileVideo className="w-5 h-5" />
              </BaseButtonIcon>
            </div>
          </div>
          <div ref={messageRef}></div> {/* 显示日志信息的区域 */}
        </div>
      </div>
    </div>
  );
};

export default VideoSplitter;
