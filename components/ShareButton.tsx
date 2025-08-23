"use client";

import { BaseButton } from "@glint-ui/react";
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
    <BaseButton className="flex-1" size="lg" onClick={share} color="muted">
      <Share2 className="w-4 h-4 " fill="currentColor" />
    </BaseButton>
  );
};
