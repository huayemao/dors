"use client";
import { useMemo } from "react";
import { createPortal } from "react-dom";

export default function NavListPortal({ onclick, key }) {
  const el = useMemo(() => {
    return window.document.querySelector("#nav-list");
  }, []);
  return createPortal(
    <li
      className="md:hidden block text-base font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility"
      onClick={onclick}
    >
      本文
    </li>,
    el,
    window.location.href + key
  );
}
