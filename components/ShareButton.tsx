"use client";
export const ShareButton = ({ options }) => {
  const share = async () => {
    try {
      await navigator.share({ ...options, url: window.location.href });
    } catch (err) {}
    /* @ts-ignore */
    window.setShareInfo({ ...options, url: window.location.href });
  };

  return (
    <button
      onClick={share}
      className="flex-1 inline-flex justify-center items-center py-4 px-5 rounded bg-muted-200 dark:bg-muted-700 hover:bg-muted-100 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 transition-colors duration-300 cursor-pointer tw-accessibility
"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        width="0.63em"
        height="1em"
        viewBox="0 0 320 512"
        data-icon="fa6-brands:facebook-f"
        className="iconify w-4 h-4 iconify--fa6-brands"
      >
        <path
          fill="currentColor"
          d="m279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
        ></path>
      </svg>
    </button>
  );
};
