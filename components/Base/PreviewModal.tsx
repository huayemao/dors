import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  BaseButton,
  BaseButtonClose,
  BaseButtonIcon,
} from "@glint-ui/react";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React from "react";
import { cn } from "@/lib/utils";
import { Keyboard } from "swiper/modules";
import { Images, Camera, Album } from "lucide-react";
import html2canvas from "html2canvas";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  loading?: boolean;
  slidesMode?: boolean;
}

// 递归查找 DOM，直到拿到真正的 slides 列表，返回 { container, slides }
function getSlidesFromDomWithContainer(
  dom: HTMLElement
): { container: HTMLElement; slides: HTMLElement[] } | null {
  if (!dom) return null;
  const children = Array.from(dom.childNodes).filter(
    (node) =>
      node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE
  );
  // 如果全是文本节点，直接返回当前 dom 作为 container
  if (
    children.length > 0 &&
    children.every((node) => node.nodeType === Node.TEXT_NODE)
  ) {
    return { container: dom, slides: children as HTMLElement[] };
  }
  // 如果只有一个元素节点，递归下去
  if (children.length === 1 && children[0].nodeType === Node.ELEMENT_NODE) {
    return getSlidesFromDomWithContainer(children[0] as HTMLElement);
  }
  // 否则，返回当前 dom 作为 container，slides 为所有元素节点
  return {
    container: dom,
    slides: children.filter(
      (node) => node.nodeType === Node.ELEMENT_NODE
    ) as HTMLElement[],
  };
}

