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
  console.log(gallery)
  useEffect(() => {
    let lightBox = new PhotoSwipeLightbox({
      // may select multiple "galleries"
      gallery: gallery,
      tapAction:'toggle-controls',
      bgClickAction:'toggle-controls',
      // Elements within gallery (slides)
      children: childrenSelector,

      // setup PhotoSwipe Core dynamic import
      pswpModule: () => import("photoswipe"),
    });

    // 添加播放状态变量
    let isPlaying = false;
    let playInterval: NodeJS.Timeout;

    // 创建播放按钮
    lightBox.on("uiRegister", () => {
      lightBox.pswp!.ui!.registerElement({
        name: "play-button",
        order: 7,
        isButton: true,
        html: '<span class="pswp__icn" style="color: white;display:flex;align-items:center;justify-content:center;">▶</span>',
        onClick: () => {
          isPlaying = !isPlaying;
          const button = document.querySelector(".pswp__button--play-button");

          if (button) {
            const icon = button.querySelector("span");
            if (icon) {
              icon.innerHTML = isPlaying
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;
              icon.style.color = "white";
            }
          }

          if (isPlaying) {
            const element = lightBox.pswp?.element!;
            if (element.classList.contains("pswp--ui-visible"))
              element.classList.remove("pswp--ui-visible");
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            }
            playInterval = setInterval(() => {
              const pswp = lightBox.pswp!;
              if (pswp.currIndex === pswp.getNumItems() - 1) {
                pswp.goTo(0);
              } else {
                pswp.next();
              }
            }, 6000);
          } else {
            clearInterval(playInterval);
            if (document.fullscreenElement) {
              document.exitFullscreen();
            }
          }
        },
        appendTo: "bar",
      });
    });

    lightBox.on("itemData", (e) => {
      const element = e.itemData?.element!.cloneNode(true) as HTMLElement;
      const isVideo = element.firstChild instanceof HTMLVideoElement;
      if (isVideo) {
        const video = element.firstChild;
        video.style.width = "100%";
        video.style.height = "100vh";
        video.style.objectFit = "contain";
        e.itemData = {
          html: element.innerHTML,
          photodata: element.dataset.photodata,
        };
      }
    });

    lightBox.on("contentActivate", (e) => {
      const video = e.content.element!.querySelector("video");
      if (video) {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        }
        const container = document.querySelector(".pswp")!;
        setTimeout(() => {
          if (container.classList.contains("pswp--ui-visible"))
            container.classList.remove("pswp--ui-visible");
        }, 100);

        video.setAttribute("controls", "controls");
        video.play().catch((e) => {
          video.oncanplay = (event) => {
            (event.target as HTMLVideoElement).play();
          };
        });

        video.onended = () => {
          const pswp = lightBox.pswp!;
          pswp.next();
        };
      }
    });
    lightBox.on("contentDeactivate", (e) => {
      const video = e.content.element!.querySelector("video");
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

    // 在关闭时清除播放状态
    lightBox.on("destroy", () => {
      isPlaying = false;
      clearInterval(playInterval);
    });

    lightBox.init();
    return () => {
      clearInterval(playInterval);
      lightBox.destroy();
    };
  }, [childrenSelector, gallery]);

  return <></>;
};

export default withDeferredMount(LightBox, 300);
