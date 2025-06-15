import { FC, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { BaseCard } from "@shuriken-ui/react";
import { useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/effect-cards';

interface StackCardsProps<T> {
  items: T[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  renderItem: (item: T) => React.ReactNode;
  getItemId: (item: T) => string | number;
}

export const StackCards = <T,>({
  items,
  currentIndex,
  onIndexChange,
  renderItem,
  getItemId,
}: StackCardsProps<T>) => {
  const swiperRef = useRef<any>(null);
  const navigate = useNavigate();

  return (
    <div className="max-w-full max-h-[65vh] relative">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="h-full w-fit max-w-full  lg:max-w-xl"
        cardsEffect={{
          perSlideOffset: 4,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: false,
        }}
        onSlideChange={(swiper) => {
          onIndexChange(swiper.activeIndex);
        }}
        initialSlide={currentIndex}
        ref={swiperRef}
      >
        {items.map((item) => (
          <SwiperSlide key={String(getItemId(item))}>
            <div 
              className="w-full h-full p-4 cursor-pointer"
              onClick={(event) => {
                if (
                  (event.target as HTMLElement).closest(
                    'a, button, [role="button"]'
                  )
                ) {
                  return;
                }
                navigate("./" + getItemId(item));
              }}
            >
              <BaseCard
                className="h-full transition-all duration-300"
                rounded="lg"
                shadow="hover"
              >
                <div className="p-4">
                  {renderItem(item)}
                </div>
              </BaseCard>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="rounded absolute -bottom-12 left-4 right-4 flex gap-x-2 gap-y-3 justify-center p-4 flex-wrap z-10">
        {items.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? "bg-primary-500 w-8" 
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => {
              swiperRef.current?.swiper.slideTo(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}; 