"use client"
import { cn } from "@/lib/utils";
import c from "@/styles/gallery.module.css";
import { ComponentProps, useRef, useEffect, useState } from "react";
import Image from "next/image";
import LightBox from "./Base/LightBox";

interface ImageSize {
  width: number;
  height: number;
}

interface MediaItem {
  src: string;
  alt: string;
  type: 'image' | 'video';
  size?: ImageSize;
}

function Gallery({
  children,
  preview = false,
  className,
  ...props
}: ComponentProps<"div"> & { preview?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mediaSizes, setMediaSizes] = useState<Record<string, ImageSize>>({});
  
  // 判断媒体类型
  const getMediaType = (src: string): 'image' | 'video' => {
    const ext = src.split('.').pop()?.toLowerCase();
    return ext === 'mp4' ? 'video' : 'image';
  };

  // 从 URL 中提取尺寸信息
  const extractSizeFromUrl = (src: string): ImageSize | undefined => {
    const sizeMatch = src.match(/\/(\d+)x(\d+)\//);
    if (sizeMatch) {
      return {
        width: parseInt(sizeMatch[1]),
        height: parseInt(sizeMatch[2])
      };
    }
    return undefined;
  };
  
  // 处理 children 是 p 标签的情况
  const getMediaItems = (children: any): MediaItem[] => {
    if (!children) return [];
    
    // 如果是数组，递归处理每个子元素
    if (Array.isArray(children)) {
      return children.flatMap(getMediaItems);
    }
    
    // 如果是对象（React 元素）
    if (typeof children === 'object') {
      // 如果是 p 标签，处理其子元素
      if (children.type === 'p') {
        return getMediaItems(children.props.children);
      }
      // 如果是图片元素
      if (children.props?.src) {
        return [{
          src: children.props.src,
          alt: children.props.alt || "Gallery media",
          type: getMediaType(children.props.src),
          size: extractSizeFromUrl(children.props.src)
        }];
      }
    }
    
    // 如果是字符串，尝试匹配 markdown 图片语法
    if (typeof children === 'string') {
      const matches = children.match(/!\[.*?\]\((.*?)\)/g);
      if (matches) {
        return matches.map(match => {
          const src = match.match(/!\[.*?\]\((.*?)\)/)?.[1];
          if (!src) return null;
          return {
            src,
            alt: 'Gallery media',
            type: getMediaType(src),
            size: extractSizeFromUrl(src)
          };
        }).filter(Boolean) as MediaItem[];
      }
    }
    
    return [];
  };

  const mediaItems = getMediaItems(children);

  // 获取媒体尺寸
  useEffect(() => {
    if (!ref.current) return;

    const updateMediaSizes = () => {
      const imgElements = ref.current?.querySelectorAll('img.gallery-image');
      if (!imgElements) return;

      const sizes: Record<string, ImageSize> = {};
      Array.from(imgElements).forEach(img => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.naturalWidth && imgElement.naturalHeight) {
          sizes[imgElement.src] = {
            width: imgElement.naturalWidth,
            height: imgElement.naturalHeight
          };
        }
      });
      
      if (Object.keys(sizes).length > 0) {
        setMediaSizes(sizes);
      }
    };

    // 监听图片加载事件
    const handleImageLoad = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img.naturalWidth && img.naturalHeight) {
        setMediaSizes(prev => ({
          ...prev,
          [img.src]: {
            width: img.naturalWidth,
            height: img.naturalHeight
          }
        }));
      }
    };

    // 为所有图片添加加载事件监听
    const imgElements = ref.current.querySelectorAll('img.gallery-image');
    Array.from(imgElements).forEach(img => {
      img.addEventListener('load', handleImageLoad);
    });

    // 初始更新
    updateMediaSizes();

    // 清理事件监听
    return () => {
      Array.from(imgElements).forEach(img => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return (
    <div 
      ref={ref}
      className={cn(
        "not-prose",
        c.gallery_root,
        {
          "grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3 items-center justify-items-center": true
        },
        className
      )}
      {...props}
    >
      <LightBox gallery={ref.current!}></LightBox>
      {mediaItems.map((item, index) => {
        const size = item.size || mediaSizes[item.src] || { width: 1920, height: 1080 };
        
        return (
          <a
            key={index}
            href={item.src}
            data-pswp-width={size.width}
            data-pswp-height={size.height}
            target="_blank"
            rel="noreferrer"
            className="relative aspect-square w-full overflow-hidden rounded-lg"
          >
            {item.type === 'video' ? (
              <video
                src={item.src}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                unoptimized
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover gallery-image"
              />
            )}
          </a>
        );
      })}
    </div>
  );
}

export default Gallery;
