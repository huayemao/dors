import { getAllCategories } from "@/lib/categories";
import prisma from "@/lib/prisma";
import { HiddenCatsForm } from "./HiddenCatsForm";
import { RevalidateButton } from "./RevalidateButton";

export default async function AdminSettingsPage({ params }) {
  const cats = await getAllCategories();
  const settings = await prisma.settings.findMany({});

  return (
    <main className="w-full px-8 py-4">
      <section className="flex flex-col gap-2 w-36 items-start">
        <RevalidateButton></RevalidateButton>
        <HiddenCatsForm settings={settings} cats={cats}></HiddenCatsForm>
        {JSON.stringify(settings)}
      </section>
    </main>
  );
}

