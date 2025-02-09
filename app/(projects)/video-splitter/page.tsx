const VideoSplitter = dynamic(() => import("./VideoSplitter"), { ssr: false });
import { ClientOnly } from "@/components/ClientOnly";
import dynamic from "next/dynamic";

export default function Page() {
  return (
    <div className="min-h-screen bg-muted-100 dark:bg-muted-900 flex flex-col items-center">
      <div className="container max-w-5xl mx-auto py-10 px-4">
        <ClientOnly>
          <VideoSplitter />
        </ClientOnly>
      </div>
    </div>
  );
}

export const metadata = {
  title: "视频分割器",
  description: "使用视频分割器进行视频处理，能够快速将长视频分割成多个短片段，方便分享和编辑。",
  category: "工具",
  keywords: ["视频", "分割", "处理"],
};
