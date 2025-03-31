import { Panel } from "@/components/Base/Panel";
import Prose from "@/components/Base/Prose";
import { ClientOnly } from "@/components/ClientOnly";
import { cn } from "@/lib/utils";
import { QuoteIcon, Download } from "lucide-react";
import { useEntity } from "./context";
import { BaseRadio } from "@shuriken-ui/react";
import { useState } from "react";
import html2canvas from "html2canvas";
import { useHover } from "@uidotdev/usehooks";


export default function QuotePreview() {
  const state = useEntity();
  const { currentEntity: item } = state;
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState("white");
  const [position, setPosition] = useState("bottom");
  const [backdrop, setBackdrop] = useState(false);
  const [ref, isHovered] = useHover();
  const [isExporting, setIsExporting] = useState(false);

  const fontSizeOptions = [
    { label: "小", value: 24 },
    { label: "中", value: 32 },
    { label: "大", value: 48 },
    { label: "特大", value: 64 },
  ];

  const colorOptions = [
    { label: "白色", value: "white" },
    { label: "米色", value: "rgb(247, 233, 212)" },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.querySelector(".root") as HTMLElement;
      if (!element) return;

      element.style.height = element.clientHeight + "px";
      // 等待所有图片加载完成
      const images = element.getElementsByTagName("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
        logging: true, // 临时开启日志以便调试
        allowTaint: true, // 允许跨域图片
        backgroundColor: null, // 保持背景透明
      });

      // document.body.appendChild(canvas)
      // 确保转换为 blob 并使用 URL.createObjectURL
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Failed to create blob");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `quote-${item.artwork || "export"}.png`;
        link.href = url;
        link.click();

        // 清理
        setTimeout(() => URL.revokeObjectURL(url), 100);
        setIsExporting(false);
      }, "image/png");
    } catch (error) {
      console.error("导出失败:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-muted-100 dark:bg-muted-900 lg:grid grid-cols-12 gap-4 justify-center  items-start p-4"
    // style={{ background: '#f7e9d4' }}
    >
      <div className="flex-1 col-span-8 px-4">
        <div
          ref={ref}
          className="root relative"
          style={{
            boxSizing: "border-box",
            contain: "content",
            contentVisibility: "auto",
            height: "inherit",
            padding: "0px",
            width: "inherit",
          }}
        >
          {isHovered && !isExporting && (
            <button
              onClick={handleExport}
              className="absolute p-2 rounded top-4 right-4 z-[200] text-white bg-black/50 hover:bg-black/70"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          <div
            className="content-card-container"
            style={{
              alignItems: "flex-start",
              display: "flex",
              flexDirection: "column",
              gap: "0px",
              width: "100%",
            }}
          >
            <img
              aria-hidden="true"
              className="media"
              slot="media"
              alt=""
              src={item.image}
              style={{
                alignSelf: "stretch",
                /* aspectRatio: '4 / 3', */ display: "flex",
                width: "100%",
                /* position: 'absolute', */ zIndex: -1,
              }}
            />
            <div
              className="body"
              style={{
                inset: 0,
                position: "absolute",
                alignItems: "flex-start",
                alignSelf: "stretch",
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                height: "-webkit-fill-available",
                justifyContent: position == "top" ? "start" : "end",
                marginTop: "auto",
                zIndex: 100,
              }}
            >
              <div
                className={cn("flex  p-12 relative", {
                  "-mt-6 pb-32": position == "top",
                  "pt-20": position == "bottom",
                })}
                style={{
                  alignItems: "flex-start",
                  color: "var(--color-neutral-foreground-1)",
                  background:
                    position == "top"
                      ? "linear-gradient(rgba(0,0,0,.53),transparent 100%)"
                      : "linear-gradient(transparent,rgba(0,0,0,.53) 40%)",
                }}
              >
                <blockquote
                  className="whitespace-pre-wrap flex gap-6 items-end text-5xl leading-normal"
                  style={{
                    boxSizing: "border-box",
                    fontFamily: "georgia",
                    fontSize: `${fontSize}px`,
                    color: textColor,
                  }}
                >
                  <p
                    className={cn(
                      "rounded-lg  p-4 flex-[2]  italic  text-balance",
                      {
                        "bg-slate-900/10": !!backdrop,
                      }
                    )}
                    style={{
                      fontFamily: "georgia,serif",
                      fontStyle: "italic",
                    }}
                  >
                    {item.quote}
                  </p>
                  <span
                    className="flex-[1] uppercase text-balance text-right font-bold"
                    style={{ fontFamily: "georgia,serif" }}
                  >
                    — {item.artwork}
                  </span>
                </blockquote>
                <div className={cn("absolute right-16 ",
                  { "top-32": position == 'bottom' },
                  { "top-16": position == 'top' },
                )}>
                  <QuoteIcon
                    className="size-8"
                    style={{ color: textColor }}
                    fill={textColor}
                  ></QuoteIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="col-span-4">
        <Panel
          title="控制"
          description="调整显示效果"
          className="!bg-transparent !border-none !max-w-full mb-4"
        >
          <div className="p-4">
            <label className="block text-sm font-medium mb-2">字体大小</label>
            <div className="flex gap-4 mb-4">
              {fontSizeOptions.map((option) => (
                <BaseRadio
                  key={option.value}
                  name="fontSize"
                  label={option.label}
                  value={option.value}
                  checked={fontSize === option.value}
                  onChange={(v) => setFontSize(Number(v))}
                />
              ))}
            </div>

            <label className="block text-sm font-medium mb-2">文字颜色</label>
            <div className="flex gap-4">
              {colorOptions.map((option) => (
                <BaseRadio
                  key={option.value}
                  name="textColor"
                  label={option.label}
                  value={option.value}
                  checked={textColor === option.value}
                  onChange={(v) => setTextColor(v)}
                />
              ))}
            </div>

            <label className="block text-sm font-medium mb-2">文字位置</label>
            <div className="flex gap-4 mb-4">
              <BaseRadio
                name="position"
                label="顶部"
                value="top"
                checked={position === "top"}
                onChange={(v) => setPosition(v)}
              />
              <BaseRadio
                name="position"
                label="底部"
                value="bottom"
                checked={position === "bottom"}
                onChange={(v) => setPosition(v)}
              />
            </div>

            <label className="block text-sm font-medium mb-2">背景效果</label>
            <div className="flex gap-4">
              <BaseRadio
                name="backdrop"
                label="透明"
                value={"false"}
                checked={!backdrop}
                onChange={(v) => { setBackdrop(Boolean(v)); }}
              />
              <BaseRadio
                name="backdrop"
                label="半透明"
                value={"true"}
                checked={backdrop}
                onChange={(v) => setBackdrop(Boolean(v))}
              />
            </div>
          </div>
        </Panel>
        <Panel
          title="译文"
          description=""
          className="!bg-transparent !border-none !max-w-full"
        >
          <div
            className="text-lg  rounded "
            style={{
              background: `url(${item.image})`,
            }}
          >
            <div
              className="flex relative p-8  italic"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(0,0,0,.63) 40%)",
                fontFamily: "serif",
              }}
            >
              <div
                style={{
                  color: "rgb(247, 233, 212)",
                  opacity: 0.95,
                }}
                className="whitespace-pre-wrap"
              >
                {item.translation}
              </div>
            </div>
          </div>
        </Panel>
        <Panel
          title="生词"
          description="词条源自剑桥词典"
          className="!bg-transparent !border-none !max-w-full"
        >
          <Prose content={item.wordlist}></Prose>
        </Panel>
      </div>
    </div>
  );
}
