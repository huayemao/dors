"use client";
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
      </div>ga
    </div>
  );
}
