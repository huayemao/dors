"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  BaseButton,
  BaseButtonIcon,
  BaseProgress,
  BaseInput,
} from "@shuriken-ui/react";
import { FileVideo, FolderPlus, Loader, Trash, Play, Download, Eye, Clock } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { cn } from "@/lib/utils";
import { registerServiceWorker } from "@/lib/client/registerSW";
import { Modal } from "@/components/Base/Modal";

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
    previewSegments: "Preview Segments",
    downloadAll: "Download All",
    downloadSegment: "Download",
    noSegments: "No segments generated yet",
    processingProgress: "Processing...",
    ffmpegProgress: "Loading FFmpeg...",
    videoDuration: "Duration",
    estimatedSegments: "Estimated segments",
    splitModeLabel: "Split Mode",
    fastMode: "Fast Mode",
    preciseMode: "Precise Mode",
    fastModeDesc: "Quick splitting, may not be exact",
    preciseModeDesc: "Exact splitting, takes longer",
    processingLogs: "Processing Logs",
    resultsTitle: "Split Results",
    viewResults: "View Results",
    splitComplete: "Split Complete",
    originalVideoSplit: "Original video has been split into segments",
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
    previewSegments: "预览分割片段",
    downloadAll: "下载全部",
    downloadSegment: "下载",
    noSegments: "还没有生成分割片段",
    processingProgress: "处理中...",
    ffmpegProgress: "加载 FFmpeg...",
    videoDuration: "视频时长",
    estimatedSegments: "预计分割段数",
    splitModeLabel: "分割模式",
    fastMode: "快速模式",
    preciseMode: "精确模式",
    fastModeDesc: "快速分割，可能不够精确",
    preciseModeDesc: "精确分割，耗时较长",
    processingLogs: "处理日志",
    resultsTitle: "分割结果",
    viewResults: "查看结果",
    splitComplete: "分割完成",
    originalVideoSplit: "原视频已分割为片段",
  },
};

type Lang = "en" | "zh";

interface Segment {
  name: string;
  url: string;
  blob: Blob;
  duration: number;
}