export const PreviewModal = ({
  open,
  onClose,
  children,
  loading,
  slidesMode: slidesModeProp = false,
}: PreviewModalProps) => {
  const [slidesMode, setSlidesMode] = useState(slidesModeProp);
  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const [slidesHtml, setSlidesHtml] = useState<string[]>([]);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const [containerTag, setContainerTag] = useState<string>("");
  const [containerProps, setContainerProps] = useState<Record<string, any>>({});
  const swiperRef = useRef<any>(null);

  const handleToggleSlidesMode = () => {
    setSlidesMode((prev) => !prev);
  };

  // 监听 slidesMode 和 children，提取 DOM 子节点
  useEffect(() => {
    let observer: MutationObserver | null = null;
    function updateSlides() {
      const result = getSlidesFromDomWithContainer(hiddenRef.current!);
      if (result) {
        const container = result.container;
        const tag = container.tagName.toLowerCase();
        setContainerTag(tag);
        // 提取所有属性
        const props: Record<string, any> = {};
        Array.from(container.attributes).forEach((attr) => {
          props[attr.name] = attr.value;
        });
        setContainerProps(props);
        setSlidesHtml(
          result.slides.map((node) => (node as HTMLElement).outerHTML)
        );
      } else {
        setContainerTag("");
        setContainerProps({});
        setSlidesHtml([]);
      }
    }
    if (slidesMode && hiddenRef.current) {
      setTimeout(() => {
        updateSlides();
        observer = new MutationObserver(() => {
          updateSlides();
        });
        observer.observe(hiddenRef.current!, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }, 0);
    } else {
      setContainerTag("");
      setContainerProps({});
      setSlidesHtml([]);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, [slidesMode, children]);

  // 截图当前slide
  const handleScreenshot = async () => {
    if (!slidesMode || !swiperRef.current) return;

    // 只截取slide内容部分
    const el = document.querySelector(".swiper-slide-active") as HTMLDivElement;
    if (!el) return;
    const target = el;
    // 截图
    const canvas = await html2canvas(target, { useCORS: true, scale: 2 });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const activeIndex = swiperRef.current.swiper.activeIndex;
      a.download = `slide-${timestamp}-${activeIndex + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }, "image/png");
  };

  const handleScreenshotAll = async () => {
    if (!slidesMode || !swiperRef.current || isScreenshotting) return;

    setIsScreenshotting(true);
    const swiper = swiperRef.current.swiper;
    const totalSlides = slidesHtml.length;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const originalIndex = swiper.activeIndex;

    for (let i = 0; i < totalSlides; i++) {
      await new Promise<void>((resolve) => {
        // 如果已经是当前 slide，直接 resolve
        if (swiper.activeIndex === i) {
          resolve();
          return;
        }
        swiper.on("slideChangeTransitionEnd", function onSlideChange() {
          swiper.off("slideChangeTransitionEnd", onSlideChange);
          resolve();
        });
        swiper.slideTo(i);
      });

      // 等待 DOM 更新
      await new Promise((resolve) => setTimeout(resolve, 100));

      const el = document.querySelector(
        ".swiper-slide-active"
      ) as HTMLDivElement;
      if (!el) continue;

      const canvas = await html2canvas(el, { useCORS: true, scale: 1.5 });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) continue;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `slide-${timestamp}-${i + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // 恢复到原来的 slide
    swiper.slideTo(originalIndex);
    setIsScreenshotting(false);
  };

  return (
    <Dialog
      as={motion.div}
      open={open}
      className="relative z-50"
      onClose={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-25"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="flex h-full  items-center justify-center p-4 text-center  max-w-full"
        >
          <Dialog.Panel className="flex-1  h-full w-full transform bg-white dark:bg-muted-900  text-left align-middle shadow-xl">
            <div className="overflow-y-auto slimscroll w-full h-full">
              <div className="mt-2 flex justify-center items-center min-h-full min-w-[95%] md:min-w-[75%] ">
                {loading ? (
                  <div className="flex justify-center items-center w-full h-32">
                    加载中...
                  </div>
                ) : slidesMode && slidesHtml.length > 0 && containerTag ? (
                  <Swiper
                    spaceBetween={16}
                    className="w-full"
                    keyboard
                    modules={[Keyboard]}
                    ref={swiperRef}
                  >
                    {slidesHtml.map((html, idx) => (
                      <SwiperSlide key={idx} className="bg-white dark:bg-muted-900">
                        {React.createElement(
                          containerTag,
                          {
                            ...containerProps,
                            style: {
                              minHeight: "78vh",
                              maxHeight: "fit-content",
                              ...(containerProps.style || {}),
                            },
                            className: cn(
                              "flex justify-center items-center",
                              containerProps.className,
                              containerProps.class
                            ),
                          },
                          <div dangerouslySetInnerHTML={{ __html: html }} />
                        )}
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  children
                )}
                {/* 隐藏容器用于 DOM 提取 */}
                {slidesMode && (
                  <div ref={hiddenRef} style={{ display: "none" }} aria-hidden>
                    {children}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute right-4 top-4 flex items-center group space-x-2">
              {slidesMode && (
                <>
                  <BaseButtonIcon
                    className="transition-opacity opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-muted-700 disabled:opacity-50"
                    aria-label="截图当前Slide"
                    onClick={handleScreenshot}
                    tabIndex={0}
                    disabled={isScreenshotting}
                  >
                    <Camera className="w-5 h-5" aria-label="截图" />
                  </BaseButtonIcon>
                  <BaseButtonIcon
                    className="transition-opacity opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-muted-700 disabled:opacity-50"
                    aria-label="截图全部Slides"
                    onClick={handleScreenshotAll}
                    tabIndex={0}
                    disabled={isScreenshotting}
                  >
                    <Album className="w-5 h-5" aria-label="截图全部" />
                  </BaseButtonIcon>
                </>
              )}
              <BaseButtonIcon
                className="transition-opacity opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-muted-700"
                aria-label="切换Slides模式"
                onClick={handleToggleSlidesMode}
                tabIndex={0}
              >
                <Images className="w-5 h-5" aria-label="切换幻灯片" />
              </BaseButtonIcon>
              <BaseButtonClose onClick={onClose} />
            </div>
          </Dialog.Panel>
        </motion.div>
      </motion.div>
    </Dialog>
  );
};
// ... existing code ...
