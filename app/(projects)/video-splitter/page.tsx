import dynamic from "next/dynamic";
import { ClientOnly } from "@/components/ClientOnly";
import LanguageSwitcher from "./LanguageSwitcher";
import { Footer } from "@/components/Footer";
import FeatureGrid from "@/components/FeatureGrid";
import Steps from "./components/Steps";
import { Zap, Scissors, FileVideo, Download } from "lucide-react";
import { BaseHeading } from "@shuriken-ui/react";
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
      ? "本地浏览器内处理（无需上传），基于 FFmpeg WASM 按时长切片。快速、移动端友好，隐私优先，文件不出设备。"
      : "Client-side video splitter (no upload). Slice by time with FFmpeg WASM, fast and mobile-friendly. Privacy‑first — files never leave your device.";
  const keywords =
    lang === "zh"
      ? ["视频切片", "按秒分割视频", "视频处理", "Web", "FFmpeg", "在线工具", "本地处理", "无需上传", "隐私安全"]
      : ["video split", "split video by seconds", "splitter", "FFmpeg", "web", "online tool", "client-side", "no upload", "privacy"];

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
        h1: "秒切 - Web 视频分割工具",
        lead:
          "按秒切割视频；本地浏览器内处理，无需上传，极速秒切，基于 FFmpeg WASM，移动端适配，隐私优先，文件始终留在你的设备中。",
        leadShort: "本地处理·无需上传 · 隐私优先",
        howTitle: "使用指南",
        steps: [
          "点击\"选择视频文件\"，选择待分割视频（支持常见格式，如 MP4）；",
          "在\"分割时间（秒）\"输入框设置每段视频时长（默认 10 秒，可自定义）；",
          "点击\"开始分割\"，等待处理完成后，下载切片后的视频文件。",
        ],
        features: [
          {
            icon: <Zap className="w-6 h-6" />,
            title: "快速处理",
            description: "基于 FFmpeg 优化，缩短加载与视频处理时间，本地处理不上传服务器。",
            bgColor: "bg-primary-100 dark:bg-primary-500",
            textColor: "text-primary-500 dark:text-white"
          },
          {
            icon: <Scissors className="w-6 h-6" />,
            title: "精确分割",
            description: "按时长精确分割视频，支持自定义秒数，帧级精度保证分割质量。",
            bgColor: "bg-lime-100 dark:bg-lime-500",
            textColor: "text-lime-500 dark:text-white"
          },
          {
            icon: <FileVideo className="w-6 h-6" />,
            title: "即时预览",
            description: "处理前预览视频，确保选择正确的文件，支持常见视频格式如 MP4。",
            bgColor: "bg-violet-100 dark:bg-violet-500",
            textColor: "text-violet-500 dark:text-white"
          },
          {
            icon: <Download className="w-6 h-6" />,
            title: "便捷下载",
            description: "免安装使用，浏览器直接操作，移动端友好，随时随地分割视频。",
            bgColor: "bg-yellow-100 dark:bg-yellow-500",
            textColor: "text-yellow-500 dark:text-white"
          }
        ]
      }
      : {
        h1: "Video Splitter",
        lead:
          "A local, browser‑based video splitter — no install, no upload. Powered by FFmpeg WASM to slice by seconds. Privacy‑first and mobile‑friendly; files stay on your device.",
        leadShort: "Client‑side · No upload · Privacy‑first",
        howTitle: "How to use",
        steps: [
          "Click \"Choose video file\" to pick a video (common formats like MP4).",
          "Set segment length in seconds in \"Segment time (s)\" (default 10s).",
          "Click \"Start splitting\" and download the generated segments when done.",
        ],
        features: [
          {
            icon: <Zap className="w-6 h-6" />,
            title: "Fast Processing",
            description: "Powered by FFmpeg with optimized loading and execution, local processing with no server upload.",
            bgColor: "bg-primary-100 dark:bg-primary-500",
            textColor: "text-primary-500 dark:text-white"
          },
          {
            icon: <Scissors className="w-6 h-6" />,
            title: "Precise Splitting",
            description: "Split videos by exact time segments with customizable duration, frame-accurate precision.",
            bgColor: "bg-lime-100 dark:bg-lime-500",
            textColor: "text-lime-500 dark:text-white"
          },
          {
            icon: <FileVideo className="w-6 h-6" />,
            title: "Instant Preview",
            description: "Preview your video before processing to ensure you're working with the right file format.",
            bgColor: "bg-violet-100 dark:bg-violet-500",
            textColor: "text-violet-500 dark:text-white"
          },
          {
            icon: <Download className="w-6 h-6" />,
            title: "Easy Download",
            description: "No installation required, use directly in browser, mobile-friendly for splitting anywhere.",
            bgColor: "bg-yellow-100 dark:bg-yellow-500",
            textColor: "text-yellow-500 dark:text-white"
          }
        ]
      };

  return (
    <><Nav simple></Nav><div className="pt-10 bg-muted-100 dark:bg-muted-900 ">
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
                  <BaseHeading as="h2" className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-sm">
                    {t.howTitle}
                  </BaseHeading>
                  <Steps steps={t.steps} />
                </div>
              </div>

              {/* Reference Link Section */}
              <div className="mt-4 bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-xl p-4">
                <div className="space-y-3">
                  <BaseHeading as="h3" className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-xs">
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
                        : "Building Web Video Splitter with Cursor"
                      }
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
