"use client";
import Prose from "@/components/Base/Prose";
import useMagicGrid from "./MagicGrid";

export default function GridItems({ content }: { content }) {
  useMagicGrid();
  return (
    <Prose
      className="navigation-content mb-auto !max-w-full prose-h3:mt-0 flex flex-wrap gap-6 items-start"
      content={content}
    ></Prose>
  );
}
