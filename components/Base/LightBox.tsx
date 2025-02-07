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
    let lightBox = new PhotoSwipeLightbox({
      // may select multiple "galleries"
      gallery: gallery,

      // Elements within gallery (slides)
      children: childrenSelector,

      // setup PhotoSwipe Core dynamic import
      pswpModule: () => import("photoswipe"),
    });

    // 添加播放状态变量
    let isPlaying = false;
    let playInterval: NodeJS.Timeout;

    // 创建播放按钮
    lightBox.on('uiRegister', () => {
      lightBox.pswp!.ui!.registerElement({
        name: 'play-button',
        order: 7,
        isButton: true,
        html: '<span class="pswp__icn">▶</span>',
        onClick: () => {
          isPlaying = !isPlaying;
          const button = document.querySelector('.pswp__button--play');
          if (button) {
            button.innerHTML = isPlaying ? '⏸' : '▶';
          }
          
          if (isPlaying) {
            playInterval = setInterval(() => {
              const pswp = lightBox.pswp!;
              if (pswp.currIndex === pswp.getNumItems() - 1) {
                pswp.goTo(0);
              } else {
                pswp.next();
              }
            }, 3000); // 每3秒切换一张
          } else {
            clearInterval(playInterval);
          }
        },
        appendTo: 'bar'
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
    lightBox.on('destroy', () => {
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
