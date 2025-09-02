import { cn } from "@/lib/utils";
import React, { PropsWithChildren, ReactElement, ReactNode } from "react";

function Columns({ children, noDivide, className }: PropsWithChildren<{ noDivide?: boolean, className?: string }>) {
  const arr = React.Children.toArray(children);

  return (
    <div className={cn("md:flex md:divide-x my-6", {
      "!divide-x-0 gap-4": noDivide
    }, className)}>
      {arr
        .filter((e) => typeof (e as ReactElement).type != "string" || (e as ReactElement).type != 'hr')
        .map((el) => (
          // eslint-disable-next-line react/jsx-key
          <div className="flex-1 md:px-6">{el}</div>
        ))}
    </div>
  );
}

export default Columns;
