"use client"

import { humanFileSize } from "@/lib/utils";
import {
    BaseCard,
    BaseDropdown,
    BaseDropdownItem,
    BaseIconBox,
    BaseList,
    BaseListItem,
} from "@shuriken-ui/react";
import { FileIcon, ImageIcon } from "lucide-react";
import { DeleteFileButton } from "./DeleteFileButton";
import { SITE_META } from "@/constants";
import LightBox from "@/components/Lightbox";
import { Figure } from "@/components/Figure";
import { Popover } from "@headlessui/react";

export function FileList({ list }: { list: { id: number; name: string; size: bigint | null; mimeType: string; }[]; }) {
    return <BaseList className="w-full">
        {list.map((e, i) => {
            const sizeStr = e.size ? humanFileSize(e.size / BigInt(8)) : "unknown size";
            return <BaseListItem
                key={e.id}
                //  @ts-ignore 
                title={<span className="truncate inline-block max-w-[12em] md:max-w-xs">{e.name}</span>}
                subtitle={['#' + e.id, sizeStr, e.mimeType,].join('  ')}
                end={<BaseDropdown variant="context">
                    <BaseDropdownItem>
                        <DeleteFileButton file={e}></DeleteFileButton>
                    </BaseDropdownItem>
                </BaseDropdown>}
            >
                <BaseDropdown variant="text" renderButton={() => {
                    return <BaseIconBox mask="blob" color="success" rounded="none" variant="pastel" size="md">
                        {e.mimeType.startsWith("image") ? (
                            // @ts-ignore
                            <ImageIcon strokeWidth={1} className="h-6 w-6"></ImageIcon>
                        ) : (
                            <FileIcon strokeWidth={1} className="h-6 w-6"></FileIcon>
                        )}
                    </BaseIconBox >
                }}>
                    <div>
                        <Figure ignoreCaption alt={e.name} src={encodeURI(`${SITE_META.url}/api/files/${e.name}`)} />
                    </div>
                </BaseDropdown>
                {/* <Popover  className="relative">
                    <Popover.Button>
                        <div className="flex items-center w-10 h-10">
                            {e.mimeType.startsWith("image") ? (
                                // @ts-ignore
                                <ImageIcon strokeWidth={1} className="h-6 w-6"></ImageIcon>
                            ) : (
                                <FileIcon strokeWidth={1} className="h-6 w-6"></FileIcon>
                            )}
                        </div>
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10">
                        <BaseCard shadow="flat" className="w-64 h-48 grid grid-cols-2">
                            <Figure loading="lazy" ignoreCaption width={40} height={40} alt={e.name} src={encodeURI(`${SITE_META.url}/api/files/${e.name}`)} />
                        </BaseCard>
                    </Popover.Panel>
                </Popover> */}
            </BaseListItem>
                ;

        })}
    </BaseList >;
}