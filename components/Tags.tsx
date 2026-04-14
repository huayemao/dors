"use client";
import { TagsContext } from "@/contexts/tags";
import { useContext, useState } from "react";
import {
  BaseButton,
  BaseButtonAction,
  BaseCard,
  BaseHeading,
  BaseTag,
} from "@glint-ui/react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Hash } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";

export function Tags({ simple }: { simple: boolean }) {
  const tags = useContext(TagsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // 按首字母分组
  const groupedTags = tags.reduce((acc, tag) => {
    if (!tag.name) return acc;
    const firstLetter = tag.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tag);
    return acc;
  }, {} as Record<string, typeof tags>);

  // 过滤标签
  const filteredTags = tags.filter(tag => {
    if (!tag.name) return false;
    return tag.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 计算标签大小（基于使用频率）
  const getTagSize = (count: number) => {
    if (count > 20) return "md";
    if (count > 10) return "sm";
    return "sm";
  };

  // 计算标签颜色（基于使用频率）
  const getTagColor = (count: number) => {
    if (count > 20) return "primary";
    if (count > 10) return "info";
    if (count > 5) return "light";
    return "muted";
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // 显示搜索结果或分组标签
  const displayTags = searchTerm
    ? filteredTags.slice(0, simple ? 10 : undefined)
    : tags.slice(0, simple ? 10 : undefined);

  return (
    <div className="space-y-6">
      <SearchInput
        value={searchTerm}
        onChange={(v: string) => setSearchTerm(v)}
        placeholder="搜索标签..."
      />

      {/* 搜索结果 */}
      {searchTerm && (
        <div className="flex flex-wrap gap-3">
          {displayTags.map(({ name, id, tags_posts_links }) => (
            <Link 
              href={`/tags/${id}`} 
              key={id} 
              className="group"
            >
              <BaseTag
                size={getTagSize(tags_posts_links.length)}
                variant="solid"
                shadow="hover"
                color={getTagColor(tags_posts_links.length)}
              >
                <span className="font-medium">{name}</span>
                <span className="ml-2 text-sm opacity-60">({tags_posts_links.length})</span>
              </BaseTag>
            </Link>
          ))}
          {displayTags.length === 0 && (
            <p className="text-muted-foreground py-8 text-center w-full">没有找到匹配的标签</p>
          )}
        </div>
      )}

      {/* 标签云（非搜索模式） */}
      {!searchTerm && !simple && (
        <div className="space-y-6">
          {Object.entries(groupedTags)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, groupTags]) => (
              <div key={group} className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  onClick={() => toggleGroup(group)}
                >
                  <BaseHeading as="h3" className="text-lg font-bold text-gray-800 flex items-center">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg mr-3">
                      {group}
                    </span>
                    <span className="text-sm text-gray-500">({groupTags.length}个标签)</span>
                  </BaseHeading>
                  <BaseButton
                    size="sm"
                    className="h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {expandedGroups[group] ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </BaseButton>
                </div>
                {(expandedGroups[group] || Object.keys(expandedGroups).length === 0) && (
                  <div className="flex flex-wrap gap-2 pl-4">
                    {groupTags.map(({ name, id, tags_posts_links }) => (
                      <Link 
                        href={`/tags/${id}`} 
                        key={id} 
                        className="group"
                      >
                        <BaseTag
                          size={getTagSize(tags_posts_links.length)}
                          variant="solid"
                          shadow="hover"
                          color={getTagColor(tags_posts_links.length)}
                        >
                          <span className="font-medium">{name}</span>
                          <span className="ml-2 text-sm opacity-60">({tags_posts_links.length})</span>
                        </BaseTag>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* 简单模式标签 */}
      {!searchTerm && simple && (
        <div className="flex flex-wrap gap-3">
          {displayTags.map(({ name, id, tags_posts_links }) => (
            <Link 
              href={`/tags/${id}`} 
              key={id} 
              className="group"
            >
              <BaseTag
                size={getTagSize(tags_posts_links.length)}
                variant="solid"
                shadow="hover"
                color={getTagColor(tags_posts_links.length)}
                className="px-4 py-2 rounded-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:bg-primary/5"
              >
                <Hash className="h-3 w-3 mr-1" />
                <span className="font-medium">{name}</span>
                <span className="ml-2 text-sm opacity-60">({tags_posts_links.length})</span>
              </BaseTag>
            </Link>
          ))}
          <Link href="/tags">
            <BaseButtonAction 
              color="primary"
              className="px-5 py-2 rounded-full hover:scale-105 transition-all duration-300 shadow-sm hover:shadow"
            >
              更多标签
            </BaseButtonAction>
          </Link>
        </div>
      )}
    </div>
  );
}
