import { cn } from "@/lib/utils";
import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  labelClassName?: string;
  inputContainerClassName?: string;
  data: { label: string; value: string | number }[];
  labelFloat?: boolean;
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
  ...restProps
}) => {
  return (
    <div
      className={cn(
        "nui-select-wrapper nui-select-wrapper nui-select-default nui-select-md",
        {
          "nui-select-label-float": labelFloat,
        }
      )}
    >
      <div className="nui-select-outer">
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
        <div className="text-muted-400 pointer-events-none absolute end-0 top-0 flex items-center justify-center transition-transform duration-300 group-focus-within/nui-select:-rotate-180 h-10 w-10">
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