const VideoSplitter = ({ lang = "en" }: { lang?: Lang }) => {
  const t = i18n[lang] ?? i18n.en;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [duration, setDuration] = useState<number>(10);
  const [splitMode, setSplitMode] = useState<"fast" | "precise">("fast");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null);
  const [ffmpegLoading, setFfmpegLoading] = useState(true);
  const [ffmpegProgress, setFfmpegProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
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
        
        // Get video duration when metadata is loaded
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            setVideoDuration(videoRef.current.duration);
          }
        };
      }

      setSelectedFile(file);
      setSegments([]); // Reset segments when new file is selected
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
            
            // Get video duration when metadata is loaded
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                setVideoDuration(videoRef.current.duration);
              }
            };
          }
          setSelectedFile(file);
          setSegments([]); // Reset segments when new file is selected
        }
      };
      input.click();
    }
  };

  const loadFFmpeg = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    try {
      setFfmpegLoading(true);
      setFfmpegProgress(0);

      // Simulate progress for FFmpeg loading
      const progressInterval = setInterval(() => {
        setFfmpegProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      clearInterval(progressInterval);
      setFfmpegProgress(100);
      
      setTimeout(() => {
        toast.success(t.ffmpegLoaded);
        setFfmpegLoaded(true);
        setFfmpegLoading(false);
      }, 500);

    } catch (error) {
      console.error(error);
      toast.error(t.ffmpegLoadFail);
      setFfmpegLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile || !ffmpegLoaded) return;
    setProcessing(true);
    setProgress(0);
    setSegments([]);
    setProcessingLogs([]);

    try {
      const ffmpeg = ffmpegRef.current;
      
      // Write input file
      setProgress(10);
      await ffmpeg.writeFile(
        "input.mp4",
        new Uint8Array(await selectedFile.arrayBuffer())
      );
      setProgress(20);

      // Set up progress monitoring with FFmpeg logs
      let currentProgress = 20;
      let frameCount = 0;
      let totalFrames = 0;
      
      // Calculate total frames based on actual video duration
      if (videoDuration > 0) {
        totalFrames = Math.ceil(videoDuration * 30); // Assume 30fps
      }
      
      // Listen to FFmpeg logs for progress
      const logHandler = (log: any) => {
        const logText = log.message || log;
        console.log('FFmpeg log:', logText);
        
        // Add log to processing logs
        if (typeof logText === 'string') {
          setProcessingLogs(prev => [...prev, logText]);
        }
        
        // Extract frame information from logs
        if (typeof logText === 'string') {
          // Look for frame progress like "frame= 1234 fps=..."
          const frameMatch = logText.match(/frame=\s*(\d+)/);
          if (frameMatch) {
            frameCount = parseInt(frameMatch[1]);
            
            // Calculate progress based on frame count and total frames
            if (totalFrames > 0) {
              const frameProgress = Math.min((frameCount / totalFrames) * 50, 50); // 20% to 70%
              currentProgress = 20 + frameProgress;
              setProgress(Math.round(currentProgress));
            } else {
              // Fallback: estimate progress based on time elapsed
              const estimatedProgress = Math.min(currentProgress + 1, 70);
              currentProgress = estimatedProgress;
              setProgress(estimatedProgress);
            }
          }
          
          // Look for completion indicators
          if (logText.includes('video:') && logText.includes('audio:')) {
            currentProgress = 75;
            setProgress(currentProgress);
          }
        }
      };

      // Add log listener
      ffmpeg.on('log', logHandler);

      // Choose splitting method based on user selection
      if (splitMode === "fast") {
        // Fast mode: use copy codec for speed (less precise)
        await ffmpeg.exec([
          "-i", "input.mp4",
          "-c", "copy",
          "-map", "0",
          "-segment_time", duration.toString(),
          "-reset_timestamps", "1",
          "-f", "segment",
          `${selectedFile.name.split(".")[0]}%03d.mp4`
        ]);
      } else {
        // Precise mode: re-encode for exact cuts (slower)
        await ffmpeg.exec([
          "-i", "input.mp4",
          "-c:v", "libx264",
          "-c:a", "aac",
          "-preset", "fast",
          "-segment_time", duration.toString(),
          "-segment_time_delta", "0.1",
          "-f", "segment",
          "-reset_timestamps", "1",
          "-map", "0:v:0",
          "-map", "0:a:0",
          `${selectedFile.name.split(".")[0]}%03d.mp4`
        ]);
      }

      // Remove log listener
      ffmpeg.off('log', logHandler);
      setProgress(80);

      // Get output files
      const files = await ffmpeg.listDir(".");
      const outputFiles = files.filter((file) => 
        file.name !== "input.mp4" && file.name.endsWith(".mp4")
      );

      // Create segments with preview URLs and actual durations
      const newSegments: Segment[] = [];
      for (const outputFile of outputFiles) {
        const data = await ffmpeg.readFile(outputFile.name);
        const blob = new Blob([data], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary video element to get actual duration
        const tempVideo = document.createElement('video');
        tempVideo.src = url;
        tempVideo.preload = 'metadata';
        
        // Wait for metadata to load to get actual duration
        await new Promise<void>((resolve) => {
          tempVideo.onloadedmetadata = () => {
            resolve();
          };
          tempVideo.load();
        });
        
        newSegments.push({
          name: outputFile.name,
          url,
          blob,
          duration: tempVideo.duration || duration // Fallback to user-set duration if metadata fails
        });
      }

      setSegments(newSegments);
      setProgress(100);
      
      toast.success(`${t.title}: ${selectedFile.name} split into ${newSegments.length} segments`);
      setShowResults(true);

    } catch (error) {
      console.error(error);
      toast.error(t.processFailed);
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const previewSegment = (segment: Segment) => {
    setCurrentSegment(segment);
    if (videoRef.current) {
      videoRef.current.src = segment.url;
      videoRef.current.load();
    }
  };

  const downloadSegment = (segment: Segment) => {
    const a = document.createElement("a");
    a.href = segment.url;
    a.download = segment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllSegments = () => {
    segments.forEach((segment, index) => {
      setTimeout(() => {
        downloadSegment(segment);
      }, index * 100); // Stagger downloads
    });
  };

  const resetToOriginal = () => {
    if (selectedFile && videoRef.current) {
      const videoUrl = URL.createObjectURL(selectedFile);
      videoRef.current.src = videoUrl;
      videoRef.current.load();
      setCurrentSegment(null);
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
    setSegments([]);
    setCurrentSegment(null);
    setVideoDuration(0);
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

      {/* FFmpeg Loading Progress */}
      {ffmpegLoading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-600 dark:text-muted-400">
              {t.ffmpegProgress}
            </span>
          </div>
          <BaseProgress value={ffmpegProgress} max={100} />
        </div>
      )}

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

      {/* Video Preview */}
      <div className="space-y-2">
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
        
        {/* Video Info */}
        {selectedFile && videoDuration > 0 && (
          <div className="text-center text-sm text-muted-600 dark:text-muted-400">
            {t.videoDuration}: {Math.round(videoDuration)}s | 
            {t.estimatedSegments}: {Math.ceil(videoDuration / duration)}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Split Mode Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-700 dark:text-muted-300">
            {t.splitModeLabel}
          </label>
          <div className="flex gap-3">
            <label className={cn(
              "flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 transition-all",
              splitMode === "fast" 
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                : "border-muted-200 dark:border-muted-700 hover:border-primary-300"
            )}>
              <input
                type="radio"
                name="splitMode"
                value="fast"
                checked={splitMode === "fast"}
                onChange={(e) => setSplitMode(e.target.value as "fast" | "precise")}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="font-medium text-sm text-muted-800 dark:text-white">
                  {t.fastMode}
                </div>
                <div className="text-xs text-muted-500 dark:text-muted-400">
                  {t.fastModeDesc}
                </div>
              </div>
            </label>
            <label className={cn(
              "flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 transition-all",
              splitMode === "precise" 
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" 
                : "border-muted-200 dark:border-muted-700 hover:border-primary-300"
            )}>
              <input
                type="radio"
                name="splitMode"
                value="precise"
                checked={splitMode === "precise"}
                onChange={(e) => setSplitMode(e.target.value as "fast" | "precise")}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div>
                <div className="font-medium text-sm text-muted-800 dark:text-white">
                  {t.preciseMode}
                </div>
                <div className="text-xs text-muted-500 dark:text-muted-400">
                  {t.preciseModeDesc}
                </div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <BaseInput
            label={t.segmentSecondsLabel}
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e))}
            className="border rounded p-2 w-32"
            placeholder={t.segmentSecondsPlaceholder}
            // @ts-ignore
            min={1}
            max={3600}
          />
        </div>
        <BaseButton
          variant="solid"
          color="primary"
          onClick={handleProcess}
          disabled={processing || !selectedFile || !ffmpegLoaded}
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

      {/* Processing Progress */}
      {processing && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm text-muted-600 dark:text-muted-400">
                {t.processingProgress}
              </span>
            </div>
            <BaseProgress value={progress} max={100} />
          </div>
          
          {/* Processing Logs */}
          {processingLogs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-700 dark:text-muted-300">
                  {t.processingLogs}
                </label>
                <span className="text-xs text-muted-500 dark:text-muted-400">
                  {processingLogs.length} {lang === "zh" ? "条日志" : "logs"}
                </span>
              </div>
              <div className="max-h-32 overflow-y-auto bg-muted-50 dark:bg-muted-800 rounded-lg p-3 text-xs font-mono">
                {processingLogs.map((log, index) => (
                  <div key={index} className="text-muted-600 dark:text-muted-400 mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Segments Summary */}
      {segments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-muted-800 dark:text-white">
              {t.previewSegments} ({segments.length})
            </h3>
            <div className="flex gap-2">
              {currentSegment && (
                <BaseButton
                  variant="outline"
                  size="sm"
                  onClick={resetToOriginal}
                >
                  <FileVideo className="w-4 h-4 me-2" />
                  {lang === "zh" ? "返回原视频" : "Original Video"}
                </BaseButton>
              )}
              <BaseButton
                variant="outline"
                size="sm"
                onClick={() => setShowResults(true)}
              >
                <Eye className="w-4 h-4 me-2" />
                {t.viewResults}
              </BaseButton>
            </div>
          </div>
          
          {/* Quick Preview */}
          <div className="text-center p-4 bg-muted-50 dark:bg-muted-800 rounded-lg">
            <p className="text-muted-600 dark:text-muted-400">
              {lang === "zh" 
                ? `已生成 ${segments.length} 个视频片段，点击"查看结果"按钮预览和下载`
                : `${segments.length} video segments generated. Click "View Results" to preview and download`
              }
            </p>
          </div>
        </div>
      )}

      <div ref={messageRef}></div>
      
             {/* Results Modal */}
       <Modal
         open={showResults}
         onClose={() => setShowResults(false)}
         title={t.resultsTitle}
         size="3xl"
       >
        <div className="space-y-6">
          {/* Summary */}
          <div className="text-center p-4 bg-muted-50 dark:bg-muted-800 rounded-lg">
            <h3 className="text-lg font-semibold text-muted-800 dark:text-white mb-2">
              {t.splitComplete}
            </h3>
            <p className="text-muted-600 dark:text-muted-400">
              {lang === "zh" 
                ? `原视频 "${selectedFile?.name}" 已分割为 ${segments.length} 个片段`
                : `Original video "${selectedFile?.name}" has been split into ${segments.length} segments`
              }
            </p>
          </div>

                     {/* Segments Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {segments.map((segment, index) => (
               <div
                 key={segment.name}
                 className="border border-muted-200 dark:border-muted-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
               >
                 {/* Video Player */}
                 <div className="relative bg-muted-100 dark:bg-muted-800 aspect-video">
                   <video
                     src={segment.url}
                     className="w-full h-full object-cover"
                     preload="metadata"
                     controls
                     muted
                   />
                   <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                     #{index + 1}
                   </div>
                 </div>
                 
                 {/* Segment Info */}
                 <div className="p-3 space-y-2">
                   <div className="flex items-center justify-between">
                     <span className="font-medium text-sm text-muted-800 dark:text-white truncate">
                       {segment.name}
                     </span>
                   </div>
                   
                   <div className="flex items-center gap-2 text-xs text-muted-500 dark:text-muted-400">
                     <Clock className="w-3 h-3" />
                     <span>
                       {lang === "zh" ? "时长" : "Duration"}: {Math.round(segment.duration)}s
                     </span>
                   </div>
                   
                   <div className="flex gap-2">
                     <BaseButton
                       variant="outline"
                       size="sm"
                       onClick={() => downloadSegment(segment)}
                       className="flex-1"
                     >
                       <Download className="w-3 h-3 me-1" />
                       {t.downloadSegment}
                     </BaseButton>
                   </div>
                 </div>
               </div>
             ))}
           </div>

                     {/* Actions */}
           <div className="flex justify-center pt-4 border-t border-muted-200 dark:border-muted-700">
             <BaseButton
               variant="solid"
               color="primary"
               onClick={downloadAllSegments}
             >
               <Download className="w-4 h-4 me-2" />
               {t.downloadAll}
             </BaseButton>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoSplitter;
