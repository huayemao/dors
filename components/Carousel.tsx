"use client";
import { SlideItem } from "@/constants";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Loading from "./loading";

type Props = {
  className: string;
  items: SlideItem[];
};

const Carousel = ({ className, items }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadedArr, setImageLoadedArr] = useState(items.map(() => false));

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
      entries.forEach((entry) => {
        const lazyImage = entry.target;
        if (!(lazyImage instanceof HTMLImageElement)) {
          return;
        }
        if (entry.isIntersecting) {
          // todo: 替换 fallback
          lazyImage.src =
            lazyImage.dataset.src ||
            "https://www.peugeot.com.cn/Cg/Upload/www.peugeot.com.cn/image/230529/2023052917174454808.png";
          observer.unobserve(lazyImage);
        }
      });
    }, options);

    const lazyImages = document.querySelectorAll("img[data-src]");

    lazyImages.forEach((image, index) => {
      image.addEventListener("load", () => {
        setImageLoadedArr((prevArr) => {
          const newArr = [...prevArr];
          newArr[index] = true;
          return newArr;
        });
      });
      observer.observe(image);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [items.length]);

  return (
    <>
      <div
        className={cn("relative overflow-hidden w-96 h-72 mx-auto", className)}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="relative flex-none w-full h-full bg-slate-200"
            >
              {!imageLoadedArr[index] && (
                <Loading className="absolute w-full h-full" />
              )}
              <img
                alt={item.caption}
                loading="lazy"
                data-src={item.image}
                className={clsx(
                  "w-full h-full object-cover",
                  `${!imageLoadedArr[index] ? "opacity-0" : ""}`
                )}
              />
              <div
                className="absolute bottom-4 left-0 right-0 text-center text-white"
                style={{ display: imageLoadedArr[index] ? "block" : "none" }}
              >
                {item.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="controls">
        {items.map((item, index) => (
          <button key={index} onClick={() => jumpTo(index)}>
            {index}
          </button>
        ))}
      </div>
    </>
  );
};

export default Carousel;