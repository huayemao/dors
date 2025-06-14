"use client";
import Prose from "@/components/Base/Prose";
import useMagicGrid from "./MagicGrid";
import { useRef } from "react";

export default function GridItems({ content }: { content }) {
  
  const containerRef = useRef<HTMLElement>(null);
  
  useMagicGrid(containerRef);

  return (
    <div style={{ 
      transform: 'none',
      transition: 'none',
      willChange: 'opacity'
    }}>
      <Prose
        className="opacity-0 navigation-content mb-auto !max-w-full prose-h3:mt-0 flex flex-wrap gap-6 items-start"
        content={content}
        ref={containerRef}
      />
    </div>
  );
}
