import { SITE_META } from "@/constants";

export function Footer() {
  return (
    <div className="relative z-20 bg-white dark:bg-muted-800 text-muted-500 mt-auto">
      <div className="relative w-full max-w-7xl px-5 py-24 mx-auto z-20">
        <div className="flex flex-col ptablet:flex-row ltablet:flex-row lg:flex-row gap-6 ptablet:gap-0 ltablet:gap-0 lg:gap-0 flex-wrap md:text-left text-center -mb-10 -mx-4">
          <div  className="w-full ptablet:w-1/2 ltablet:w-1/4 lg:w-1/4 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left px-4">
            <a  className="flex flex-col md:flex-row gap-3 title-font font-medium items-center md:justify-start justify-center text-muted-800 dark:text-white">
              <img  className="h-12" src="/favicon.svg" alt="dors logo" width="48" height="48" />
              <span  className="font-heading font-bold text-2xl">Dors</span>
            </a>
            <p  className="font-sans text-sm w-full max-w-xs mx-auto md:max-w-[220px] md:mx-0 mt-2 text-muted-500 dark:text-muted-400">
              Dors 是花野猫开发为知识工作者打造的数字花园应用，包含的博客、个人记事本、及其他实用功能。
            </p>
          </div>
          <div className="w-full ptablet:w-1/2 ltablet:w-1/4 lg:w-1/4 px-4">
            <h2 className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-sm mb-3">
              实用工具
            </h2>
            <ul className="font-sans list-none space-y-2 mb-10">
              <li>
                <a href="/notes" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  小记
                </a>
              </li>
              <li>
                <a href="/video-splitter" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  秒切——秒切 - Web 视频分割工具
                </a>
              </li>
              <li>
                <a href="/quotes" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  影墨留香
                </a>
              </li>
              <li>
                <a href="/excel-renamer" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  excel 重命名工具
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full ptablet:w-1/2 ltablet:w-1/4 lg:w-1/4 px-4">
            <h2 className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-sm mb-3">
              分类
            </h2>
            <ul className="font-sans list-none space-y-2 mb-10">
              <li>
                <a href="/categories/5" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  应试
                </a>
              </li>
              <li>
                <a href="/categories/9" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  效率
                </a>
              </li>
              <li>
                <a href="/categories/1" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  生活
                </a>
              </li>
              <li>
                <a href="/categories/11" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  文艺
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full ptablet:w-1/2 ltablet:w-1/4 lg:w-1/4 px-4">
            <h2 className="font-heading font-medium text-muted-800 dark:text-white tracking-widest text-sm mb-3">
              创作
            </h2>
            <ul className="font-sans list-none space-y-2 mb-10">
              <li>
                <a href="/aigc" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  aigc
                </a>
              </li>
              <li>
                <a href="/diaries" className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500">
                  月度随记
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-muted-100 dark:bg-muted-900 w-full  py-4 px-5 flex flex-wrap flex-col sm:flex-row">
        <div className="max-w-6xl mx-auto  xl:max-w-[85%]">
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
    </div>
  );
}
