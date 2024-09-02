"use client"
import { copyTextToClipboard, humanFileSize } from "@/lib/utils";
import { BaseDropdown, BaseDropdownItem } from "@shuriken-ui/react";
import { CopyIcon, FileIcon, ImageIcon, TrashIcon } from "lucide-react";
import { getFilePath } from "@/lib/client/utils/getFilePath";
import { FileItem } from "./FileList";
import toast from "react-hot-toast";
export function FileActions({ e, admin }: { e: FileItem; admin: boolean }) {
  return (
    <BaseDropdown variant="text" renderButton={() => null} >
      <BaseDropdownItem
        start={<CopyIcon className="w-5 h-5"></CopyIcon>}
        title="复制文件路径"
        onClick={() => {
          copyTextToClipboard(getFilePath(e.name)).then(() => {
            toast("已复制到剪贴板")
          });
        }}
      ></BaseDropdownItem>
      {admin && (
        <BaseDropdownItem
          start={<TrashIcon className="w-5 h-5"></TrashIcon>}
          title="删除文件"
          onClick={() => {
            fetch("/api/files/" + e.id, { method: "DELETE" }).then((res) => {
              if (res.status == 200) {
                toast("删除成功");
              }
            }).catch((e) => {
              toast("操作失败")
            });
          }}
        ></BaseDropdownItem>
      )}
    </BaseDropdown>
  );
}
