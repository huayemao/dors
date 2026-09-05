import prisma from "@/lib/prisma";
import { Panel } from "@/components/Base/Panel";
import { FooterForm } from "../settings/FooterForm";

export const dynamic = "force-dynamic";

export default async function AdminFooterPage() {
  const settings = await prisma.settings.findMany({});

  return (
    <main className="w-full px-4 lg:px-8 py-4">
      <Panel title="页脚设置" className="max-w-full">
        <FooterForm settings={settings} />
      </Panel>
    </main>
  );
}
