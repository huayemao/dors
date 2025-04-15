import { getAllCategories } from "@/lib/server/categories";
import prisma from "@/lib/prisma";
import { HiddenCatsForm } from "./HiddenCatsForm";
import { NavItemsConfig } from "./ResourceForm";
import { RevalidateButton } from "./RevalidateButton";
import { Panel } from "@/components/Base/Panel";
import { BaseButton, BaseInput, BaseTextarea } from "@shuriken-ui/react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({ params, searchParams }) {
  const cats = await getAllCategories({ includeHidden: true });
  const settings = await prisma.settings.findMany({});
  
  // 从 URL 参数中获取当前活动的标签页，默认为 "cache"
  const activeTab = searchParams?.tab || "cache";

  // 定义标签页
  const tabs = [
    { label: "缓存", value: "cache" },
    { label: "文章分类", value: "categories" },
    { label: "应用台", value: "navigation" },
    { label: "导航页内容", value: "nav-content" },
    { label: "原始数据", value: "raw-data" },
  ];

  return (
    <main className="w-full px-4 lg:px-8 py-4">
      <section className="space-y-4">
        {/* 标签页导航 */}
        <div className="flex border-b border-muted-200 dark:border-muted-700">
          {tabs.map((tab) => (
            <Link 
              key={tab.value}
              href={`/admin/settings?tab=${tab.value}`}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === tab.value
                  ? "border-b-2 border-primary-500 text-primary-500"
                  : "text-muted-500 hover:text-muted-700 dark:text-muted-400 dark:hover:text-muted-200"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* 标签页内容 */}
        <div className="mt-4">
          {activeTab === "cache" && (
            <Panel title="缓存">
              <RevalidateButton></RevalidateButton>
            </Panel>
          )}
          
          {activeTab === "categories" && (
            <Panel title="文章分类">
              <HiddenCatsForm settings={settings} cats={cats}></HiddenCatsForm>
            </Panel>
          )}
          
          {activeTab === "navigation" && (
            <Panel title="应用台" className="max-w-full w-fit">
              <NavItemsConfig settings={settings}></NavItemsConfig>
            </Panel>
          )}
          
          {activeTab === "nav-content" && (
            <Panel title="导航页内容对应 post id">
              <form action="/api/settings" method="POST">
                <input
                  className="hidden"
                  type="text"
                  // @ts-ignore
                  name="key"
                  value={"nav_content_post_id"}
                />
                <BaseInput
                  // @ts-ignore
                  name="value"
                  defaultValue={
                    (
                      settings.find((e) => e.key === "nav_content_post_id")
                        ?.value as number[]
                    )[0] || ""
                  }
                />
                <BaseButton type="submit">提交</BaseButton>
              </form>
            </Panel>
          )}
          
          {activeTab === "raw-data" && (
            <Panel title="原始数据">
              <BaseTextarea value={JSON.stringify(settings)}></BaseTextarea>
            </Panel>
          )}
        </div>
      </section>
    </main>
  );
}
