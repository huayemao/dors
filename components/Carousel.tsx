"use client";
import { SlideItem } from "@/constants";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Loading from "./loading";

type Props = {
  className: string;
  items: SlideItem[];
};

enum Status {
  loaded = "loaded",
  error = "error",
  loading = "loading",
}

const Carousel = ({ className, items }: Props) => {
  const container = useRef<Element>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const image2Status = new Map();
  for (const item of items) {
    image2Status.set(item.image, Status.loading);
  }
  const [imageLoadedArr, setImageLoadedArr] =
    useState<Map<string, Status>>(image2Status);

  const jumpTo = (to) => {
    setCurrentIndex(to);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      console.log(entries);
      entries
        .filter((e) => e.target instanceof HTMLImageElement)
        .forEach((entry, index) => {
          const lazyImage = entry.target as HTMLImageElement;

          if (entry.isIntersecting && !lazyImage.src) {
            lazyImage.onerror = (e) => {
              setImageLoadedArr((prevMap) => {
                prevMap.set(lazyImage.dataset.src as string, Status.error);
                return new Map(prevMap.entries());
              });
              console.log(imageLoadedArr);
            };

            lazyImage.onload = () => {
              setImageLoadedArr((prevMap) => {
                prevMap.set(
                  (lazyImage as HTMLImageElement).dataset.src as string,
                  Status.loaded
                );
                console.log(new Map(prevMap.entries()))
                return new Map(prevMap.entries());
              });
            };

            // todo: 替换 fallback
            lazyImage.src =
              lazyImage.dataset.src ||
              "https://www.peugeot.com.cn/Cg/Upload/www.peugeot.com.cn/image/230529/2023052917174454808.png";

            observer.unobserve(lazyImage);
          }
        });
    }, options);

    if (!container.current) {
      return;
    }

    container.current.querySelectorAll("img[data-src]").forEach((img) => {
      observer.observe(img);
    });

    return () => {
      observer.disconnect();
    };
  }, [container.current]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div
        ref={container}
        className={cn("relative overflow-hidden w-96 h-72 mx-auto", className)}
      >
        <div
          className="flex transition-all duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="relative flex-none w-full h-full bg-slate-200"
            >
              {imageLoadedArr.get(item.image) === Status.loading && (
                <Loading className="absolute w-full h-full" />
              )}
              {imageLoadedArr.get(item.image) === Status.error && (
                <button
                  className="w-full h-full"
                  onClick={() => window.open(item.image)}
                >
                  图片加载失败，点击访问图片地址
                </button>
              )}
              <img
                alt={item.caption}
                loading="lazy"
                data-src={item.image}
                className={clsx(
                  "w-full h-full object-cover",
                  `${!imageLoadedArr.get(item.image) ? "opacity-0" : ""}`
                )}
              />
              <div
                className="absolute bottom-0  left-0 right-0 text-center mix-blend-difference drop-shadow-lg"
                style={{ display: imageLoadedArr[index] ? "block" : "none" }}
              >
                <span className="text-white">{item.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-4 flex w-full justify-center items-center gap-3">
        {items.map((item, index) => (
          <button
            className={cn(
              "rounded-full bg-primary-200 w-2 h-2 transition-all",
              {
                "bg-primary-500 ring-4 ring-primary-200": currentIndex == index,
              }
            )}
            key={index}
            onClick={() => jumpTo(index)}
          ></button>
        ))}
      </div>
    </>
  );
};

export default Carousel;
