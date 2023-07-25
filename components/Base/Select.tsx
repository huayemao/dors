import { cn } from "@/lib/utils";
import React, { ChangeEvent, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  defaultValue: string;
  id: string;
  labelClassName?: string;
  inputContainerClassName?: string;
  data: { label: string; value: string | number }[];
}

const SelectComponent: React.FC<Props> = ({
  defaultValue,
  id,
  data,
  label,
  labelClassName,
  inputContainerClassName,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // 处理选择变化的逻辑
  };

  return (
    <>
      <label
        className={cn("nui-label w-full pb-1 text-[0.825rem]", labelClassName)}
        htmlFor="num"
      >
        {label}
      </label>
      <div className={cn("group/nui-input relative", inputContainerClassName)}>
        <select
          defaultValue={defaultValue}
          id={id}
          name={id}
          className="pl-10 nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-600 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full cursor-pointer appearance-none border bg-white font-sans focus:shadow-lg px-2 pe-9 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded pe-4 ps-9"
          onChange={handleChange}
        >
          {data.map((e) => (
            <option value={e.value} key={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <div className="text-muted-400 group-focus-within/nui-select:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
          <svg
            data-v-cd102a71
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            className="icon h-[1.15rem] w-[1.15rem]"
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
          >
            <g fill="currentColor">
              <path
                d="M200 56v55.1c0 39.7-31.75 72.6-71.45 72.9A72 72 0 0 1 56 112V56a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8Z"
                opacity=".2"
              />
              <path d="M232 64h-24v-8a16 16 0 0 0-16-16H64a16 16 0 0 0-16 16v8H24A16 16 0 0 0 8 80v16a40 40 0 0 0 40 40h3.65A80.13 80.13 0 0 0 120 191.61V216H96a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16h-24v-24.42c31.94-3.23 58.44-25.64 68.08-55.58H208a40 40 0 0 0 40-40V80a16 16 0 0 0-16-16ZM48 120a24 24 0 0 1-24-24V80h24v32q0 4 .39 8Zm144-8.9c0 35.52-28.49 64.64-63.51 64.9H128a64 64 0 0 1-64-64V56h128ZM232 96a24 24 0 0 1-24 24h-.5a81.81 81.81 0 0 0 .5-8.9V80h24Z" />
            </g>
          </svg>
        </div>
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
    </>
  );
};

export default SelectComponent;
