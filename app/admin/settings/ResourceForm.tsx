"use client";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { getNavResourceItems } from "@/lib/getNavResourceItems";
import { type Prisma } from "@prisma/client";
import {
  BaseButton,
  BaseDropdown,
  BaseDropdownItem,
  BaseInput,
  BaseList,
  BaseListItem,
} from "@shuriken-ui/react";
import { useReducer, useRef, useState } from "react";

type Item = { title: string; subtitle: string; url: string };

export function ResourceForm({
  settings,
}: {
  settings: {
    key: string;
    value: Prisma.JsonValue;
  }[];
}) {
  const settingItemValue = settings.find(
    (e) => e.key === "nav_resource"
  )?.value;

  let resourceList = getNavResourceItems(settingItemValue as any[] | undefined);

  if (!Array.isArray(resourceList)) {
    resourceList = [resourceList];
  }

  const [value, setValue] = useState(resourceList);
  const ref = useRef<HTMLDivElement>(null);

  // todo: list 输入组件

  return (
    <div>
      <div ref={ref}>
        <BaseInput id="title" label="标题"></BaseInput>
        <BaseInput id="subtitle" label="副标题"></BaseInput>
        <BaseInput id="url" label="链接"></BaseInput>
      </div>
      <BaseButton
        onClick={() => {
          setValue((value) => {
            const el = ref.current!;
            const inputs = Array.from(el.querySelectorAll("input"));
            const json = Object.fromEntries(
              inputs.map((el) => [el.id, el.value])
            );
            return value.concat(json as Item);
          });
        }}
      >
        确定
      </BaseButton>
      <form action="/api/settings" method="POST">
        <input
          className="hidden"
          type="text"
          name="key"
          value={"nav_resource"}
        />
        {value.map((v) => (
          <textarea
            className="hidden"
            key={v.url}
            name="value"
            value={JSON.stringify(v)}
          ></textarea>
        ))}
        x<BaseButton type="submit">提交</BaseButton>
      </form>
      <BaseList>
        {value.map((e) => {
          return (
            <BaseListItem
              key={e.url}
              title={e.title}
              subtitle={e.subtitle}
              end={
                <BaseDropdown variant="context">
                  <BaseDropdownItem
                    title="删除"
                    onClick={() => {
                      setValue(value.filter((v) => v.url != e.url));
                    }}
                  ></BaseDropdownItem>
                </BaseDropdown>
              }
            ></BaseListItem>
          );
        })}
      </BaseList>
    </div>
  );
}
