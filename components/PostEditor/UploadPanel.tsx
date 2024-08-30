"use client";
import { copyTextToClipboard } from "@/lib/utils";
import { UploadForm } from "../UploadForm";
import { FileItem, FileList } from "../FileList";
import { useEffect, useState } from "react";

export function UploadPanel() {
  const [files, setFiles] = useState<FileItem[]>([]);
  useEffect(() => {
    fetch("/api/files/getLatestFile")
      .then((res) => res.json()).then((list: FileItem[]) => {
        setFiles(list)
      })
  }, [])
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
        }} />
      <FileList list={files} />
    </>
  );
}
