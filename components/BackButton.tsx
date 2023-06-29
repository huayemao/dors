import Link from "next/link";

export const BackButton = (
  <Link
    href={"/"}
    replace
    className="flex items-center gap-2 font-sans font-medium text-base text-muted-400 hover:text-primary-500 transition-colors duration-300"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      data-icon="gg:arrow-long-left"
      className="iconify w-5 h-5 iconify--gg"
    >
      <path
        fill="currentColor"
        d="m1.027 11.993l4.235 4.25L6.68 14.83l-1.821-1.828L22.974 13v-2l-18.12.002L6.69 9.174L5.277 7.757l-4.25 4.236Z"
      ></path>
    </svg>
    <span>返回</span>
  </Link>
);
