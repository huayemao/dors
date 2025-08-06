import { SITE_META } from "@/constants";

export function Footer() {
  return (
    <div className="relative z-20 bg-muted-100 dark:bg-muted-900 text-muted-500 mt-auto">
      <div className="w-full max-w-6xl mx-auto xl:max-w-[85%] py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <p className=" text-sm text-center sm:text-left">
          © 2022 - present. All Rights Reserved.
        </p>
        {SITE_META.ICP && (
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-sm">
            <a
              href="http://beian.miit.gov.cn/"
              className="font-sans ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {SITE_META.ICP}
            </a>
          </span>
        )}
      </div>
    </div>
  );
}
