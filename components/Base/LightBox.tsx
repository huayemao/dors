"use client";
import withDeferredMount from "@/lib/client/utils/deferredMount";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useEffect } from "react";

const LightBox = ({
  gallery = "article",
  childrenSelector = "a[data-pswp-width]",
}: {
  gallery?: string | HTMLElement;
  childrenSelector?: string;
}) => {
  useEffect(() => {
    let lightBox;
    lightBox = new PhotoSwipeLightbox({
      // may select multiple "galleries"
      gallery: gallery,

      // Elements within gallery (slides)
      children: childrenSelector,

      // setup PhotoSwipe Core dynamic import
      pswpModule: () => import("photoswipe"),
    });
    lightBox.init();
    return () => {
      lightBox.destroy();
      lightBox = null;
    };
  }, [childrenSelector, gallery]);

  return <></>;
};

export default withDeferredMount(LightBox, 300);
