import { cn } from "@/lib/utils";

function Annotate({ source, children, danger }) {
  return (
    <>
      <span
        className={cn(
          "leading-5 lg:leading-6 inline-block outline outline-2 outline-violet-600 px-1",
          { "ml-1": children, "border-rose-700": danger }
        )}
      >
        {source}
      </span>
      {children && (
        <span
          className={cn("relative px-1 text-violet-700", {
            "text-rose-700": danger,
          })}
        >
          → {children}
        </span>
      )}
    </>
  );
}

export default Annotate;
