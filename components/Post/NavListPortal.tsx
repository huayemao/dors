"use client";
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export default function NavListPortal({ children, key }) {
  const el = useMemo(() => {
    return window.document.querySelector("#nav-content");
  }, []);

  useEffect(() => {
    if (!el) {
      return;
    }

    const ul = el.querySelector("ul")!;
    const originalDisplay = ul.style.display;
    ul.style.display = "none";
    return () => {
      if (!el) {
        return;
      }
      ul.style.display = originalDisplay;
    };
  });

  if (!el) {
    return null;
  }

  return createPortal(
    <div className="w-[100%] h-[80%] ">{children}</div>,
    el,
    window.location.href + key
  );
}
