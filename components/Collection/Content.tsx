
"use client"
import { FC, useCallback, useReducer, useEffect, useMemo, useState } from "react";
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
    const [, forceUpdate] = useReducer((bool) => !bool, false);
    const [derivedItems, setDerivedItems] = useState(items)
    const allTags = Array.from(new Set(derivedItems.flatMap((e) => e.tags)));

    const [filters, dispatch] = useReducer(
        (state, action) => {
            if (action.type == "setTags") {
                return {
                    tags: action.payload,
                };
            }
            return {
                tags: [],
            };
        },
        {
            tags: [],
        }
    );

    useEffect(() => {
        if (derivedItems.some(e => e.content && !e.excerpt && !e.mdxContent)) {
            console.log(111)
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

    return <Panel title="列表" description="" className="md:col-span-2 max-w-4xl">
        <div className="space-y-4">
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
                                end={<div className="flex gap-2">
                                    {e.tags.map((e) => (
                                        <BaseTag key={e} size="sm" color="primary">
                                            {e}
                                        </BaseTag>
                                    ))}
                                </div>}
                            >
                                <div className="flex items-center justify-center mr-2">
                                    <BaseIconBox mask="blob">
                                        <a href="baidu.com">
                                            <Link2 className="w-5 h-5" strokeWidth={1} />
                                        </a>
                                    </BaseIconBox>
                                </div>
                            </BaseListItem>
                        ))}
                </BaseList>
            </BaseCard>
        </div>
    </Panel>;
}
