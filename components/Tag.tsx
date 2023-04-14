import React from "react";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  type: "primary" | "secondary";
  text: string;
}

export default function Tag({ type, text, ...props }: Props) {
  const baseClasses = `inline-block font-sans text-xs py-1.5 px-3 mb-4 rounded-lg`;

  let classes = "";
  let backgroundColorClass = "";
  let textColorClass = "";

  switch (type) {
    case "primary":
      backgroundColorClass = "bg-primary-500";
      textColorClass = "text-white";
      break;
    case "secondary":
      backgroundColorClass = "bg-primary-100 dark:bg-primary-500";
      textColorClass = "text-primary-500 dark:text-white";
      break;
    default:
      // handle other possible types
      break;
  }

  classes = `${baseClasses} ${backgroundColorClass} ${textColorClass}`;

  return (
    <span className={classes} {...props}>
      {text}
    </span>
  );
}
