import { getAllCategories } from "@/lib/server/categories";
import prisma from "@/lib/prisma";
import { HiddenCatsForm } from "./HiddenCatsForm";
import { NavItemsConfig } from "./ResourceForm";
import { RevalidateButton } from "./RevalidateButton";
import { Panel } from "@/components/Base/Panel";
import { BaseButton, BaseInput, BaseTextarea } from "@shuriken-ui/react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({ params }) {
  const cats = await getAllCategories({ includeHidden: true });
  const settings = await prisma.settings.findMany({});

  return (
    <main className="w-full px-4 lg:px-8 py-4">
      <section className="space-y-4">
        <Panel title="缓存">
          <RevalidateButton></RevalidateButton>
        </Panel>
        <Panel title="文章分类">
          <HiddenCatsForm settings={settings} cats={cats}></HiddenCatsForm>
        </Panel>
        <Panel title="导航栏" className="max-w-full w-fit">
          <NavItemsConfig settings={settings}></NavItemsConfig>
        </Panel>
        <Panel title="导航内容对应 post id">
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
        <BaseTextarea value={JSON.stringify(settings)}></BaseTextarea>
      </section>
    </main>
  );
}
