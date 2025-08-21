import dynamic from "next/dynamic";
import { ClientOnly } from "@/components/ClientOnly";
import LanguageSwitcher from "./LanguageSwitcher";

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
      ? ["视频", "分割", "处理", "Web", "FFmpeg", "在线工具", "本地处理", "无需上传", "隐私安全"]
      : ["video", "split", "splitter", "FFmpeg", "web", "online tool", "client-side", "no upload", "privacy"];

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
            "本地浏览器内视频分割工具，无需下载或上传，基于 FFmpeg WASM，按指定秒数切片；移动端适配，隐私优先，文件始终留在你的设备中。",
          leadShort: "本地处理·无需上传 · 隐私优先",
          howTitle: "使用指南",
          steps: [
            "点击“选择视频文件”，选择待分割视频（支持常见格式，如 MP4）；",
            "在“分割时间（秒）”输入框设置每段视频时长（默认 10 秒，可自定义）；",
            "点击“开始分割”，等待处理完成后，下载切片后的视频文件。",
          ],
          whyTitle: "优势亮点",
          bullets: [
            "本地处理：不上传服务器，数据不外泄；",
            "免安装：无需下载 Kdenlive 等重型软件，浏览器直接操作；",
            "移动端友好：适配手机端，随时随地分割视频；",
            "快速处理：基于 FFmpeg 优化，缩短加载与视频处理时间。",
          ],
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
          whyTitle: "Why choose this",
          bullets: [
            "Local processing: no server upload; your data stays private.",
            "No install: use it directly in your browser, no Kdenlive required.",
            "Mobile friendly: usable on phones, split anywhere, anytime.",
            "Fast processing: powered by FFmpeg with optimized loading and execution.",
          ],
        };

  return (
    <div className="min-h-screen bg-muted-100 dark:bg-muted-900 flex flex-col items-center">
      <div className="container max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-muted-900 dark:text-white">
              {t.h1}
            </h1>
            <p className="mt-1 text-sm text-muted-600 dark:text-muted-400">
              {t.leadShort}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <ClientOnly>
          <VideoSplitter lang={lang} />
        </ClientOnly>

        <div className="mt-10 w-full">
          <div className="bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-xl">
            <div className="px-6 py-8">
              <p className="text-sm text-muted-600 dark:text-muted-400 mb-6">
                {t.lead}
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <section>
                  <h2 className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-sm mb-3">
                    {t.howTitle}
                  </h2>
                  <ol className="ps-6 space-y-2 text-sm text-muted-700 dark:text-muted-300 list-decimal">
                    {t.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h2 className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-sm mb-3">
                    {t.whyTitle}
                  </h2>
                  <ul className="ps-6 space-y-2 text-sm text-muted-700 dark:text-muted-300 list-disc">
                    {t.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
