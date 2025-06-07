import { cn } from "@/lib/utils";

// todo: remove this comp, use Note istead

function Annotate({ source, children, danger, arrow = true, ...props }) {
  return (
    <>
      <span
        className={cn(
          "leading-5 lg:leading-6 inline-block outline outline-2 outline-primary-600 dark:outline-primary-400 px-1",
          { "ml-1": children, "border-rose-700": danger }
        )}
        {...props}
      >
        {source}
      </span>
      {children && (
        <span
          className={cn("relative px-1 text-primary-700 dark:text-primary-400", {
            "text-rose-700": danger,
          })}
        >
          {arrow && "→"} {children}
        </span>
      )}
    </>
  );
}

export default Annotate;
