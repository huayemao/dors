"use client";
import {
  FC,
  useCallback,
  useReducer,
  useEffect,
  useMemo,
  useState,
  useLayoutEffect,
} from "react";
import { markdownExcerpt } from "@/lib/utils";
import { evaluateSync } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";

import {
  BaseButton,
  BaseButtonIcon,
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseIconBox,
  BaseList,
  BaseListbox,
  BaseListboxItem,
  BaseListItem,
  BaseTag,
  BaseTextarea,
  IconCheckCircle,
} from "@shuriken-ui/react";
import { type Item } from "./CollectionEditor";
import { Modal } from "../Base/Modal";
import { components } from "@/lib/mdx/useComponents";
import Prose from "../Base/Prose";
import { Edit } from "lucide-react";
import { parseMDXClient } from "@/lib/mdx/parseMDXClient";

export default function CollectionContent({ items }: { items: Item[] }) {
  const [derivedItems, setDerivedItems] = useState(items);
  useEffect(() => {
    setDerivedItems(items);
  }, [items]);

  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const allTags = useMemo(
    () => Array.from(new Set(derivedItems.flatMap((e) => e.tags))),
    [derivedItems]
  );

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
    if (derivedItems.some((e) => e.content && !e.excerpt && !e.mdxContent)) {
      Promise.all(
        derivedItems.map(async (e) => {
          const Content = parseMDXClient(e.content);
          return {
            ...e,
            excerpt: await markdownExcerpt(e.content),
            mdxContent: Content,
          };
        })
      ).then((v) => {
        setDerivedItems(v);
      });
    }
  }, [items, derivedItems]);

  useLayoutEffect(() => {
    const items = document.querySelectorAll(
      ".nui-list-item h6, nui-list-item p"
    );
    items.forEach((e) => {
      const node =
        Array.from(e.querySelectorAll("*")).find(
          (e) => e.childNodes.length == 1 && e.childNodes[0].nodeType == 3
        ) || e;
      if (node && !node.classList.contains("truncate")) {
        node.classList.add("truncate");
        node.classList.add("max-w-52");
        node.classList.add("md:max-w-md");
        node.classList.add("lg:max-w-lg");
      }
    });
  }, [derivedItems]);

  return (
    <div className="space-y-4">
      <div className="flex py-2 border-b gap-4 items-center">
        <BaseListbox
          label="标签"
          labelFloat
          onChange={(v) => {
            dispatch({
              payload: v,
              type: "setTags",
            });
          }}
          multiple
          items={allTags}
          size="sm"
        ></BaseListbox>
        <BaseDropdown label="Dropdown" size="md" variant="context">
          <BaseDropdownItem
            title="Profile"
            text="View your profile"
            rounded="sm"
          />
        </BaseDropdown>
      </div>
      {/* todo: 如果是链接也不能直接打开吗 */}
      <BaseCard className="p-6">
        <BaseList media className="bg-white max-w-4xl">
          {/* todo：还要能够打开详情 */}
          {derivedItems
            .filter((item) => filters.tags.every((t) => item.tags.includes(t)))
            .map((e) => (
              <BaseListItem
                // @ts-ignore
                title={e.excerpt?.trim() || "见内容"}
                // @ts-ignore
                subtitle={
                  <>
                    <div className="flex gap-2 flex-nowrap  items-start overflow-x-auto py-1">
                      {e.tags.map((e) => (
                        <div key={e} className="cursor-pointer flex-shrink-0">
                          <BaseTag
                            onClick={() => {
                              dispatch({
                                type: "setTags",
                                payload: Array.from(
                                  new Set(filters.tags.concat(e))
                                ),
                              });
                            }}
                            key={e}
                            size="sm"
                            variant="outline"
                            color="primary"
                          >
                            {e}
                          </BaseTag>
                        </div>
                      ))}
                    </div>
                  </>
                }
                key={e.excerpt}
                end={
                  <BaseDropdown
                    placement="bottom-end"
                    label="Dropdown"
                    variant="context"
                    fixed
                  >
                    <BaseDropdownItem
                      title="详情"
                      text="查看详情"
                      rounded="sm"
                      onClick={() => {
                        setActiveItem(e);
                      }}
                    />
                  </BaseDropdown>
                }
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
        <Modal
          title={activeItem?.excerpt?.slice(0, 20) || ""}
          open={!!activeItem}
          onClose={() => {
            setActiveItem(null);
          }}
          actions={
            <>
              <BaseButtonIcon>
                <Edit></Edit>
              </BaseButtonIcon>
            </>
          }
        >
          <div className="flex justify-center">
            <Prose content={activeItem?.mdxContent?.({})}></Prose>
          </div>
        </Modal>
      </BaseCard>
    </div>
  );
}
