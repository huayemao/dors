"use client";
import mime from "mime";
import { useEffect, useRef } from "react";

export function Figure(props) {
  const { src, width, height, ignoreCaption } = props;
  const mimetype = mime.getType(src);
  mime.getType(src);
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const current = ref.current;
    const img = current.querySelector("img");
    const video = current.querySelector("video");
    if (img) {
      current.href = img.src || "";
      img.onloadedmetadata = (e) => {
        current.dataset["pswpWidth"] = "" + img.naturalWidth;
        current.dataset["pswpHeight"] = "" + img.naturalHeight;
      };
      img.onload = (e) => {
        current.dataset["pswpWidth"] = "" + img.naturalWidth;
        current.dataset["pswpHeight"] = "" + img.naturalHeight;
      };
    }

    if (video) {
      current.href = video.src || "";
      video.onloadedmetadata = (e) => {
        current.dataset["pswpWidth"] = "" + video.videoWidth;
        current.dataset["pswpHeight"] = "" + video.videoHeight;
      };
    }
  }, []);
  if (mimetype?.startsWith("video")) {
    return (
      <a
        suppressHydrationWarning
        ref={ref}
        className="!no-underline"
        data-pswp-width={width || 800}
        data-pswp-height={height || 600}
      >
        <video preload="metadata">
          <source src={src} type={mimetype} />
          Your browser does not support the video tag.
        </video>
      </a>
    );
  } else if (mimetype?.startsWith("audio")) {
    return (
      <audio controls preload="metadata">
        <source src={src} type={mimetype} />
        Your browser does not support the aduio tag.
      </audio>
    );
  }
  return (
    <a
      suppressHydrationWarning
      ref={ref}
      className="!no-underline"
      data-pswp-width={width || 800}
      data-pswp-height={height || 600}
    >
      <figure suppressHydrationWarning>
        <img
          loading="lazy"
          style={{ width: "100%", height: "auto" }}
          width={width || 800}
          height={height || 600}
          referrerPolicy="origin"
          {...props}
        />
        {!ignoreCaption && (
          <figcaption suppressHydrationWarning>{props.alt}</figcaption>
        )}
      </figure>
    </a>
  );
}
