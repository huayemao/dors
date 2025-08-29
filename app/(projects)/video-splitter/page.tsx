import dynamic from "next/dynamic";
import { ClientOnly } from "@/components/ClientOnly";
import LanguageSwitcher from "./LanguageSwitcher";
import { Footer } from "@/components/Footer";
import FeatureGrid from "@/components/FeatureGrid";
import { NumberedList } from "@/components/Base/NumberedList";
import { Zap, Scissors, FileVideo, Download } from "lucide-react";
import { BaseHeading } from "@glint-ui/react";
import { Nav } from "@/components/Nav";

const VideoSplitter = dynamic(() => import("./VideoSplitter"), { ssr: false });

export function generateMetadata({
  searchParams,
}: {
  searchParams: { lang?: string };
}) {
  const lang = searchParams?.lang === "zh" ? "zh" : "en";
  const title =
    lang === "zh"
      ? "秒切 - Web 视频分割工具"
      : "Video Splitter - Online Web Video Splitter";
  const description =
    lang === "zh"
      ? "免费在线的视频分割工具，支持按秒切割视频；本地浏览器内处理，无需上传，文件文件不出设备。"
      : "Free client-side video splitter (no upload). Slice by time, fast and mobile-friendly. Privacy‑first — files never leave your device.";
  const keywords =
    lang === "zh"
      ? [
          "视频切片",
          "按秒分割视频",
          "视频处理",
          "Web",
          "FFmpeg",
          "在线工具",
          "本地处理",
          "无需上传",
          "生产力工具",
        ]
      : [
          "video split",
          "split video by seconds",
          "splitter",
          "FFmpeg",
          "web",
          "online tool",
          "client-side",
          "no upload",
          "productivity",
        ];

  return {
    title,
    description,
    keywords,
  };
}

