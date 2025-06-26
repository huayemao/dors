"use client";
import Prose from "@/components/Base/Prose";
import useMagicGrid from "./MagicGrid";
import { useRef } from "react";

export default function GridItems({ content }: { content }) {
  
  const containerRef = useRef<HTMLElement>(null);
  
  useMagicGrid(containerRef);

  return (
    <div className="p-4" style={{ 
      transform: 'none',
      transition: 'none',
      willChange: 'opacity'
    }}>
      <Prose
        className="min-w-96 lg:min-w-[75vw] opacity-0 navigation-content mb-auto !max-w-full prose-h3:mt-0 flex flex-wrap gap-6 items-start"
        content={content}
        ref={containerRef}
      />
    </div>
  );
}
