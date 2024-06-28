"use client";
import withDeferredMount from "@/lib/utils/deferredMount";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useEffect } from "react";

const LightBox = () => {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      // may select multiple "galleries"
      gallery: "article",

      // Elements within gallery (slides)
      children: "p figure",

      // setup PhotoSwipe Core dynamic import
      pswpModule: () => import("photoswipe"),
    });
    console.log(999,lightbox)
    lightbox.init();
  }, []);
  return <></>;
};

export default withDeferredMount(LightBox, 100);