export default function Page({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const lang = searchParams?.lang === "zh" ? "zh" : "en";

  const t =
    lang === "zh"
      ? {
          h1: "秒切 - 一键按秒切割视频",
          lead: "如果你觉得你的视频文件太大，或者太长，不利于传输，你可以用这个免费在线的网页工具把它分割成更小的文件。它可以将你的视频文件按秒分割，并保存为多个片段。你不需要安装软件，也不需要花费时间上传文件到服务器，直接在浏览器里完成分割。",
          leadShort: "免费网页版按秒分割视频工具·本地处理·无需上传",
          howTitle: "使用指南",
          features: [
            {
              icon: <Zap className="w-6 h-6" />,
              title: "智能处理",
              description:
                "基于 FFmpeg 优化，支持快速和精确两种模式，本地处理不上传服务器。",
              bgColor: "bg-primary-100 dark:bg-primary-500",
              textColor: "text-primary-500 dark:text-white",
            },
            {
              icon: <Scissors className="w-6 h-6" />,
              title: "双模式分割",
              description:
                "快速模式：快速分割，适合大部分场景；精确模式：帧级精度，适合专业需求。",
              bgColor: "bg-lime-100 dark:bg-lime-500",
              textColor: "text-lime-500 dark:text-white",
            },
            {
              icon: <FileVideo className="w-6 h-6" />,
              title: "实时监控",
              description:
                "实时查看FFmpeg处理日志，处理完成后在弹窗中直接播放所有分割片段，支持常见视频格式如 MP4。",
              bgColor: "bg-violet-100 dark:bg-violet-500",
              textColor: "text-violet-500 dark:text-white",
            },
            {
              icon: <Download className="w-6 h-6" />,
              title: "便捷下载",
              description:
                "免安装使用，浏览器直接操作，移动端友好，随时随地分割视频。",
              bgColor: "bg-yellow-100 dark:bg-yellow-500",
              textColor: "text-yellow-500 dark:text-white",
            },
          ],
        }
      : {
          h1: "Video Splitter",
          lead: "A local, browser‑based video splitter — no install, no upload. Choose between fast mode and precise mode, powered by FFmpeg WASM to slice by seconds. Privacy‑first and mobile‑friendly; files stay on your device.",
          leadShort: "Dual Mode · Client‑side · No upload",
          howTitle: "How to use",
          features: [
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Smart Processing",
              description:
                "Powered by FFmpeg with optimized loading and execution, supports both fast and precise modes, local processing with no server upload.",
              bgColor: "bg-primary-100 dark:bg-primary-500",
              textColor: "text-primary-500 dark:text-white",
            },
            {
              icon: <Scissors className="w-6 h-6" />,
              title: "Dual Mode Splitting",
              description:
                "Fast mode: Quick splitting for most scenarios; Precise mode: Frame-accurate precision for professional needs.",
              bgColor: "bg-lime-100 dark:bg-lime-500",
              textColor: "text-lime-500 dark:text-white",
            },
            {
              icon: <FileVideo className="w-6 h-6" />,
              title: "Real-time Monitoring",
              description:
                "View real-time FFmpeg processing logs and play all segments directly in a modal after completion, supporting common formats like MP4.",
              bgColor: "bg-violet-100 dark:bg-violet-500",
              textColor: "text-violet-500 dark:text-white",
            },
            {
              icon: <Download className="w-6 h-6" />,
              title: "Easy Download",
              description:
                "No installation required, use directly in browser, mobile-friendly for splitting anywhere.",
              bgColor: "bg-yellow-100 dark:bg-yellow-500",
              textColor: "text-yellow-500 dark:text-white",
            },
          ],
        };

  return (
    <>
      <Nav simple></Nav>
      <div className="pt-10 bg-muted-100 dark:bg-muted-900 ">
        <main className="mx-auto  flex flex-col items-center">
          <div className="container px-4 max-w-6xl flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-muted-900 dark:text-white">
                {t.h1}
              </h1>
              <p className="mt-1 text-sm text-muted-600 dark:text-muted-400">
                {t.lead}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
          {/* Features Section */}
          <div className="mt-10 w-full">
            <div className="bg-white dark:bg-muted-800  border-muted-200 dark:border-muted-700 ">
              <div className="px-6 py-8">
                <FeatureGrid features={t.features} />
              </div>
            </div>
          </div>

          {/* Main Application and Usage Guide Section */}
          <div className="container px-4 max-w-6xl w-full py-10">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Main Application */}
              <div className="lg:col-span-2 w-full">
                <ClientOnly>
                  <VideoSplitter lang={lang} />
                </ClientOnly>
              </div>

              {/* Right: Usage Guide */}
              <div className="w-full">
                <div className="bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-xl p-6 h-fit">
                  <div className="space-y-4">
                    <BaseHeading
                      as="h2"
                      className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-sm"
                    >
                      {t.howTitle}
                    </BaseHeading>
                    <NumberedList
                      items={lang === "zh" ? [
                        {
                          number: "01",
                          title: "选择视频文件",
                          description: `点击"选择视频文件"，选择待分割视频（支持常见格式，如 MP4）；`,
                        },
                        {
                          number: "02",
                          title: "设置分割参数",
                          description: "选择分割模式：快速模式（快速但不精确）或精确模式（精确但耗时较长）；",
                        },
                        {
                          number: "03",
                          title: "设置分割时长",
                          description: '在"分割时间（秒）"输入框设置每段视频时长（默认 10 秒，可自定义）；',
                        },
                        {
                          number: "04",
                          title: "开始分割处理",
                          description: '点击"开始分割"，实时查看处理日志，完成后在弹窗中直接播放视频片段并下载。',
                        },
                      ] : [
                        {
                          number: "01",
                          title: "Select Video File",
                          description: "Click 'Choose video file' to select a video for splitting (supports common formats like MP4);",
                        },
                        {
                          number: "02",
                          title: "Set Split Parameters",
                          description: "Choose split mode: Fast Mode (quick but less precise) or Precise Mode (precise but takes longer);",
                        },
                        {
                          number: "03",
                          title: "Set Segment Duration",
                          description: 'Set the duration for each video segment in the "Segment time (seconds)" input (default 10 seconds, customizable);',
                        },
                        {
                          number: "04",
                          title: "Start Splitting Process",
                          description: 'Click "Start splitting", monitor real-time processing logs, and play/download video segments directly in the modal when complete.',
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Reference Link Section */}
                <div className="mt-4 bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-xl p-4">
                  <div className="space-y-3">
                    <BaseHeading
                      as="h3"
                      className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-xs"
                    >
                      {lang === "zh" ? "参考链接" : "Reference"}
                    </BaseHeading>
                    <a
                      href="https://huayemao.run/posts/257"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                      <span>🔗</span>
                      <span className="underline">
                        {lang === "zh"
                          ? "借助 cursor 开发 web 视频切片工具"
                          : "Building Web Video Splitter with Cursor"}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
