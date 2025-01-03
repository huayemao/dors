"use client";
import { copyTextToClipboard } from "@/lib/utils";
import { UploadForm } from "../UploadForm";
import { FileList } from "../FileList";
import { Suspense } from "react";
import { ClientOnly } from "../ClientOnly";

export function UploadPanel() {
  return (
    <>
      <UploadForm
        onSubmit={(e) => {
          e.preventDefault();
          const formEl = e.target as HTMLFormElement;
          const formData = new FormData(formEl);
          fetch("/api/files", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.text())
            .then(copyTextToClipboard)
            .then(() => {
              alert("已复制到剪贴板");
              close();
            });
        }}
      />
      <ClientOnly>
        <FileList />
      </ClientOnly>
    </>
  );
}
