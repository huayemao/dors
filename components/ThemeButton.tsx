"use client";
import { InputHTMLAttributes } from "react";

const ThemeButton = () => {
  const toggleDarkMode: InputHTMLAttributes<HTMLInputElement>["onChange"] = (
    e
  ) => {
    const v = e.target.checked;
    localStorage.setItem("theme", v ? "light" : "dark");

    console.log(v);

    if (
      !v ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem('theme')
  };

  return (
    <div className="h-12 w-12 flex items-center justify-center">
      <label
        className="
  block
  w-9
  h-9
  overflow-hidden
  relative
  mx-auto
  lg:m-0
  rounded-full
  focus-within:tw-accessibility-static
  "
      >
        <input
          defaultChecked={window.localStorage.getItem("theme") === "light"}
          type="checkbox"
          onChange={toggleDarkMode}
          className="absolute top-0 left-0 z-[2] w-full h-full opacity-0 cursor-pointer"
        />
        <span
          className="
    block
    relative
    w-9
    h-9
    bg-white
    dark:bg-slate-800
    rounded-full
    border border-slate-300
    dark:border-slate-700
  "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            className="block absolute top-1/2 left-1/2 w-5 h-5 text-yellow-400 transition-all duration-300 pointer-events-none opacity-100 -translate-x-[50%] -translate-y-1/2"
            width="32"
            height="32"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" className="fill-current"></circle>
              <path className="fill-current" d="M12 1v2"></path>
              <path className="fill-current" d="M12 21v2"></path>
              <path className="fill-current" d="M4.22 4.22l1.42 1.42"></path>
              <path className="fill-current" d="M18.36 18.36l1.42 1.42"></path>
              <path className="fill-current" d="M1 12h2"></path>
              <path className="fill-current" d="M21 12h2"></path>
              <path className="fill-current" d="M4.22 19.78l1.42-1.42"></path>
              <path className="fill-current" d="M18.36 5.64l1.42-1.42"></path>
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            className="block absolute top-1/2 left-1/2 w-5 h-5 text-yellow-400 transition-all duration-300 pointer-events-none opacity-0 -translate-x-[45%] -translate-y-[150%]"
            width="32"
            height="32"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                className="fill-current"
                d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z"
              ></path>
            </g>
          </svg>
        </span>
      </label>
    </div>
  );
};


export default ThemeButton