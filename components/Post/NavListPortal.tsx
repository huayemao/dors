"use client";
import { createPortal } from "react-dom";

export default function NavListPortal({ onclick }) {
  return createPortal(
    <li
      className="md:hidden block text-base font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility"
      onClick={onclick}
    >
      本文
    </li>,
    document.querySelector("#nav-list")
  );
}
