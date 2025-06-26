"use client";
import { Modal } from "@/components/Base/Modal";
import { PreviewModal } from "@/components/Base/PreviewModal";
import { ClientOnly } from "@/components/ClientOnly";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

export default function Container({
  children,
  title = undefined,
}: {
  children: ReactNode;
  title?: string;
}) {
  const router = useRouter();
  return (
    <PreviewModal
      open={true}
      onClose={() => {
        router.back();
      }}
    >
      {children}
    </PreviewModal>
  );
}
