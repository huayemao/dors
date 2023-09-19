export function Footer() {
  return (
    <div className="relative z-20 bg-muted-100 dark:bg-muted-900">
      <div className="w-full max-w-7xl mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className="text-muted-500 text-sm text-center sm:text-left">
          © 2022 - present. All Rights Reserved.
        </p>
        {/* <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-muted-500 text-sm">
          Made by
          <a
            href="https://cssninja.io"
            className="font-sans font-semibold text-violet-500 ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            SITE_CONFIG
          </a>
        </span> */}
      </div>
    </div>
  );
}
