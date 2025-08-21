"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  BaseButton,
  BaseButtonIcon,
  BaseProgress,
  BaseInput,
} from "@shuriken-ui/react";
import { FileVideo, FolderPlus, Loader, Trash } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { cn } from "@/lib/utils";
import { registerServiceWorker } from "@/lib/client/registerSW";

const i18n = {
  en: {
    title: "Video Splitter",
    lead: "Choose a video file and split it into segments by duration.",
    selectFile: "Choose video file",
    deleteFile: "Remove video",
    tooltipSelect: "Choose video file",
    tooltipDelete: "Remove video file",
    ffmpegLoading: "Loading FFmpeg...",
    ffmpegLoaded: "FFmpeg loaded",
    ffmpegLoadFail: "Failed to load FFmpeg",
    chooseToPreview: "Please choose a video file to preview",
    segmentSecondsLabel: "Segment time (seconds)",
    segmentSecondsPlaceholder: "Segment time (s)",
    startSplit: "Start splitting",
    splitting: "Splitting...",
    processFailed: "Failed to process video",
    newVersionPrompt: "A new version is available",
    filePickerDesc: "Video files",
  },
  zh: {
    title: "视频分割助手",
    lead: "选择一个视频文件，程序将根据指定的时间间隔进行分割。",
    selectFile: "选择视频文件",
    deleteFile: "删除视频",
    tooltipSelect: "选择视频文件",
    tooltipDelete: "删除视频文件",
    ffmpegLoading: "加载 FFmpeg...",
    ffmpegLoaded: "FFmpeg 加载完成",
    ffmpegLoadFail: "FFmpeg 加载失败",
    chooseToPreview: "请选择一个视频文件以进行预览",
    segmentSecondsLabel: "分割时间（秒）",
    segmentSecondsPlaceholder: "分割时间（秒）",
    startSplit: "开始分割",
    splitting: "分割中...",
    processFailed: "处理视频失败",
    newVersionPrompt: "有新的版本",
    filePickerDesc: "视频文件",
  },
};

type Lang = "en" | "zh";

const VideoSplitter = ({ lang = "en" }: { lang?: Lang }) => {
  const t = i18n[lang] ?? i18n.en;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState<number>(10);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  const handleFileSelect = async () => {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: t.filePickerDesc,
            accept: { "video/*": [".mp4", ".mkv", ".avi"] },
          },
        ],
      });
      const file = await fileHandle.getFile();

      const videoUrl = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        videoRef.current.load();
      }

      setSelectedFile(file);
    } catch (error) {
      console.error(error);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          const videoUrl = URL.createObjectURL(file);
          if (videoRef.current) {
            videoRef.current.src = videoUrl;
            videoRef.current.load();
          }
          setSelectedFile(file);
        }
      };
      input.click();
    }
  };

  const loadFFmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      toast.success(t.ffmpegLoaded);

      setFfmpegLoaded(true);
    } catch (error) {
      console.error(error);
      if (messageRef.current) {
        toast.error(t.ffmpegLoadFail);
      }
    }
  };

  const handleProcess = async () => {
    if (!selectedFile || !ffmpegLoaded) return;
    setProcessing(true);
    setProgress(0);

    try {
      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile(
        "input.mp4",
        new Uint8Array(await selectedFile.arrayBuffer())
      );

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-c",
        "copy",
        "-map",
        "0",
        "-segment_time",
        duration.toString(),
        "-reset_timestamps",
        "1",
        "-f",
        "segment",
        `${selectedFile.name.split(".")[0]}%03d.mp4`,
      ]);

      const files = await ffmpeg.listDir(".");
      const outputFiles = files.filter((file) => file.name != "input.mp4");

      outputFiles.forEach(async (outputFile) => {
        const data = await ffmpeg.readFile(outputFile.name);
        const url = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));

        const a = document.createElement("a");
        a.href = url;
        a.download = outputFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      console.log(
        `${t.title}: ${selectedFile.name}, ${lang === "zh" ? "每段" : "each"} ${duration} ${lang === "zh" ? "秒" : "seconds"}`
      );
    } catch (error) {
      console.error(error);
      toast.error(t.processFailed);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    loadFFmpeg();
    registerServiceWorker({
      onNeedRefresh(updateSW) {
        const res = confirm(t.newVersionPrompt);
        if (res) {
          updateSW();
        }
      },
    });
  }, []);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (videoRef.current) {
      videoRef.current.src = "";
      videoRef.current.load();
    }
  };

  return (
    <div className="bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 p-6 rounded-xl shadow-sm space-y-6">
      <div className="space-y-2 border-b border-muted-200 dark:border-muted-700 pb-4">
        <div className="flex items-center gap-2">
          <FileVideo className="w-6 h-6 text-primary-500" />
          <h2 className="font-heading text-2xl font-bold text-muted-800 dark:text-white">
            {t.title}
          </h2>
        </div>
        <p className="text-muted-500 dark:text-muted-400">{t.lead}</p>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <BaseButton
            variant="solid"
            color="primary"
            onClick={handleFileSelect}
            disabled={processing || !ffmpegLoaded}
            className="flex items-center"
            data-nui-tooltip={t.tooltipSelect}
          >
            <FolderPlus className="w-5 h-5 me-2" />
            {ffmpegLoaded ? t.selectFile : t.ffmpegLoading}
          </BaseButton>
          {selectedFile && (
            <BaseButtonIcon
              data-nui-tooltip={t.tooltipDelete}
              onClick={handleRemoveFile}
              disabled={!selectedFile}
            >
              <Trash className="w-5 h-5" />
            </BaseButtonIcon>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative w-full min-h-72 max-h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            controls
            className={cn("w-full h-full object-contain", {
              hidden: !selectedFile,
            })}
          >
            <source src="" type="video/mp4" />
            {lang === "zh" ? "您的浏览器不支持视频标签。" : "Your browser does not support the video tag."}
          </video>
          {!selectedFile && (
            <div className="flex items-center justify-center h-full text-muted-500 dark:text-muted-400">
              {t.chooseToPreview}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <BaseInput
            label={t.segmentSecondsLabel}
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e))}
            className="border rounded p-2 w-32"
            placeholder={t.segmentSecondsPlaceholder}
          />
        </div>
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
              {t.splitting}
            </>
          ) : (
            <>
              <FileVideo className="w-5 h-5 me-2" />
              {t.startSplit}
            </>
          )}
        </BaseButton>
      </div>
      <div ref={messageRef}></div>
      {processing && <BaseProgress value={progress} max={100} />}
    </div>
  );
};

export default VideoSplitter;
