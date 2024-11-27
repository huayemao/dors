import React, { Ref, RefObject, useEffect, useRef, useState } from "react";

export function usePinned(ref: RefObject<HTMLElement>) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        setPinned(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return pinned;
}

