import { getAllCategories } from "@/lib/categories";
import prisma from "@/lib/prisma";
import { HiddenCatsForm } from "./HiddenCatsForm";
import { ResourceForm } from "./ResourceForm";
import { RevalidateButton } from "./RevalidateButton";
import { Panel } from "@/components/Base/Panel";

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
        <Panel title="导航栏">
          <ResourceForm settings={settings}></ResourceForm>
        </Panel>
        {JSON.stringify(settings)}
      </section>
    </main>
  );
}
