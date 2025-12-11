"use client";
import React, { RefObject, useEffect, useLayoutEffect, useRef } from "react";
import MagicGrid from "magic-grid";

function useMagicGrid(selectorOrRef:  RefObject<HTMLElement | null> |string) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container =  typeof selectorOrRef =='string'? document.querySelector(selectorOrRef) as HTMLElement:selectorOrRef.current;
    
    console.log(selectorOrRef,container)
    if (!container) return;
    
    containerRef.current = container as HTMLDivElement;
    // 确保在客户端渲染前保持隐藏
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease-in-out';
    // 禁用所有可能的动画
    container.style.transform = 'none';
    container.style.transition = 'none';

    let magicGrid = new MagicGrid({
      static: true,
      maxColumns: 3,
      gutter: 25,
      container: container,
      animate: false,
      useTransform: false,
      useMin: false,
    });

    // 先监听布局变化
    magicGrid.listen();

    // 使用 ResizeObserver 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      // 当容器大小稳定后，显示内容
      if (containerRef.current) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            // 移除所有动画相关的样式
            containerRef.current.style.transition = 'opacity 0.3s ease-in-out';
            containerRef.current.style.opacity = '1';
          }
        });
      }
      // 一旦显示内容，就不再需要观察了
      resizeObserver.disconnect();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectorOrRef]);

  return containerRef;
}

export default useMagicGrid;
