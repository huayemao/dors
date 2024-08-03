"use client";
import { copyTextToClipboard } from "@/lib/utils";

export function EmojiItem({ text }: { text: string }) {
  return (
    <button
      onClick={() => {
        copyTextToClipboard(text).then(() => alert("已复制到剪贴板"));
      }}
      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 cursor-pointer transition-colors"
    >
      {text}
    </button>
  );
}

export function EmojiPanel() {
  return (
    <div className="flex gap-3 p-8 flex-wrap">
      {["👍", "✅", "⭐", "👎", "❌", "💔", "✓", "🐈"].map((e) => (
        <EmojiItem key={e} text={e}></EmojiItem>
      ))}
    </div>
  );
}
