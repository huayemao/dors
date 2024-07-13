"use client";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useEffect } from "react";

const LightBox = () => {
  useEffect(() => {
    let lightbox;
    lightbox = new PhotoSwipeLightbox({
      // may select multiple "galleries"
      gallery: "article",

      // Elements within gallery (slides)
      children: "a[data-pswp-width]",

      // setup PhotoSwipe Core dynamic import
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return <></>;
};

export default LightBox;
