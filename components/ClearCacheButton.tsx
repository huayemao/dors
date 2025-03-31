'use client';

import { cn } from "@/lib/utils";
import { BaseButton } from "@shuriken-ui/react";
import { toast } from "react-hot-toast";

interface Props {
    path: string;
    className?: string
}

export function ClearCacheButton({ path, className }: Props) {
    const deleteCache = () => {
        navigator.serviceWorker.getRegistration().then((r) => {
            if (!r) {
                return;
            }
            const { waiting, active } = r;
            if (waiting) {
                waiting.postMessage({ type: "skip-waiting" });
                return;
            }
            active?.postMessage({
                type: "revalidate-page",
                path
            });

            navigator.serviceWorker.addEventListener("message", function (event) {
                const { type, path: responsePath } = event.data;
                if (type === "revalidate-success" && path === responsePath) {
                    toast("缓存已清除！");
                    window.location.reload();
                }
            });
        });
    };

    return (
        <BaseButton
            variant="pastel"
            size="sm"
            onClick={deleteCache}
            className={cn(className)}
        >
            刷新页面缓存
        </BaseButton>
    );
} 