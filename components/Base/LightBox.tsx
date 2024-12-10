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

    lightBox.on("itemData", (e) => {
      const element = e.itemData.element;
      const isVideo = element.firstChild instanceof HTMLVideoElement;
      if (isVideo) {
        element.firstChild.style.width = "100%";
        element.firstChild.style.height = "100%";
        element.firstChild.style.objectFit = "contain";
        e.itemData = {
          html: element.innerHTML,
          photodata: element.dataset.photodata,
        };
        // console.log(slide_index + ' pano:' + element.href);
      }
    });

    lightBox.on("contentActivate", (e) => {
      const video = e.content.element.querySelector("video");
      if (video) {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        }
        video.setAttribute("controls", "controls");
        video.play().catch((e) => {
          video.oncanplay = (event) => {
            event.target.play();
          };
        });

        video.onended = () => {
          const pswp = lightBox.pswp;
          pswp.next();
        };
      }
    });
    lightBox.on("contentDeactivate", (e) => {
      const video = e.content.element.querySelector("video");
      if (video) {
        video.pause();
        video.removeAttribute("controls");
      }
    });

    lightBox.on("closingAnimationEnd", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
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
