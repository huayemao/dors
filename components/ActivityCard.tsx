import React from "react";
import Prose from "./Base/Prose";

export default function ActivityCard({
  href,
  imgUrl,
  title,
  description,
  actionName = "开始",
  info,
}: {
  href: string;
  title: string;
  imgUrl: string;
  description: string;
  actionName?: string;
  info?: string;
}) {
  return (
    <div className="not-prose relative flex flex-col items-center mx-auto ltablet:flex-row-reverse ltablet:max-w-5xl lg:flex-row-reverse lg:max-w-5xl xl:max-w-6xl">
      {/* Column */}
      <div className="w-full h-64 ptablet:h-[475px] ltablet:w-1/2 ltablet:h-auto lg:w-1/2 lg:h-auto">
        <img
          className="h-full w-full object-cover"
          src={imgUrl}
          alt={title}
          width="576"
          height="576"
        />
      </div>

      {/* Column */}
      <div className="max-w-lg bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 md:max-w-2xl md:shadow-xl md:shadow-muted-400/10 dark:md:shadow-muted-800/10 md:absolute md:top-0 md:mt-48 ltablet:w-3/5 ltablet:left-0 ltablet:mt-20 ltablet:ml-20 lg:w-3/5 lg:left-0 lg:mt-20 lg:ml-20 xl:mt-24 xl:ml-12">
        {/* Content */}
        <div className="flex flex-col p-12 md:px-16">
          <h2 className="font-heading font-bold text-2xl ltablet:text-4xl lg:text-4xl text-muted-800 dark:text-white">
            {title}
          </h2>
          <p className="font-sans text-muted-500 dark:text-muted-400 mt-4">
            <Prose
              className="mx-auto font-LXGW_WenKai"
              content={description}
            />
          </p>
          {/* Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <a
              href={href}
              className="inline-block w-full text-center text-base font-medium text-gray-100 bg-primary-500 py-4 px-10 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/20 md:w-44 rounded-xl tw-accessibility transition-all duration-300"
            >
              {actionName}
            </a>
            <p className="hidden md:block font-sans text-sm text-muted-500 dark:text-muted-400">
              {info}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
