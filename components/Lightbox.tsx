"use client";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useEffect } from "react";

const LightBox = ({ gallery = "article", childrenSelector = 'a[data-pswp-width]' }: { gallery?: string, childrenSelector?: string }) => {
  useEffect(() => {
    let lightbox;
    lightbox = new PhotoSwipeLightbox({
      // may select multiple "galleries"
      gallery: gallery,

      // Elements within gallery (slides)
      children: childrenSelector,

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
