"use client";
import {
  BaseButton,
  BaseTextarea,
} from "@shuriken-ui/react";
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { Panel } from "../Base/Panel";
import CollectionContent from "./Content";
import { markdownToJson } from "./markdownToJson";

export type Item = {
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
        <CollectionContent items={items} />
      </div>
    </>
  );
}



