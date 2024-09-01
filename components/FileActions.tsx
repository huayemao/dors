import { copyTextToClipboard, humanFileSize } from "@/lib/utils";
import { BaseDropdown, BaseDropdownItem } from "@shuriken-ui/react";
import { CopyIcon, FileIcon, ImageIcon, TrashIcon } from "lucide-react";
import { SITE_META } from "@/constants";
import LightBox from "@/components/Base/LightBox";
import { Figure } from "@/components/Figure";
import { Popover } from "@headlessui/react";
import { getFilePath } from "@/lib/client/utils/getFilePath";
import { FileItem } from "./FileList";
export function FileActions({ e, admin }: { e: FileItem; admin: boolean }) {
  return (
    <BaseDropdown variant="context">
      <BaseDropdownItem
        start={<CopyIcon className="w-5 h-5"></CopyIcon>}
        title="复制文件路径"
        onClick={() => {
          copyTextToClipboard(getFilePath(e.name));
        }}
      ></BaseDropdownItem>
      {admin && (
        <BaseDropdownItem
          start={<TrashIcon className="w-5 h-5"></TrashIcon>}
          title="删除文件"
          onClick={() => {
            fetch("/api/files/" + e.id, { method: "DELETE" }).then((res) => {
              if (res.status == 200) {
                alert("删除成功");
              }
            });
          }}
        ></BaseDropdownItem>
      )}
    </BaseDropdown>
  );
}
