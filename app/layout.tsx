import "@/styles/globals.css";

export default function RootLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  return (
    <html>
      <head />
      <body>
        {" "}
        <div className="w-full h-full bg-white dark:bg-muted-900">
          <div
            id="sidebar"
            className="fixed top-0 left-0 h-full bg-muted-100 dark:bg-muted-1000 transition-all duration-300 z-50 w-[250px] -translate-x-full lg:translate-x-0 "
          >
            <div className="w-full h-20 flex items-center justify-between px-6">
              <a href="/" className="flex items-center gap-2">
                <img
                  src="/img/huayemao.svg"
                  className="w-8 h-8 dark:invert"
                  alt="App logo"
                  width="48"
                  height="48"
                />
                <div className="w-24 dark:invert block">花野猫</div>
              </a>
              <button
                type="button"
                className="hidden items-center justify-center w-10 h-10 mask mask-blob hover:bg-muted-200 dark:hover:bg-muted-800 text-muted-700 dark:text-muted-400 transition-colors duration-300 cursor-pointer lg:flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                  data-icon="ph:dots-nine-duotone"
                  className="iconify w-5 h-5 iconify--ph"
                >
                  <path
                    fill="currentColor"
                    d="M72 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm56 56a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm68-112a12 12 0 1 0-12-12a12 12 0 0 0 12 12ZM60 184a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0-136a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm136 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12ZM128 48a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12Z"
                  ></path>
                </svg>
              </button>

              <button
                type="button"
                className="
            flex
            lg:hidden
            items-center
            justify-center
            w-10
            h-10
            mask mask-blob
            hover:bg-muted-200
            dark:hover:bg-muted-800
            text-muted-700
            dark:text-muted-400
            transition-colors
            duration-300
            cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  data-icon="lucide:arrow-left"
                  className="iconify w-5 h-5 iconify--lucide"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 12H5m7 7l-7-7l7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="relative h-[calc(100%_-_10rem)] w-full overflow-y-auto slimscroll py-6 px-6">
              <ul id="sidebar-menu" className="space-y-3">
                <li>
                  <a
                    href="/"
                    className="flex items-center gap-4 py-3 rounded-lg text-muted-500 hover:bg-muted-200 dark:hover:bg-muted-900 hover:text-muted-600 dark:hover:text-muted-200 transition-colors duration-300 px-4 bg-primary-200 dark:bg-primary-600/20 text-primary-600 dark:text-primary-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      data-icon="ph:gauge-duotone"
                      className="iconify w-6 h-6 iconify--ph"
                    >
                      <path
                        fill="currentColor"
                        d="M232 160v24a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8v-22.9C24 103.6 70.2 56.2 127.6 56A104 104 0 0 1 232 160Z"
                        opacity=".2"
                      ></path>
                      <path
                        fill="currentColor"
                        d="M207.1 80.7A111.3 111.3 0 0 0 128 48h-.4c-50.6.2-93.4 34.5-107 81.2a7.1 7.1 0 0 0-.8 1.8a11 11 0 0 0-.2 1.8a110.9 110.9 0 0 0-3.6 28.3V184a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-24a111.2 111.2 0 0 0-32.9-79.3ZM224 184H119.7l58.5-76.3a8 8 0 0 0-12.7-9.7l-66 86H32v-22.9a98.3 98.3 0 0 1 1.7-18.1l22.7 6.1a7.6 7.6 0 0 0 2.1.3a8 8 0 0 0 2-15.8l-22.6-6C50.6 93 82.2 67.5 120 64.3V88a8 8 0 0 0 16 0V64.3A95.6 95.6 0 0 1 195.8 92a96.9 96.9 0 0 1 22.6 35.5l-22.9 6.1a8 8 0 0 0 2 15.8a7.6 7.6 0 0 0 2.1-.3l22.9-6.1a95.1 95.1 0 0 1 1.5 17Z"
                      ></path>
                    </svg>
                    <span className="font-sans text-sm block">对话</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/files"
                    className="flex items-center gap-4 py-3 rounded-lg text-muted-500 hover:bg-muted-200 dark:hover:bg-muted-900 hover:text-muted-600 dark:hover:text-muted-200 transition-colors duration-300 px-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      data-icon="ph:arrows-left-right-duotone"
                      className="iconify w-6 h-6 iconify--ph"
                    >
                      <path
                        fill="currentColor"
                        d="m213.7 181.7l-32 32a8.2 8.2 0 0 1-11.4 0a8.1 8.1 0 0 1 0-11.4l18.4-18.3H48a8 8 0 0 1 0-16h140.7l-18.4-18.3a8.1 8.1 0 0 1 11.4-11.4l32 32a8.1 8.1 0 0 1 0 11.4Zm-139.4-64a8.2 8.2 0 0 0 11.4 0a8.1 8.1 0 0 0 0-11.4L67.3 88H208a8 8 0 0 0 0-16H67.3l18.4-18.3a8.1 8.1 0 0 0-11.4-11.4l-32 32a8.1 8.1 0 0 0 0 11.4Z"
                      ></path>
                    </svg>
                    <span className="font-sans text-sm block">文件</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/payments.html"
                    className="flex items-center gap-4 py-3 rounded-lg text-muted-500 hover:bg-muted-200 dark:hover:bg-muted-900 hover:text-muted-600 dark:hover:text-muted-200 transition-colors duration-300 px-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      data-icon="ph:check-duotone"
                      className="iconify w-6 h-6 iconify--ph"
                    >
                      <path
                        fill="currentColor"
                        d="M104 192a8.5 8.5 0 0 1-5.7-2.3l-56-56a8.1 8.1 0 0 1 11.4-11.4l50.3 50.4L210.3 66.3a8.1 8.1 0 0 1 11.4 11.4l-112 112a8.5 8.5 0 0 1-5.7 2.3Z"
                      ></path>
                    </svg>
                    <span className="font-sans text-sm block">Payments</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full h-20 flex items-center justify-between px-6">
              <div className="relative w-full h-20 flex items-center justify-between">
                <button
                  type="button"
                  className="w-full flex items-center gap-2"
                >
                  <img
                    className="w-10 h-10 rounded-full mx-0"
                    src="/img/avatars/44.jpg"
                    alt="User photo"
                    width="40"
                    height="40"
                  />
                  <span className="block">
                    <h5 className="font-heading font-semibold text-muted-600 dark:text-muted-200">
                      Mara C.
                    </h5>
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    role="img"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    data-icon="lucide:chevron-up"
                    className="iconify w-5 h-5 ml-auto text-muted-400 transition-transform duration-300 block iconify--lucide"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m18 15l-6-6l-6 6"
                    ></path>
                  </svg>
                </button>

                <div
                  x-show="isOpen"
                  x-transition=""
                  className="
              absolute
              -top-80
              -left-2
              w-[240px]
              overflow-y-auto
              slimscroll
              p-2
              rounded-lg
              bg-white
              dark:bg-muted-900
              border border-muted-200
              dark:border-muted-800
              shadow-2xl shadow-muted-400/20
              dark:shadow-muted-800/10
              z-20
              hidden
            "
                >
                  <div
                    className="
                flex
                items-center
                gap-x-2
                py-4
                px-6
                border-b border-muted-200
                dark:border-muted-700
              "
                  >
                    <div className="relative flex items-center justify-center h-12 w-12">
                      <img
                        src="/img/avatars/44.jpg"
                        className="w-full h-full object-cover rounded-full"
                        alt="Profile image"
                        width="48"
                        height="48"
                      />
                    </div>
                    <h3
                      className="
                  font-sans
                  text-sm
                  font-medium
                  uppercase
                  text-muted-500
                  dark:text-muted-200
                "
                    >
                      Hi, Mara
                    </h3>
                  </div>
                  <ul className="space-y-1 pt-2">
                    <li>
                      <a
                        href="/documents.html"
                        className="
                    flex
                    items-center
                    gap-3
                    p-2
                    rounded-lg
                    text-muted-400
                    hover:text-primary-500 hover:bg-muted-100
                    dark:hover:bg-muted-800
                    transition-colors
                    duration-300
                  "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:folder-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="M98.3 50.3L128 80H32V56a8 8 0 0 1 8-8h52.7a7.9 7.9 0 0 1 5.6 2.3Z"
                            opacity=".2"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M216 72h-84.7L104 44.7A15.9 15.9 0 0 0 92.7 40H40a16 16 0 0 0-16 16v144.6A15.4 15.4 0 0 0 39.4 216h177.5a15.2 15.2 0 0 0 15.1-15.1V88a16 16 0 0 0-16-16ZM92.7 56l16 16H40V56ZM216 200H40V88h176Z"
                          ></path>
                        </svg>
                        <div className="font-sans">
                          <h5 className="text-xs font-semibold text-muted-800 dark:text-muted-200">
                            Documents
                          </h5>
                          <p className="text-xs text-muted-400">
                            Documents and statements
                          </p>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/offers.html"
                        className="
                    flex
                    items-center
                    gap-3
                    p-2
                    rounded-lg
                    text-muted-400
                    hover:text-primary-500 hover:bg-muted-100
                    dark:hover:bg-muted-800
                    transition-colors
                    duration-300
                  "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:gift-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="M216 72h-35a32 32 0 0 0-47.3-42.9a29.2 29.2 0 0 0-5.7 8.2a29.2 29.2 0 0 0-5.7-8.2A32 32 0 0 0 75 72H40a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16v64a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-64a16 16 0 0 0 16-16V88a16 16 0 0 0-16-16Zm-71-31.6A16 16 0 1 1 167.6 63c-4.9 5-19.2 7.7-31.3 8.7c1-12.1 3.7-26.4 8.7-31.3Zm-56.6 0a16.1 16.1 0 0 1 22.6 0c5 4.9 7.7 19.2 8.7 31.3c-12.1-1-26.4-3.7-31.3-8.7a16.1 16.1 0 0 1 0-22.6ZM40 88h80v32H40Zm16 48h64v64H56Zm144 64h-64v-64h64Zm16-80h-80V88h80v32Z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M208 128v72a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8v-72Z"
                            opacity=".2"
                          ></path>
                        </svg>
                        <div className="font-sans">
                          <h5 className="text-xs font-semibold text-muted-800 dark:text-muted-200">
                            Offers
                          </h5>
                          <p className="text-xs text-muted-400">
                            Offers from our partners
                          </p>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/settings.html"
                        className="
                    flex
                    items-center
                    gap-3
                    p-2
                    rounded-lg
                    text-muted-400
                    hover:text-primary-500 hover:bg-muted-100
                    dark:hover:bg-muted-800
                    transition-colors
                    duration-300
                  "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:gear-six-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="m229.6 106l-25.9-14.4a80.1 80.1 0 0 0-6.3-11l.5-29.6a102.6 102.6 0 0 0-38.2-22l-25.4 15.2a88.3 88.3 0 0 0-12.6 0L96.2 28.9A104 104 0 0 0 58.1 51l.5 29.7a73.6 73.6 0 0 0-6.3 10.9l-26 14.4a102 102 0 0 0 .1 44l25.9 14.4a80.1 80.1 0 0 0 6.3 11l-.5 29.6a102.6 102.6 0 0 0 38.2 22l25.4-15.2a88.3 88.3 0 0 0 12.6 0l25.5 15.3a104 104 0 0 0 38.1-22.1l-.5-29.7a73.6 73.6 0 0 0 6.3-10.9l26-14.4a102 102 0 0 0-.1-44ZM128 176a48 48 0 1 1 48-48a48 48 0 0 1-48 48Z"
                            opacity=".2"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M128 72a56 56 0 1 0 56 56a56 56 0 0 0-56-56Zm0 96a40 40 0 1 1 40-40a40 40 0 0 1-40 40Zm109.5-63.7a8 8 0 0 0-4-5.3l-23.8-13.2a69.3 69.3 0 0 0-4.3-7.5l.5-27.2a8.3 8.3 0 0 0-2.6-6.1a112 112 0 0 0-41.1-23.7a8.1 8.1 0 0 0-6.6.8l-23.3 14c-2.9-.1-5.7-.1-8.6 0l-23.3-14a8.1 8.1 0 0 0-6.6-.8a111.1 111.1 0 0 0-41.1 23.8a7.9 7.9 0 0 0-2.6 6l.5 27.2c-1.6 2.4-3 4.9-4.4 7.5L22.4 99a7.9 7.9 0 0 0-3.9 5.3a111.4 111.4 0 0 0 0 47.4a8 8 0 0 0 4 5.3l23.8 13.2a69.3 69.3 0 0 0 4.3 7.5l-.5 27.2a8.3 8.3 0 0 0 2.6 6.1a112 112 0 0 0 41.1 23.7a8.1 8.1 0 0 0 6.6-.8l23.3-14h8.6l23.4 14a7.3 7.3 0 0 0 4.1 1.2a10 10 0 0 0 2.4-.4a111.1 111.1 0 0 0 41.1-23.8a7.9 7.9 0 0 0 2.6-6l-.5-27.2c1.6-2.4 3-4.9 4.4-7.5l23.8-13.2a7.9 7.9 0 0 0 3.9-5.3a111.4 111.4 0 0 0 0-47.4Zm-15 40.5l-22.7 12.6a8.2 8.2 0 0 0-3.3 3.6a73.6 73.6 0 0 1-5.7 9.8a8.6 8.6 0 0 0-1.4 4.7l.4 25.9a94.4 94.4 0 0 1-29.1 16.9l-22.3-13.4a8.1 8.1 0 0 0-4.1-1.1h-.6a72.3 72.3 0 0 1-11.4 0a8.6 8.6 0 0 0-4.7 1.1l-22.3 13.4a95 95 0 0 1-29.1-16.8l.4-26a8.6 8.6 0 0 0-1.4-4.7a86.4 86.4 0 0 1-5.7-9.8a8.8 8.8 0 0 0-3.3-3.6l-22.7-12.6a94.8 94.8 0 0 1 0-33.6l22.7-12.6a8.2 8.2 0 0 0 3.3-3.6a73.6 73.6 0 0 1 5.7-9.8a8.6 8.6 0 0 0 1.4-4.7l-.4-25.9a94.4 94.4 0 0 1 29.1-16.9l22.3 13.4a8.4 8.4 0 0 0 4.7 1.1a72.3 72.3 0 0 1 11.4 0a8.6 8.6 0 0 0 4.7-1.1l22.3-13.4a95 95 0 0 1 29.1 16.8l-.4 26a8.6 8.6 0 0 0 1.4 4.7a86.4 86.4 0 0 1 5.7 9.8a8.8 8.8 0 0 0 3.3 3.6l22.7 12.6a94.8 94.8 0 0 1 0 33.6Z"
                          ></path>
                        </svg>
                        <div className="font-sans">
                          <h5 className="text-xs font-semibold text-muted-800 dark:text-muted-200">
                            Settings
                          </h5>
                          <p className="text-xs text-muted-400">
                            Manage preferences
                          </p>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/login.html"
                        className="
                    flex
                    items-center
                    gap-3
                    p-2
                    rounded-lg
                    text-muted-400
                    hover:text-primary-500 hover:bg-muted-100
                    dark:hover:bg-muted-800
                    transition-colors
                    duration-300
                  "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:sign-out-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="m221.7 133.7l-42 42a8.3 8.3 0 0 1-5.7 2.3a8 8 0 0 1-5.6-13.7l28.3-28.3H104a8 8 0 0 1 0-16h92.7l-28.3-28.3a8 8 0 0 1 11.3-11.4l42 42a8.1 8.1 0 0 1 0 11.4ZM104 208H48V48h56a8 8 0 0 0 0-16H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h56a8 8 0 0 0 0-16Z"
                          ></path>
                        </svg>
                        <div className="font-sans">
                          <h5 className="text-xs font-semibold text-muted-800 dark:text-muted-200">
                            Logout
                          </h5>
                          <p className="text-xs text-muted-400">
                            Logout from account
                          </p>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <main className="relative w-full overflow-hidden transition-all duration-300 z-10 ml-0 lg:w-[calc(100%_-_250px)] lg:ml-[250px]">
            <div
              className="
          w-full
          max-w-5xl
          min-h-screen
          mx-auto
          px-4
          md:px-6
          bg-white
          dark:bg-muted-900"
            >
              <div className="w-full flex items-center justify-between gap-6 py-4">
                <div className="flex items-center gap-4 grow max-w-md">
                  <button
                    type="button"
                    className="items-center justify-center w-10 h-10 mask mask-blob hover:bg-muted-200 dark:hover:bg-muted-800 text-muted-700 dark:text-muted-400 transition-colors duration-300 cursor-pointer hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      data-icon="ph:dots-nine-duotone"
                      className="iconify w-5 h-5 iconify--ph"
                    >
                      <path
                        fill="currentColor"
                        d="M72 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm56 56a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm68-112a12 12 0 1 0-12-12a12 12 0 0 0 12 12ZM60 184a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0-136a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm136 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12ZM128 48a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12Z"
                      ></path>
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="
                flex
                lg:hidden
                items-center
                justify-center
                w-10
                h-10
                mask mask-blob
                hover:bg-muted-200
                dark:hover:bg-muted-900
                text-muted-700
                dark:text-muted-400
                transition-colors
                duration-300
                cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                      data-icon="ph:dots-nine-duotone"
                      className="iconify w-5 h-5 iconify--ph"
                    >
                      <path
                        fill="currentColor"
                        d="M72 128a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm56 56a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm68-112a12 12 0 1 0-12-12a12 12 0 0 0 12 12ZM60 184a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0-136a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm136 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12ZM128 48a12 12 0 1 0 12 12a12 12 0 0 0-12-12Zm0 68a12 12 0 1 0 12 12a12 12 0 0 0-12-12Z"
                      ></path>
                    </svg>
                  </button>
                  <div
                    x-data="search()"
                    className="hidden md:block relative w-full rounded-md shadow-sm"
                  >
                    <div className="relative group">
                      <input
                        id="navbar-search-field"
                        className="w-full h-10 bg-muted-100 dark:bg-muted-1000 rounded-lg border border-transparent focus:border-muted-200 dark:border-muted-800 dark:focus:border-muted-700 focus:bg-white dark:focus:bg-muted-900 focus:shadow-xl focus:shadow-muted-400/10 dark:focus:shadow-muted-800/10 placeholder:text-muted-300 dark:placeholder:text-muted-700 text-base text-muted-600 dark:text-muted-200 pl-10 pr-4 py-2 transition-all duration-300 tw-accessibility"
                        placeholder="Search for anything..."
                        type="text"
                      />
                      <button
                        type="button"
                        className="
                    absolute
                    top-0
                    left-0
                    h-10
                    w-10
                    flex
                    justify-center
                    items-center
                    text-muted-400
                    dark:text-muted-600
                    group-focus-within:text-primary-500
                    transition-colors
                    duration-300
                    cursor-pointer
                  "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          data-icon="lucide:search"
                          className="iconify w-4 h-4 iconify--lucide"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21l-4.35-4.35"></path>
                          </g>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="absolute top-0 right-0 h-10 w-10 flex justify-center items-center text-muted-400 hover:text-muted-700 dark:hover:text-muted-100 transition-colors duration-300 cursor-pointer hidden"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          data-icon="lucide:x"
                          className="iconify w-4 h-4 iconify--lucide"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18 6L6 18M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>

                    <div
                      id="search-results"
                      className="
                  hidden
                  absolute
                  top-12
                  left-0
                  w-full
                  max-h-[240px]
                  overflow-y-auto
                  slimscroll
                  p-2
                  rounded-lg
                  bg-white
                  dark:bg-muted-900
                  border border-muted-200
                  dark:border-muted-800
                  shadow-2xl shadow-muted-400/20
                  dark:shadow-muted-800/10
                  transition-all
                  duration-300
                  z-[90]
                "
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-x-4">
                  <label
                    className="
                relative
                block
                h-6
                w-14
                bg-muted-200
                dark:bg-muted-700
                rounded-full
                scale-[0.8]
              "
                  >
                    <input
                      className="
                  peer
                  absolute
                  top-0
                  left-0
                  w-full
                  h-full
                  opacity-0
                  cursor-pointer
                  z-10
                "
                      type="checkbox"
                    />
                    <span
                      className="
                  absolute
                  -top-2
                  -left-1
                  flex
                  items-center
                  justify-center
                  h-10
                  w-10
                  bg-white
                  dark:bg-muted-900
                  border border-muted-200
                  dark:border-muted-800
                  rounded-full
                  -ml-1
                  peer-checked:ml-[45%] peer-checked:rotate-[360deg]
                  transition-all
                  duration-300
                "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="1em"
                        height="1em"
                        viewBox="0 0 20 20"
                        data-icon="heroicons-solid:sun"
                        x-show="!$store.app.isDark"
                        className="iconify w-6 h-6 text-yellow-400 fill-current iconify--heroicons-solid"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm4 8a4 4 0 1 1-8 0a4 4 0 0 1 8 0Zm-.464 4.95l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414Zm2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2h1Zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414l.707.707Zm1.414 8.486l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414ZM4 11a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2h1Z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="1em"
                        height="1em"
                        viewBox="0 0 20 20"
                        data-icon="pepicons:moon-filled"
                        x-show="$store.app.isDark"
                        className="iconify w-6 h-6 text-yellow-400 fill-current iconify--pepicons hidden"
                      >
                        <path
                          fill="currentColor"
                          d="M11.364 2.932a4.506 4.506 0 0 0-2.6 3.196a4.505 4.505 0 0 0 3.464 5.347a4.504 4.504 0 0 0 4.885-2.245c.489-.894 1.845-.57 1.877.449a9.045 9.045 0 0 1-.195 2.166c-1.035 4.87-5.815 7.98-10.678 6.947c-4.862-1.034-7.964-5.82-6.929-10.69c.974-4.58 5.283-7.644 9.895-7.078c1.008.124 1.21 1.498.28 1.908Z"
                        ></path>
                      </svg>
                    </span>
                  </label>

                  <div x-data="dropdown()" className="relative">
                    <button
                      type="button"
                      className="
                  h-10
                  inline-flex
                  justify-center
                  items-center
                  gap-x-2
                  px-6
                  py-2
                  font-sans
                  text-sm text-white
                  bg-primary-500
                  rounded-full
                  shadow-lg shadow-primary-500/20
                  hover:shadow-xl
                  tw-accessibility
                  transition-all
                  duration-300
                "
                    >
                      <span>Move Money</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        data-icon="lucide:chevron-down"
                        className="iconify w-4 h-4 transition-transform duration-300 iconify--lucide"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m6 9l6 6l6-6"
                        ></path>
                      </svg>
                    </button>

                    <div
                      x-show="isOpen"
                      x-transition=""
                      className="
                  absolute
                  top-11
                  right-0
                  w-[240px]
                  overflow-y-auto
                  slimscroll
                  p-2
                  rounded-lg
                  bg-white
                  dark:bg-muted-900
                  border border-muted-200
                  dark:border-muted-800
                  shadow-2xl shadow-muted-400/20
                  dark:shadow-muted-800/10
                  z-20
                  hidden
                "
                    >
                      <ul className="space-y-1">
                        <li>
                          <a
                            href="/payments-send.html"
                            className="
                        flex
                        items-center
                        gap-3
                        p-2
                        rounded-lg
                        text-muted-400
                        hover:text-primary-500 hover:bg-muted-100
                        dark:hover:bg-muted-800
                        transition-colors
                        duration-300
                      "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              width="1em"
                              height="1em"
                              viewBox="0 0 256 256"
                              data-icon="ph:arrow-right-duotone"
                              className="iconify w-5 h-5 iconify--ph"
                            >
                              <path
                                fill="currentColor"
                                d="m221.7 133.7l-72 72a8.2 8.2 0 0 1-11.4 0a8.1 8.1 0 0 1 0-11.4l58.4-58.3H40a8 8 0 0 1 0-16h156.7l-58.4-58.3a8.1 8.1 0 0 1 11.4-11.4l72 72a8.1 8.1 0 0 1 0 11.4Z"
                              ></path>
                            </svg>
                            <div className="font-sans">
                              <h5 className="text-sm font-semibold text-muted-800 dark:text-muted-200">
                                Send
                              </h5>
                              <p className="text-xs text-muted-400">
                                Send someone money
                              </p>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/payments-receive.html"
                            className="
                        flex
                        items-center
                        gap-3
                        p-2
                        rounded-lg
                        text-muted-400
                        hover:text-primary-500 hover:bg-muted-100
                        dark:hover:bg-muted-800
                        transition-colors
                        duration-300
                      "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              width="1em"
                              height="1em"
                              viewBox="0 0 256 256"
                              data-icon="ph:arrow-left-duotone"
                              className="iconify w-5 h-5 iconify--ph"
                            >
                              <path
                                fill="currentColor"
                                d="M224 128a8 8 0 0 1-8 8H59.3l58.4 58.3a8.1 8.1 0 0 1 0 11.4a8.2 8.2 0 0 1-11.4 0l-72-72a8.1 8.1 0 0 1 0-11.4l72-72a8.1 8.1 0 0 1 11.4 11.4L59.3 120H216a8 8 0 0 1 8 8Z"
                              ></path>
                            </svg>
                            <div className="font-sans">
                              <h5 className="text-sm font-semibold text-muted-800 dark:text-muted-200">
                                Receive
                              </h5>
                              <p className="text-xs text-muted-400">
                                Add or receive funds
                              </p>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/cards.html"
                            className="
                        flex
                        items-center
                        gap-3
                        p-2
                        rounded-lg
                        text-muted-400
                        hover:text-primary-500 hover:bg-muted-100
                        dark:hover:bg-muted-800
                        transition-colors
                        duration-300
                      "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              width="1em"
                              height="1em"
                              viewBox="0 0 256 256"
                              data-icon="ph:credit-card-duotone"
                              className="iconify w-5 h-5 iconify--ph"
                            >
                              <path
                                fill="currentColor"
                                d="M24 96.9h208V192a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8Z"
                                opacity=".2"
                              ></path>
                              <path
                                fill="currentColor"
                                d="M224 48H32a16 16 0 0 0-16 16v127.9a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16Zm0 16v24.9H32V64Zm0 128H32v-87.1h192V192Z"
                              ></path>
                              <path
                                fill="currentColor"
                                d="M200 160h-32a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16Zm-64 0h-16a8 8 0 0 0 0 16h16a8 8 0 0 0 0-16Z"
                              ></path>
                            </svg>
                            <div className="font-sans">
                              <h5 className="text-sm font-semibold text-muted-800 dark:text-muted-200">
                                Cards
                              </h5>
                              <p className="text-xs text-muted-400">
                                Manage your cards
                              </p>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/accounts.html"
                            className="
                        flex
                        items-center
                        gap-3
                        p-2
                        rounded-lg
                        text-muted-400
                        hover:text-primary-500 hover:bg-muted-100
                        dark:hover:bg-muted-800
                        transition-colors
                        duration-300
                      "
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                              role="img"
                              width="1em"
                              height="1em"
                              viewBox="0 0 256 256"
                              data-icon="ph:wallet-duotone"
                              className="iconify w-5 h-5 iconify--ph"
                            >
                              <path
                                fill="currentColor"
                                d="M224 88v112a8 8 0 0 1-8 8H56a16 16 0 0 1-16-16V64a16 16 0 0 0 16 16h160a8 8 0 0 1 8 8Z"
                                opacity=".2"
                              ></path>
                              <path
                                fill="currentColor"
                                d="M216 72H56a8 8 0 0 1 0-16h136a8 8 0 0 0 0-16H56a24.1 24.1 0 0 0-24 24v128a24.1 24.1 0 0 0 24 24h160a16 16 0 0 0 16-16V88a16 16 0 0 0-16-16Zm0 128H56a8 8 0 0 1-8-8V86.6a23.6 23.6 0 0 0 8 1.4h160Zm-48-56a12 12 0 1 1 12 12a12 12 0 0 1-12-12Z"
                              ></path>
                            </svg>
                            <div className="font-sans">
                              <h5 className="text-sm font-semibold text-muted-800 dark:text-muted-200">
                                Accounts
                              </h5>
                              <p className="text-xs text-muted-400">
                                Manage your accounts
                              </p>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    className=" h-10
                w-10
                inline-flex
                justify-center
                items-center
                font-sans
                text-sm text-muted-300
                dark:text-muted-700
                hover:text-yellow-400
                dark:hover:text-yellow-400
                bg-white
                dark:bg-muted-1000
                rounded-full
                shadow-lg shadow-muted-400/20
                dark:shadow-muted-800/30
                hover:shadow-xl
                tw-accessibility
                transition-all
                duration-300
                tw-accessibility
              "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 28 28"
                      data-icon="fluent:flash-28-filled"
                      className="iconify w-5 h-5 iconify--fluent"
                    >
                      <path
                        fill="currentColor"
                        d="M8.406 2.852A1.333 1.333 0 0 1 9.649 2h8.516c.926 0 1.57.922 1.251 1.792L17.323 9.5h4.838c1.178 0 1.777 1.416.957 2.262L9.784 25.503c-1.14 1.175-3.106.117-2.753-1.482L8.69 16.5H5.917a1.917 1.917 0 0 1-1.788-2.61L8.406 2.853Z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
