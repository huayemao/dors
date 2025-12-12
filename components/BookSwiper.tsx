"use client"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BookTile } from "@/components/Tiles/BookTile";
import { BaseButtonIcon } from "@glint-ui/react";

export function BookSwiper({ books }) {
  return <div className="relative bg-muted-100 dark:bg-muted-800 rounded-lg p-6">
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
    <Swiper
      modules={[Navigation, Autoplay]}
      slidesPerView="auto"
      spaceBetween={16}
      loop
      grabCursor
      navigation={{
        prevEl: ".custom-swiper-button-prev",
        nextEl: ".custom-swiper-button-next",
      }}
      autoplay={{
        delay: 6000,
        disableOnInteraction: false,
      }}
      className="py-6"
    >
      {books.map((book) => (
        <SwiperSlide key={book.id} className="!w-fit">
          <div className="">
            <BookTile
              key={book.id}
              id={book.id}
              title={book.title}
              coverImage={book.cover_image}
              posts={book.posts}
              tags={book.tags} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>

  </div>;
}