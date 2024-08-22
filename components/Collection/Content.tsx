
"use client"
import { FC, useCallback, useReducer, useEffect, useMemo, useState, useLayoutEffect } from "react";
import { markdownExcerpt } from "@/lib/utils";
import { evaluateSync } from '@mdx-js/mdx';
import remarkGfm from "remark-gfm";
import * as runtime from 'react/jsx-runtime'
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { CheckCircle2, Link, Link2 } from "lucide-react";
import {
    BaseButton,
    BaseCard,
    BaseIconBox,
    BaseList,
    BaseListboxItem,
    BaseListItem,
    BaseTag,
    BaseTextarea,
    IconCheckCircle,
} from "@shuriken-ui/react";
import { Panel } from "../Base/Panel";
import { type Item } from "./CollectionEditor";


export default function CollectionContent({ items }: { items: Item[]; }) {
    const [derivedItems, setDerivedItems] = useState(items)
    const allTags = useMemo(() => Array.from(new Set(derivedItems.flatMap((e) => e.tags))), [derivedItems]);

    const [filters, dispatch] = useReducer(
        (state, action) => {
            if (action.type == "setTags") {
                return {
                    tags: action.payload as string[],
                };
            }
            return {
                tags: [] as string[],
            };
        },
        {
            tags: [] as string[],
        }
    );

    useEffect(() => {
        if (derivedItems.some(e => e.content && !e.excerpt && !e.mdxContent)) {
            Promise.all(derivedItems.map(async (e) => {
                const Content = evaluateSync(e.content, {
                    ...runtime as any,
                    remarkPlugins: [remarkGfm],
                }).default

                return {
                    ...e,
                    excerpt: await markdownExcerpt(e.content),
                    mdxContent: Content,
                }
            })).then(v => {
                setDerivedItems(v)
            })
        }
    }, [items, derivedItems])

    useLayoutEffect(() => {
        const items = document.querySelectorAll('.nui-list-item h6,p');
        items.forEach((e) => {
            const node = Array.from(e.querySelectorAll('*')).find(e => e.childNodes.length == 1 && e.childNodes[0].nodeType == 3) || e
            if (node && !node.classList.contains('truncate')) {
                node.classList.add('truncate')
                node.classList.add('max-w-52')
                node.classList.add('md:max-w-md')
                node.classList.add('lg:max-w-lg')
            }
        })
    }, [derivedItems])

    return <div className="space-y-4">
        <div className="flex h-32 border-b gap-4" >
            filers
            {/* todo：选择标签 */}
            {/* todo: 这个 在 focus 时就应该打开 dropdown 了 */}
            <BaseAutocomplete
                size="sm"
                multiple
                label="标签"
                items={allTags}
                onChange={(v) => {
                    dispatch({
                        payload: v,
                        type: "setTags",
                    });
                }}
                value={filters.tags}
                rounded="md"
                icon="lucide:list-filter"
                placeholder="搜索..."
                dropdown
            ></BaseAutocomplete>
        </div>
        {/* todo: 如果是链接也不能直接打开吗 */}
        <BaseCard className="p-6">
            <BaseList media className="bg-white max-w-4xl">
                {/* todo：还要能够打开详情 */}
                {derivedItems
                    .filter((item) => filters.tags.every((t) => item.tags.includes(t))
                    )
                    .map((e) => (
                        <BaseListItem
                            key={e.content}
                            // @ts-ignore
                            title={e.mdxContent?.()}
                            subtitle={e.excerpt}
                            end={
                                <div className="flex gap-2 flex-nowrap max-w-24 md:max-w-xs lg:max-w-sm items-start overflow-x-auto p-2">
                                    {e.tags.map((e) => (
                                        <div key={e} className="cursor-pointe flex-shrink-0" >
                                            <BaseTag rounded="sm" onClick={() => { dispatch({ type: 'setTags', payload: Array.from(new Set(filters.tags.concat(e))) }) }} key={e} size="sm" color="primary">
                                                <span>{e}</span>
                                            </BaseTag>
                                        </div>
                                    ))}
                                </div>}
                        >
                            {/* <div className="flex items-center justify-center mr-2">
                                <BaseIconBox mask="blob">
                                    <a href="baidu.com">
                                        <Link2 className="w-5 h-5" strokeWidth={1} />
                                    </a>
                                </BaseIconBox>
                            </div> */}
                        </BaseListItem>
                    ))}
            </BaseList>
        </BaseCard>
    </div>
        ;
}
