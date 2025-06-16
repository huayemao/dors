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
    <div className="max-w-full lg:max-h-[68vh] overflow-hidden relative">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="max-h-[60vh] !overflow-hidden w-fit max-w-full  lg:max-w-xl"
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
      <div className="rounded mx-auto lg:max-w-xl flex gap-x-2 gap-y-3 justify-center p-4 flex-wrap ">
        {items.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? "bg-primary-500 w-3 h-3 hover:bg-primary-300 active:bg-primary-500" 
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