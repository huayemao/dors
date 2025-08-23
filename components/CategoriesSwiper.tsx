"use client";

import { CategoriesContext } from "@/contexts/categories";
import { useContext, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import Icon from "@/components/Base/Icon";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BaseButtonIcon } from "@glint-ui/react";
import { useMediaQuery } from "@uidotdev/usehooks";

// 定义颜色数组，为每个分类分配不同的颜色
const categoryColors = [
  "text-yellow-500",
  "text-emerald-500",
  "text-purple-500",
  "text-sky-500",
  "text-orange-500",
  "text-rose-500",
  "text-indigo-500",
  "text-pink-500",
  "text-cyan-500",
  "text-lime-500",
];

export function CategoriesSwiper() {
  const categories = useContext(CategoriesContext);
  const swiperRef = useRef<any>(null);
  const isMobile = useMediaQuery("only screen and (max-width : 468px)");
  const isTablet = useMediaQuery("only screen and (max-width : 768px)");

  // 过滤掉隐藏的分类
  const visibleCategories = categories.filter((cat) => !cat.hidden);

  return (
    <div className="w-full max-w-6xl mx-auto relative">
      <div className="absolute right-0 -top-10 flex gap-2">
        {/* 自定义导航按钮 */}
        <BaseButtonIcon
          className={`custom-swiper-button-prev`}
          aria-label="Previous slide"
          rounded="full"
          size="sm"
        >
          <ArrowLeft
            name="arrow-left"
            className="text-muted-400 group-hover:text-primary-500 transition-colors duration-300 w-4 h-4"
          />
        </BaseButtonIcon>

        <BaseButtonIcon
          className="custom-swiper-button-next"
          size="sm"
          rounded="full"
        >
          <ArrowRight
            name="arrow-right"
            className="text-muted-400 group-hover:text-primary-500 transition-colors duration-300 w-4 h-4"
          />
        </BaseButtonIcon>
      </div>
      <div>
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          spaceBetween={16}
          effect={"slide"}
          slidesPerView={isMobile ? 2 : isTablet ? 3 : 'auto'}
          loop={false}
          slideToClickedSlide={true}
          grabCursor={true}
          navigation={{
            nextEl: ".custom-swiper-button-next",
            prevEl: ".custom-swiper-button-prev",
          }}
          className="categories-swiper"
          style={{ paddingBottom: "40px", padding: '0 16px' }}
        >
          {visibleCategories.map((category, index) => {
            const colorClass = categoryColors[index % categoryColors.length];
            const iconName =
              (category.meta as { icon?: string })?.icon || "folder";

            return (
              <SwiperSlide
                key={category.id}
                style={{ width: "auto", minWidth: "160px" }}
              >
                <Link
                  href={`/categories/${category.id}`}
                  className="flex items-center justify-center px-4 py-6 rounded-lg bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 hover:shadow-xl shadow-muted-400/10 hover:dark:shadow-muted-800/10 transition-all duration-300 min-h-[120px]"
                >
                  <div className="text-center">
                    <div className={`${colorClass} mb-2`}>
                      <Icon
                        strokeWidth={1}
                        name={iconName as any}
                        className="w-6 h-6 flex items-center justify-center text-3xl mx-auto"
                      />
                    </div>
                    <h4 className="font-sans font-bold text-muted-800 dark:text-muted-100 text-sm">
                      {category.name}
                    </h4>
                    <p className="font-sans text-xs text-muted-400 mt-1">
                      {category.updated_at
                        ? new Date(category.updated_at).toLocaleDateString(
                            "zh-CN"
                          )
                        : "最近更新"}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
