"use client";
import { useEffect, useRef } from "react";

export function Figure(props) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const current = ref.current;
    const img = current.querySelector("img")!;
    img.onload = (e) => {
      current.href = img.src || "";
      current.dataset["pswpWidth"] = "" + img.naturalWidth;
      current.dataset["pswpHeight"] = "" + img.naturalHeight;
    };
  }, []);
  return (
    <a
      suppressHydrationWarning
      ref={ref}
      className="!no-underline"
      data-pswp-width="800"
      data-pswp-height="600"
    >
      <figure suppressHydrationWarning>
        <img
          loading="lazy"
          style={{ width: "100%", height: "auto" }}
          width={800}
          height={600}
          referrerPolicy="origin"
          {...props}
        />
        <figcaption suppressHydrationWarning>{props.alt}</figcaption>
      </figure>
    </a>
  );
}
