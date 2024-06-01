"use client";

import { Share2 } from "lucide-react";

export const ShareButton = ({ options }) => {
  const share = async () => {
    try {
      await navigator.share({ ...options, url: window.location.href });
    } catch (err) {}
    /* @ts-ignore */
    window.setShareInfo({ ...options, url: window.location.href });
  };

  return (
    <button
      onClick={share}
      className="flex-1 inline-flex justify-center items-center py-4 px-5 rounded bg-muted-200 dark:bg-muted-700 hover:bg-muted-100 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 transition-colors duration-300 cursor-pointer tw-accessibility
"
    >
      <Share2 className="w-4 h-4 " fill="currentColor" />
    </button>
  );
};
