"use client"
import { BaseButtonIcon } from "@shuriken-ui/react";
import { TrashIcon } from "lucide-react";

export function DeleteFileButton({ file }: { file: { id: number; name: string; size: bigint | null; mimeType: string; }; }) {
  return <BaseButtonIcon
    onClick={() => {
      fetch("/api/files/" + file.id, { method: "DELETE" }).then(
        (res) => {
          if (res.status == 200) {
            alert("删除成功");
          }
        }
      );
    }}
  >
    <TrashIcon></TrashIcon>
  </BaseButtonIcon>;
}
