import React from "react";
import Prose from "./Base/Prose";

export default function ActivityCard({
  href,
  title,
  description,
  actionName = "开始",
  secondaryButtonText = "Learn More",
  secondaryButtonHref,
  imgUrl,
}: {
  href: string;
  title: string;
  description: string;
  actionName?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  imgUrl: string;
}) {
  return (
    <div className="bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 rounded-2xl overflow-hidden relative lg:flex lg:items-center shadow-2xl shadow-muted-400/10 dark:shadow-muted-800/10">
      {/* Content Section */}
      <div className="w-full p-8 lg:p-16 space-y-4">
        <h2 className="font-heading font-extrabold text-3xl text-muted-800 dark:text-white sm:text-4xl">
          <span className="block">
            {title}
          </span>
        </h2>
        <Prose
          className="text-md text-muted-400"
          content={description}
        />
        <div className="lg:mt-0 lg:flex-shrink-0">
          <div className="flex items-center gap-x-2">
            <a
              href={href}
              className="relative font-sans font-normal inline-flex items-center justify-center leading-5 no-underline min-w-[130px] space-x-1 text-white bg-primary-500 h-12 px-5 py-3 text-base rounded-xl hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/20 tw-accessibility transition-all duration-300"
            >
              {actionName}
            </a>
            {secondaryButtonHref && (
              <a
                href={secondaryButtonHref}
                className="relative font-sans font-medium inline-flex items-center justify-center leading-5 no-underline min-w-[130px] space-x-1 text-slate-700 bg-white border dark:text-white dark:bg-slate-700 dark:border-slate-600 h-12 px-5 py-3 text-base rounded-xl hover:bg-slate-50 tw-accessibility transition-all duration-300"
              >
                {secondaryButtonText}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex items-center gap-6 p-8 lg:p-16 w-full max-w-1/2">
        <img
          src={imgUrl}
          className="rounded-lg"
          alt={title}
          // width="190"
          // height="240"
        />
        {/* <img
          src={imgUrl}
          className="rounded-lg w-1/2"
          alt={title}
          width="190"
          height="240"
        /> */}
        {/* <div className="flex flex-col gap-6">
          <img
            src={topimgUrl}
            className="rounded-lg"
            alt={`${title} - top`}
            width="167"
            height="111"
          />
          <img
            src={bottomimgUrl}
            className="rounded-lg"
            alt={`${title} - bottom`}
            width="167"
            height="111"
          />
        </div> */}
      </div>
    </div>
  );
}
