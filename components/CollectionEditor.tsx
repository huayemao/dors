"use client";
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
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { CheckCircle2, Link, Link2 } from "lucide-react";
import { Panel } from "./Base/Panel";
import { markdownExcerpt } from "@/lib/utils";
import { evaluateSync } from '@mdx-js/mdx';
import remarkGfm from "remark-gfm";
import * as runtime from 'react/jsx-runtime'

type Item = {
  content: string;
  tags: string[];
  excerpt?: string;
  mdxContent?: FC;
};

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
  const lines = markdownText.split("\n");
  const jsonArr: Item[] = [];
  let currentContent: string[] = [];
  let lastTag = "";

  const headerRegex = /^## (.*)/; // 匹配Markdown的二级标题
  const separatorRegex = /^---$/; // 匹配分隔线

  function patchItem() {
    if (!lastTag) {
      return
    }
    const targetItem = jsonArr.find(
      (e) => e.content == currentContent.join("\n")
    );
    if (targetItem) {
      targetItem.tags.push(lastTag);
    } else {
      jsonArr.push({
        tags: [lastTag],
        content: currentContent.join("\n"),
      });
    }
  }

  lines.forEach((line) => {
    const headerMatch = line.match(headerRegex);
    const separatorMatch = line.match(separatorRegex);
    console.log(lastTag, currentContent);
    if (headerMatch) {
      // 找到新的标题，保存之前的内容
      if (currentContent[0]?.length > 0) {
        patchItem();
      }
      lastTag = headerMatch[1].trim();
      // 重置内容数组
      currentContent = [];
    } else if (separatorMatch) {
      // 找到分隔符，保存当前内容，并添加新标签
      if (currentContent[0]?.length > 0) {
        patchItem();
      }
      currentContent = []; // 重置内容数组
    } else {
      // 收集内容
      currentContent.push(line);
    }
  });

  // 添加最后一个条目
  if (currentContent[0]?.length > 0) {
    patchItem();
  }

  return jsonArr;
}

export default function CollectionEditor({
  markdown,
  onChange,
  json,
}: {
  markdown?: string;
  onChange?: (v) => void;
  json?: Item[]
}) {
  const d = useMemo(() => json || markdownToJson(markdown || markdownText), [markdown]);

  const [items, setItems] = useState<Item[]>(d);

  const [tags, setTags] = useState<string[]>([]);


  useEffect(() => {
    setItems(d)
  }, [d])

  useEffect(() => {
    if (items.some(e => e.content && !e.excerpt && !e.mdxContent)) {
      Promise.all(items.map(async (e) => {

        const Content = evaluateSync(e.content, {
          ...runtime as any,
          remarkPlugins: [remarkGfm],
        }).default

        return {
          ...e,
          excerpt: await markdownExcerpt(e.content),
          mdxContent: Content,
        }
      })).then(v => { setItems(v) })
    }


  }, [items])

  const getMd = useCallback((items) => {
    const allTags = Array.from(new Set(items.flatMap((e) => e.tags)));
    return allTags
      .map((t) => {
        // todo: 如果不存在换行，序列化成列表，而非用 --- 分割
        return (
          `## ${t}\n` +
          items
            .filter((item) => item.tags.includes(t))
            .map((e) => e.content)
            .join("\n---\n")
        );
      })
      .join("\n");
  }, []);



  const [content, setContent] = useState("");

  // 反序列化
  // 1. 正则匹配出标题
  // 2. 根据匹配出的文字找到 索引，根据索引位置、和 标题的长度，切割 字符串
  // or
  // 或者直接用 visit?

  return (
    <>
      <div suppressHydrationWarning className="grid md:grid-cols-3 gap-4">
        <Panel title="表单" description="表单">
          <BaseAutocomplete
            multiple
            allowCreate
            label="标签"
            items={["sdfa", "xxx"]}
            onChange={setTags}
            value={tags}
            rounded="md"
            icon="lucide:tag"
            placeholder="搜索..."
          ></BaseAutocomplete>
          <BaseTextarea label="内容" onChange={setContent} value={content} />
          <BaseButton
            color="primary"
            onClick={() => {
              setItems((items) => items.concat({ tags, content }));
              onChange?.(getMd(items.concat({ tags, content })));
            }}
          >
            确定
          </BaseButton>
        </Panel>
        {CollectionContent({ items })}
      </div>
    </>
  );
}
function CollectionContent({ items }: { items: Item[]; }) {
  const allTags = Array.from(new Set(items.flatMap((e) => e.tags)));

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

  return <Panel title="列表" description="" className="md:col-span-2 max-w-4xl">
    <div className="space-y-4">
      <div className="flex h-60">
        filers
        {/* todo：选择标签 */}
        {/* todo: 这个 在 focus 时就应该打开 dropdown 了 */}
        <BaseAutocomplete
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
          {items
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

