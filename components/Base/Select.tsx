import { cn } from "@/lib/utils";
import React, { InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLSelectElement>, "size"> {
  label: string;
  id: string;
  labelClassName?: string;
  inputContainerClassName?: string;
  data: { label: string; value: string | number }[];
  labelFloat?: boolean;
  size?: "sm" | "md" | "lg";
  shape?: "full" | "straight" | "rounded" | "curved";
}

const SelectComponent: React.FC<Props> = ({
  defaultValue,
  id,
  data,
  label,
  labelClassName,
  inputContainerClassName,
  className,
  labelFloat = false,
  size = "md",
  shape = "straight",
  ...restProps
}) => {
  return (
    <div
      className={cn("nui-select-wrapper nui-select-default ", {
        "nui-select-label-float": labelFloat,
        "nui-select-md": size == "md",
        "nui-select-sm": size == "sm",
        "nui-select-lg": size == "lg",
        "nui-select-full": shape == "full",
      })}
    >
      {!labelFloat && (
        <label
          className={cn(
            "nui-label w-full pb-1 text-[0.825rem]",
            labelClassName
          )}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="nui-select-outer">
        <select
          defaultValue={defaultValue}
          id={id}
          name={id}
          className={cn("nui-select ", className)}
          {...restProps}
        >
          {data.map((e) => (
            <option value={e.value} key={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        {labelFloat && (
          <label className={cn("nui-label-float", labelClassName)} htmlFor={id}>
            {label}
          </label>
        )}
        <div className="nui-select-chevron">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m6 9 6 6 6-6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectComponent;
