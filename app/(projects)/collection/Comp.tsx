"use client"
import { BaseButton, BaseCard, BaseIconBox, BaseList, BaseListboxItem, BaseListItem, BaseTag, BaseTextarea, IconCheckCircle } from "@shuriken-ui/react";
import { useMemo, useReducer, useState } from "react";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { CheckCircle2, Link, Link2 } from "lucide-react";

type Item = {
    content: string;
    tags: string[]

}


const markdownText = `
## 标签一
项目一 xxx
xxx
xxx
## 标签二
项目一 xxx
xxx
xxx
---
项目二 xxx
xxx
xxx
---
项目三 xxx
xxx
xxx
---
dsafassdfsdf
## 标签三
dsafassdfsdf
`;

function markdownToJson(markdownText) {
    const lines = markdownText.split('\n');
    const jsonArr: Item[] = [];
    let currentContent: string[] = [];
    let lastTag = '';

    const headerRegex = /^## (.*)/; // 匹配Markdown的二级标题
    const separatorRegex = /^---$/; // 匹配分隔线

    function patchItem() {
        const targetItem = jsonArr.find(e => e.content == currentContent.join('\n'));
        if (targetItem) {
            targetItem.tags.push(lastTag);
        }
        else {
            jsonArr.push({
                tags: [lastTag],
                content: currentContent.join('\n')
            });
        }
    }

    lines.forEach(line => {
        const headerMatch = line.match(headerRegex);
        const separatorMatch = line.match(separatorRegex);
        console.log(lastTag, currentContent)
        if (headerMatch) {
            // 找到新的标题，保存之前的内容
            if (currentContent[0].length > 0) {
                patchItem();
            }
            lastTag = headerMatch[1].trim();
            // 重置内容数组
            currentContent = [];
        } else if (separatorMatch) {
            // 找到分隔符，保存当前内容，并添加新标签
            if (currentContent[0].length > 0) {
                patchItem()
            }
            currentContent = []; // 重置内容数组
        } else {
            // 收集内容
            currentContent.push(line);
        }


    });

    // 添加最后一个条目
    if (currentContent[0].length > 0) {
        patchItem()
    }

    return jsonArr;
}




export default function Content() {


    const [items, setItems] = useState<Item[]>(markdownToJson(markdownText))
    const [tags, setTags] = useState<string[]>(
        []
    );

    const allTags = Array.from(new Set(items.flatMap(e => e.tags)))


    const md = useMemo(() => allTags.map(t => {
        // todo: 如果不存在换行，序列化成列表，而非用 --- 分割
        return `## ${t}\n` + items.filter(item => item.tags.includes(t)).map(e => e.content).join('\n---\n')
    }
    ).join('\n'), [items])

    const [filters, dispatch] = useReducer((state, action) => {
        if (action.type == 'setTags') {
            return {
                tags: action.payload
            }
        }
        return {
            tags: [],
        }
    }, {
        tags: [],
    })

    const [content, setContent] = useState(
        ''
    );
    console.log(tags)

    // 反序列化
    // 1. 正则匹配出标题
    // 2. 根据匹配出的文字找到 索引，根据索引位置、和 标题的长度，切割 字符串
    // or
    // 或者直接用 visit?

    return (
        <>
            <div suppressHydrationWarning>
                <BaseAutocomplete
                    multiple
                    allowCreate
                    label="标签"
                    items={['sdfa', 'xxx']}
                    onChange={setTags}
                    value={tags}
                    rounded="md"
                    icon="lucide:tag"
                    placeholder="搜索..."
                ></BaseAutocomplete>
                <BaseTextarea label="内容" onChange={setContent} value={content} />
                <BaseButton onClick={() => {
                    setItems(items.concat({ tags, content }))
                }}>确定</BaseButton>
            </div>
            <section className="space-y-4 p-6">
                filer
                {/* todo：选择标签 */}
                {/* todo: 这个 在 focus 时就应该打开 dropdown 了 */}
                <BaseAutocomplete
                    multiple
                    label="标签"
                    items={allTags}
                    onChange={(v) => {
                        dispatch({
                            payload: v,
                            type: 'setTags'
                        })
                    }}
                    value={filters.tags}
                    rounded="md"
                    icon="lucide:list-filter"
                    placeholder="搜索..."
                ></BaseAutocomplete>
                {/* todo: 如果是链接也不能直接打开吗 */}
                <BaseCard className="p-6">
                    <BaseList media className="bg-white max-w-4xl">
                        {/* todo：还要能够打开详情 */}
                        {items.filter(item => filters.tags.every(t => item.tags.includes(t))).map(e =>
                            <BaseListItem
                                // @ts-ignore
                                title={<a href="sdfsdf">{e.content}</a>} subtitle={e.content} end={<div>
                                    {e.tags.map(e => <BaseTag size="sm" color="primary">{e}</BaseTag>)}
                                </div>}>
                                <div className="flex items-center justify-center mr-2">
                                    <BaseIconBox mask="blob" >
                                        <a href="baidu.com"><Link2 className="w-5 h-5" strokeWidth={1} /></a>
                                    </BaseIconBox>
                                </div>
                            </BaseListItem>
                        )
                        }
                    </BaseList>
                </BaseCard>
                <pre>
                    {md}
                </pre>
                <pre>
                    {JSON.stringify(items)}
                </pre>
            </section>
        </>
    );
}



