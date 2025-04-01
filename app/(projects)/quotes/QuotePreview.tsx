import { Panel } from "@/components/Base/Panel";
import Prose from "@/components/Base/Prose";
import { ClientOnly } from "@/components/ClientOnly";
import { cn } from "@/lib/utils";
import { QuoteIcon, Download, RotateCcw } from "lucide-react";
import { useEntity } from "./context";
import { BaseButtonClose, BaseRadio, BaseTabSlider } from "@shuriken-ui/react";
import { useState, useEffect, useReducer } from "react";
import html2canvas from "html2canvas";
import { useHover } from "@uidotdev/usehooks";
import { Dialog } from "@headlessui/react";
import { Quote } from "./constants";
import { motion, AnimatePresence } from "framer-motion";

// 定义状态和操作类型
const initialState = {
  fontSize: 32,
  textColor: "white",
  position: "bottom",
  backdrop: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "SET_TEXT_COLOR":
      return { ...state, textColor: action.payload };
    case "SET_POSITION":
      return { ...state, position: action.payload };
    case "TOGGLE_BACKDROP":
      return { ...state, backdrop: !state.backdrop };
    default:
      return state;
  }
};

export default function QuotePreview() {
  const state = useEntity();
  const { currentEntity: item } = state;
  const [exportState, dispatch] = useReducer(reducer, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("quote");

  return (
    <div className="space-y-4">
      <BaseTabSlider
        classes={{ wrapper: "w-32 flex-shrink-0", inner: "!mb-0" }}
        defaultValue="quote"
        onChange={setActiveTab}
        tabs={[
          { label: "引用", value: "quote" },
          { label: "生词", value: "wordlist" },
        ]}
      >
        <></>
      </BaseTabSlider>
      {activeTab === "quote" && (
        <QuoteContent item={item} exportState={exportState}></QuoteContent>
      )}
      {activeTab === "wordlist" && (
        <Panel
          title="生词"
          description="词条源自剑桥词典"
          className="!bg-transparent !border-none !max-w-full"
        >
          <Prose content={item.wordlist}></Prose>
        </Panel>
      )}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        打开生词
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded p-6">
            <QuoteControls
              exportState={exportState}
              dispatch={dispatch}
            ></QuoteControls>
            <BaseButtonClose onClick={() => setIsOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
function QuoteContent({
  item,
  exportState,
}: {
  item: Quote;
  exportState: any;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ref, isHovered] = useHover<HTMLDivElement>();

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
      ref={ref}
      className="root relative"
      style={{
        boxSizing: "border-box",
        contain: "content",
        contentVisibility: "auto",
        padding: "0px",
        width: "inherit",
      }}
    >
      {isHovered && !isExporting && (
        <div className="absolute top-4 right-4 z-[200] flex gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-2 rounded text-white bg-black/50 hover:bg-black/70"
          >
            切换
          </button>
          <button
            onClick={handleExport}
            className="p-2 rounded text-white bg-black/50 hover:bg-black/70"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="w-full">
        <img
          alt=""
          src={item.image}
          style={{
            alignSelf: "stretch",
            display: "flex",
            width: "100%",
            zIndex: -1,
          }}
        />
        <AnimatePresence>
          {isFlipped ? (
            <motion.div
              key={"translation"}
              className="flex absolute inset-0 justify-center items-center p-8 italic h-full"
              style={{
                background:
                  "linear-gradient(90deg,transparent,rgba(0,0,0,.63) 40%)",
                fontFamily: "serif",
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  opacity: { duration: 0.2 },
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  opacity: { duration: 0.2 },
                },
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
            </motion.div>
          ) : (
            <motion.div
              key={"quote"}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  opacity: { duration: 0.2 },
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  opacity: { duration: 0.2 },
                },
              }}
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
                justifyContent: exportState.position == "top" ? "start" : "end",
                marginTop: "auto",
                zIndex: 100,
              }}
            >
              <div
                className={cn("flex p-12 relative", {
                  "-mt-6 pb-32": exportState.position == "top",
                  "pt-20": exportState.position == "bottom",
                })}
                style={{
                  alignItems: "flex-start",
                  color: "var(--color-neutral-foreground-1)",
                  background:
                    exportState.position == "top"
                      ? "linear-gradient(rgba(0,0,0,.53),transparent 100%)"
                      : "linear-gradient(transparent,rgba(0,0,0,.53) 40%)",
                }}
              >
                <blockquote
                  className="whitespace-pre-wrap flex gap-6 items-end text-5xl leading-normal"
                  style={{
                    boxSizing: "border-box",
                    fontFamily: "georgia",
                    fontSize: `${exportState.fontSize}px`,
                    color: exportState.textColor,
                  }}
                >
                  <p
                    className={cn(
                      "rounded-lg p-4 flex-[2] italic text-balance",
                      {
                        "bg-slate-900/10": exportState.backdrop,
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
                <div
                  className={cn(
                    "absolute right-16 ",
                    { "top-32": exportState.position == "bottom" },
                    { "top-16": exportState.position == "top" }
                  )}
                >
                  <QuoteIcon
                    className="size-8"
                    style={{ color: exportState.textColor }}
                    fill={exportState.textColor}
                  ></QuoteIcon>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuoteControls({
  exportState,
  dispatch,
}: {
  exportState: any;
  dispatch;
}) {
  return (
    <Panel
      title="控制"
      description="调整显示效果"
      className="!bg-transparent !border-none !max-w-full mb-4"
    >
      <div className="p-4">
        <label className="block text-sm font-medium mb-2">字体大小</label>
        <div className="flex gap-4 mb-4">
          {[24, 32, 48, 64].map((size) => (
            <BaseRadio
              key={size}
              name="fontSize"
              label={`${size}px`}
              value={size}
              checked={exportState.fontSize === size}
              onChange={() =>
                dispatch({ type: "SET_FONT_SIZE", payload: size })
              }
            />
          ))}
        </div>

        <label className="block text-sm font-medium mb-2">文字颜色</label>
        <div className="flex gap-4">
          {["white", "rgb(247, 233, 212)"].map((color) => (
            <BaseRadio
              key={color}
              name="textColor"
              label={color}
              value={color}
              checked={exportState.textColor === color}
              onChange={() =>
                dispatch({ type: "SET_TEXT_COLOR", payload: color })
              }
            />
          ))}
        </div>

        <label className="block text-sm font-medium mb-2">文字位置</label>
        <div className="flex gap-4 mb-4">
          {["top", "bottom"].map((pos) => (
            <BaseRadio
              key={pos}
              name="position"
              label={pos === "top" ? "顶部" : "底部"}
              value={pos}
              checked={exportState.position === pos}
              onChange={() => dispatch({ type: "SET_POSITION", payload: pos })}
            />
          ))}
        </div>

        <label className="block text-sm font-medium mb-2">背景效果</label>
        <div className="flex gap-4">
          <BaseRadio
            name="backdrop"
            label="透明"
            value={"false"}
            checked={!exportState.backdrop}
            onChange={() => dispatch({ type: "TOGGLE_BACKDROP" })}
          />
          <BaseRadio
            name="backdrop"
            label="半透明"
            value={"true"}
            checked={exportState.backdrop}
            onChange={() => dispatch({ type: "TOGGLE_BACKDROP" })}
          />
        </div>
      </div>
    </Panel>
  );
}
