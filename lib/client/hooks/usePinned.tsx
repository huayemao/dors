import React, { Ref, RefObject, useEffect, useRef, useState } from "react";

export function usePinned(ref: RefObject<HTMLElement>, top?: number) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        setPinned(e.intersectionRatio < 1);
      },
      { threshold: [1], rootMargin: top ? `-${top}px 0px 0px 0px` : undefined }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, top]);

  return pinned;
}
