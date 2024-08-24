"use client";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { type Prisma } from "@prisma/client";
import { useState } from "react";

export function HiddenCatsForm({
  settings,
  cats,
}: {
  settings: {
    key: string;
    value: Prisma.JsonValue;
  }[];
  cats: { id: number; name: string | null }[];
}) {
  let hiddenCats =
    (settings.find((e) => e.key === "hidden_categories")?.value as []) || [];

  if (typeof hiddenCats === "string") {
    hiddenCats = JSON.parse(hiddenCats);
  }

  if (!Array.isArray(hiddenCats)) {
    // @ts-ignore
    hiddenCats = [hiddenCats];
  }

  const [value, setValue] = useState(
    hiddenCats.map((e) => cats.find((c) => c.id == e)!).sort()
  );

  return (
    <form action="/api/settings" method="POST">
      <input
        type="text"
        className="hidden"
        value={"hidden_categories"}
        name="key"
      />
      隐藏的分类
      {/* todo: 这个要抽一个组件 */}
      <select multiple id="hidden_categories" name="value" className="hidden">
        {value
          .map((e) => e.id)
          .map((e) => {
            return (
              <option value={e} key={e} selected>
                {e}
              </option>
            );
          })}
      </select>
      <BaseAutocomplete
        value={value}
        onChange={setValue}
        properties={{ label: "name", value: "id" }}
        items={cats}
        rounded="md"
        icon="lucide:list-filter"
        placeholder="搜索..."
        label="分类"
        multiple
      />
      <button type="submit">提交</button>
    </form>
  );
}
