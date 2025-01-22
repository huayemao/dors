import { useState, useEffect, useRef } from 'react';

export const useOverflowShadow = (ref) => {
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        const hasOverflow = ref.current.scrollWidth > ref.current.clientWidth;
        setHasShadow(hasOverflow);
      }
    };

    checkOverflow();

    // 如果浏览器支持 ResizeObserver，则在容器大小变化时重新检查溢出
    if (window.ResizeObserver) {
      const observer = new ResizeObserver(checkOverflow);
      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [ref]);

  return hasShadow;
};