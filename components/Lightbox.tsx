"use client";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useEffect } from "react";

const LightBox = () => {
  useEffect(() => {
    let lightbox;
    setTimeout(() => {
      lightbox = new PhotoSwipeLightbox({
        // may select multiple "galleries"
        gallery: "article",

        // Elements within gallery (slides)
        children: "a",

        // setup PhotoSwipe Core dynamic import
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();
    }, 200);
    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return <></>;
};

export default LightBox;
