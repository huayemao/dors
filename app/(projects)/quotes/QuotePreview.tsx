import { Panel } from "@/components/Base/Panel";
import Prose from "@/components/Base/Prose";
import { ClientOnly } from "@/components/ClientOnly";
import { cn } from "@/lib/utils";
import { QuoteIcon } from "lucide-react";
import { useEntity } from "./context";

const config = {
  position: "bottom",
  backdrop: false,
};

export default function QuotePreview() {
  const state = useEntity();
  const { currentEntity: item } = state;
  return (
    <div
      className="min-h-screen bg-muted-100 dark:bg-muted-900 lg:grid grid-cols-12 gap-4 justify-center  items-start p-4"
      // style={{ background: '#f7e9d4' }}
    >
      <div className="flex-1 col-span-8 px-4">
        <div
          className="root"
          style={{
            boxSizing: "border-box",
            contain: "content",
            contentVisibility: "auto",
            height: "inherit",
            padding: "0px",
            width: "inherit",
          }}
        >
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
                justifyContent: config.position == "top" ? "start" : "end",
                marginTop: "auto",
                zIndex: 100,
              }}
            >
              <div
                className={cn("flex  p-12 relative", {
                  "-mt-6 pb-32": config.position == "top",
                  "pt-20": config.position == "bottom",
                })}
                style={{
                  alignItems: "flex-start",
                  color: "var(--color-neutral-foreground-1)",
                  background:
                    config.position == "top"
                      ? "linear-gradient(rgba(0,0,0,.53),transparent 100%)"
                      : "linear-gradient(transparent,rgba(0,0,0,.53) 40%)",
                }}
              >
                <blockquote
                  className="whitespace-pre-wrap flex gap-6 text-white items-end text-5xl leading-normal"
                  style={{ boxSizing: "border-box", fontFamily: "georgia" }}
                >
                  <p
                    className={cn(
                      "first-letter:text-8xl   rounded-lg  p-4 flex-[2]  italic  text-balance",
                      {
                        "bg-slate-900/10": !!config.backdrop,
                      }
                    )}
                    style={{
                      color: "white",
                      fontFamily: "georgia,serif",
                      fontStyle: "italic",
                    }}
                  >
                    <QuoteIcon
                      className="size-8 absolute right-16 top-32 text-white"
                      fill="white"
                    ></QuoteIcon>
                    {item.quote}
                  </p>
                  <span
                    className="flex-[1] uppercase text-balance text-right"
                    style={{ fontFamily: "georgia" }}
                  >
                    — {item.artwork}
                  </span>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="col-span-4">
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
