import { cn } from "@/lib/utils";
import { FC, useRef, useCallback, useEffect } from "react";
import { Props, useOverflowShadow } from "@/lib/client/hooks/useOverflowShadow";


export const OverflowContainer: FC<Props> = ({
  children, className, ...restProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowTop = useRef<HTMLDivElement>(null);
  const shadowBottom = useRef<HTMLDivElement>(null);

  const hasShadow = useOverflowShadow(containerRef);
  const container = containerRef.current!;

  const listener = useCallback((e: Event) => {
    const container = e.target as HTMLDivElement;
    const contentScrollHeight = container.scrollWidth - container.offsetWidth;

    const currentScroll = containerRef.current!.scrollLeft / contentScrollHeight;
    shadowTop.current!.style.opacity = String(currentScroll);
    shadowBottom.current!.style.opacity = String(1 - currentScroll);
  }, []);

  useEffect(() => {
    if (container) container.addEventListener("scroll", listener);

    return () => {
      if (container) container.removeEventListener("scroll", listener);
    };
  }, [container, listener]);

  return (
    <div
      ref={containerRef}
      {...restProps}
      className={cn(`overflow-x-auto relative`, className)}
    >
      {children}
      <div
        ref={shadowTop}
        className={cn("absolute top-0 left-0 w-4 h-4/5 z-10 hidden opacity-0", {
          block: hasShadow,
        })}
        style={{
          background: "linear-gradient(90deg, rgba(0, 0, 0, 0.35), transparent)",
        }}
      ></div>
      <div
        ref={shadowBottom}
        className={cn("absolute top-0 right-0 w-4 h-4/5 z-10 hidden", {
          block: hasShadow,
        })}
        style={{
          background: "linear-gradient(270deg, rgba(0, 0, 0, 0.35), transparent)",
        }}
      ></div>
    </div>
  );
};
