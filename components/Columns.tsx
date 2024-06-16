import React, { ReactElement, ReactNode } from "react";

function Columns({ children }: { children: ReactNode }) {
  const arr = React.Children.toArray(children);

  return (
    <div className="md:flex md:divide-x">
      {arr
        .filter((e) => (e as ReactElement).type != "hr")
        .map((el) => (
          // eslint-disable-next-line react/jsx-key
          <div className="flex-1 md:px-2">{el}</div>
        ))}
    </div>
  );
}

export default Columns;
