import { cn } from "@/lib/utils";
import { FC, InputHTMLAttributes } from "react";

interface AddressInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  labelClassName?: string;
  inputContainerClassName?: string;
}

const Input: FC<AddressInputProps> = ({
  label,
  labelClassName,
  inputContainerClassName,
  id,
  ...rest
}) => {
  return (
    <>
      <label
        className={cn("nui-label w-full pb-1 text-[0.825rem]", labelClassName)}
        htmlFor="num"
      >
        {label}
      </label>
      <div className={cn("group/nui-input relative", inputContainerClassName)}>
        <input
          id={id}
          name={id}
          className=" invalid:border-danger-300 pl-10 nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
          {...rest}
        />
        <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
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
                d="M128 24a80 80 0 0 0-80 80c0 72 80 128 80 128s80-56 80-128a80 80 0 0 0-80-80Zm0 112a32 32 0 1 1 32-32a32 32 0 0 1-32 32Z"
                opacity=".2"
              />
              <path d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40Zm0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24Zm0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.19 254.19 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.19 254.19 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88Zm0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118Z" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Input;
