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
          placeholder="请输入"
          className={cn(
            "invalid:border-danger-300 invalid:focus:outline-danger-300  invalid:focus:placeholder-shown:outline-muted-300 pl-10 nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded",
            "invalid:placeholder-shown:border-muted-300"
          )}
          {...rest}
        />
      </div>
    </>
  );
};

export default Input;
