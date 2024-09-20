import { BaseButtonIcon, BaseDropdown, BaseDropdownItem } from "@shuriken-ui/react"
import { Plus } from "lucide-react"
import { EmojiPanel } from "../EmojiPanel";
import { UploadPanel } from "./UploadPanel";
import { useNavigate } from "react-router-dom";
import { withModal } from "./withModal";

export const addActionRoutes = [{
    path: "upload",
    Component: withModal(UploadPanel, "文件"),
},
{
    path: "emoji",
    Component: withModal(
        EmojiPanel,
        "常用表情符号",
    ),
},]

export const AddAction = ({ base = './' }: { base?: string }) => {
    const nav = useNavigate();
    return <BaseDropdown
        renderButton={() => (
            <BaseButtonIcon rounded="md" size="sm">
                <Plus className="h-4 w-4" />
            </BaseButtonIcon>
        )}
    >
        <BaseDropdownItem
            onClick={() => nav(`${base}upload`)}
            title="上传文件"
        ></BaseDropdownItem>
        <BaseDropdownItem
            onClick={() => nav(`${base}emoji`)}
            title="Unicode 表情"
        />
    </BaseDropdown>
}