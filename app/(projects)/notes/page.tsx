"use client"
import {
  BaseButton,
  BaseCard,
  BaseHeading,
  BaseTabs,
} from "@shuriken-ui/react";
import PostListItem from "@/components/PostListItem";
import LocalNoteCollections from "./LocalNoteCollections";
import CloudNoteCollections from "./CloudNoteCollections";
import { ArrowRight, GalleryVertical, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotesPage() {
  const nav = useNavigate();
  const toCreate = () => nav("/create");

  return (
    <div className="py-8 px-4  mx-auto max-w-5xl space-y-8">
      <div className="flex">
        <BaseHeading
          as="h1"
          weight="extrabold"
          size="4xl"
          className=" text-muted-700 dark:text-white"
        >
          小记
        </BaseHeading>
        <BaseButton className="ml-auto" onClick={toCreate}>
          <Plus className="mr-2 size-4"></Plus>
          新建
        </BaseButton>
      </div>
      <BaseTabs
        defaultValue="local"
        tabs={[
          { label: "本地", value: "local" },
          { label: "云", value: "cloud" },
        ]}
      >
        {(activeValue) => (
          <div className="mt-2">
            {activeValue === "local" && <LocalNoteCollections />}
            {activeValue === "cloud" && <CloudNoteCollections />}
          </div>
        )}
      </BaseTabs>
    </div>
  );
}
