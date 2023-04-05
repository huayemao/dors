import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { markdownExcerpt, markdownToHtml } from "@/lib/utils";
import prisma from "@/prisma/client";
import { cache } from "react";
import Link from "next/link";
import { getArticles } from "@/lib/articles";

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration



export default async function Home() {
  const articles = await getArticles();

  const needImageIds = articles.filter((e) => !e.cover_image).map((e) => e.id);

  if (needImageIds.length) {
    const data = await getImages(articles.length);

    for (const i in articles) {
      const a = articles[i];
      if (needImageIds.includes(a.id))
        await prisma.articles.update({
          where: {
            id: a.id,
          },
          data: {
            cover_image: data.photos[i],
          },
        });
    }
  }

  //   useEffect(() => {
  //     (async () => {
  //       const res = await fetch("/v1/users/login", {
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //         body: '{"username":"huayemao","password":"huayemao123"}',
  //         method: "POST",
  //         mode: "cors",
  //         credentials: "include",
  //       }).then((r) => r.json());

  //       localStorage.setItem("access_token", res.data.token.access_token);
  //     })();
  //   });

  return (
    <div className="grid grid-cols-12 gap-6 pt-6 pb-20">
      {articles.map((e) => (
        <div key={e.id} className="col-span-12 md:col-span-6">
          <Link
            href={`/posts/${e.id}`}
            className="
                        block
                        relative
                        w-full
                        p-6
                        md:p-8
                        border border-muted-200
                        dark:border-muted-700
                        bg-white
                        dark:bg-muted-800
                        rounded-lg
                      "
          >
            <span
              className="
                          absolute
                          top-3
                          right-3
                          inline-block
                          font-sans
                          text-xs
                          py-1.5
                          px-3
                          m-1
                          rounded-lg
                          bg-primary-100
                          text-primary-500
                          dark:bg-primary-500/20
                          dark:border-2
                          dark:border-primary-500
                          dark:text-primary-500
                        "
            >
              Full Time
            </span>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div
                className="
                            h-16
                            w-16
                            flex
                            items-center
                            justify-center
                            mask mask-blob
                            bg-muted-100
                            dark:bg-muted-700
                          "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="0.94em"
                  height="1em"
                  viewBox="0 0 256 275"
                  data-icon="logos:airbnb-icon"
                  className="iconify w-6 h-6 iconify--logos"
                >
                  <path
                    fill="#FF385C"
                    d="M252.154 194.867c-1.231-3.456-2.67-6.8-4.039-9.898c-2.107-4.766-4.314-9.541-6.449-14.157l-.169-.366c-19.04-41.23-39.475-83.026-60.738-124.222l-.903-1.75c-2.169-4.206-4.411-8.556-6.712-12.83a83.351 83.351 0 0 0-9.875-15.198a45.98 45.98 0 0 0-15.808-12.133a46.072 46.072 0 0 0-38.935.005a45.976 45.976 0 0 0-15.804 12.137a83.712 83.712 0 0 0-9.87 15.195c-2.32 4.313-4.584 8.703-6.773 12.949l-.838 1.625c-21.264 41.2-41.699 82.994-60.738 124.221l-.278.6c-2.098 4.54-4.267 9.236-6.339 13.922c-1.37 3.096-2.806 6.437-4.039 9.902a60.699 60.699 0 0 0-3.274 29.588a58.455 58.455 0 0 0 11.835 27.646a58.603 58.603 0 0 0 24.027 18.129a59.593 59.593 0 0 0 22.481 4.349c2.42 0 4.839-.142 7.243-.422a73.906 73.906 0 0 0 27.645-9.327c11.152-6.265 22.165-15.446 34.196-28.566c12.031 13.12 23.044 22.301 34.196 28.566a73.89 73.89 0 0 0 27.645 9.327a62.62 62.62 0 0 0 7.244.422a59.586 59.586 0 0 0 22.48-4.349a58.609 58.609 0 0 0 24.027-18.13a58.453 58.453 0 0 0 11.836-27.645a60.752 60.752 0 0 0-3.274-29.59ZM128 209.17c-14.893-18.878-24.45-36.409-27.804-51.106a45.195 45.195 0 0 1-.956-16.85a27.533 27.533 0 0 1 4.432-11.52a30.688 30.688 0 0 1 10.772-8.802a30.762 30.762 0 0 1 27.116.002a30.685 30.685 0 0 1 10.77 8.803a27.548 27.548 0 0 1 4.432 11.522a45.21 45.21 0 0 1-.96 16.856C152.444 172.77 142.89 190.296 128 209.17Zm110.032 12.802a40.874 40.874 0 0 1-8.275 19.33a40.977 40.977 0 0 1-16.8 12.677a42.823 42.823 0 0 1-21.088 2.758a55.703 55.703 0 0 1-21.055-7.191c-9.926-5.577-19.974-14.138-31.28-26.696c17.999-22.195 29.239-42.652 33.4-60.873a62.51 62.51 0 0 0 1.197-23.421a44.91 44.91 0 0 0-7.307-18.776a48.223 48.223 0 0 0-17.075-14.405a48.313 48.313 0 0 0-43.495-.002a48.205 48.205 0 0 0-17.075 14.403a44.91 44.91 0 0 0-7.308 18.771a62.535 62.535 0 0 0 1.19 23.412c4.16 18.229 15.4 38.69 33.406 60.892c-11.307 12.557-21.355 21.118-31.281 26.696a55.7 55.7 0 0 1-21.055 7.19a42.827 42.827 0 0 1-21.089-2.758a40.978 40.978 0 0 1-16.8-12.677a40.872 40.872 0 0 1-8.273-19.33a43.049 43.049 0 0 1 2.437-21.231c.983-2.761 2.132-5.471 3.556-8.69c2.015-4.555 4.153-9.185 6.221-13.661l.278-.602C49.394 136.792 69.716 95.23 90.864 54.255l.842-1.631c2.153-4.178 4.38-8.497 6.626-12.67a67.774 67.774 0 0 1 7.758-12.115a28.411 28.411 0 0 1 9.8-7.594a28.462 28.462 0 0 1 34.015 7.59a67.46 67.46 0 0 1 7.76 12.111c2.225 4.136 4.432 8.416 6.567 12.555l.904 1.756c21.147 40.97 41.469 82.531 60.404 123.535l.17.369c2.104 4.552 4.28 9.257 6.328 13.891c1.426 3.224 2.577 5.936 3.557 8.687a43.081 43.081 0 0 1 2.437 21.233Z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4
                  className="
                              font-heading font-semibold
                              text-lg text-muted-800
                              dark:text-muted-100
                            "
                >
                  {e.title}
                </h4>
                <p className="font-sans text-sm text-muted-400">
                  Airbnb · 3 years exp
                </p>
              </div>
            </div>
            <p className="mt-4 text-muted-600">{e.excerpt}...</p>
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2 text-muted-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  data-icon="lucide:clock-2"
                  className="iconify w-4 h-4 iconify--lucide"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4-2"></path>
                  </g>
                </svg>
                <span className="font-sans text-base">
                  {e.published_at?.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
      <div className="col-span-12 md:col-span-5">
        <div
          className=" block
                        relative
                        w-full
                        p-6
                        md:p-8
                        border border-muted-200
                        dark:border-muted-700
                        bg-white
                        dark:bg-muted-800
                        rounded-lg
                      "
        >
          <span
            className="
                          absolute
                          top-3
                          right-3
                          inline-block
                          font-sans
                          text-xs
                          py-1.5
                          px-3
                          m-1
                          rounded-lg
                          bg-primary-100
                          text-primary-500
                          dark:bg-primary-500/20
                          dark:border-2
                          dark:border-primary-500
                          dark:text-primary-500
                        "
          >
            Full Time
          </span>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div
              className="
                            h-16
                            w-16
                            flex
                            items-center
                            justify-center
                            mask mask-blob
                            bg-muted-100
                            dark:bg-muted-700
                          "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="0.94em"
                height="1em"
                viewBox="0 0 256 275"
                data-icon="logos:airbnb-icon"
                className="iconify w-6 h-6 iconify--logos"
              >
                <path
                  fill="#FF385C"
                  d="M252.154 194.867c-1.231-3.456-2.67-6.8-4.039-9.898c-2.107-4.766-4.314-9.541-6.449-14.157l-.169-.366c-19.04-41.23-39.475-83.026-60.738-124.222l-.903-1.75c-2.169-4.206-4.411-8.556-6.712-12.83a83.351 83.351 0 0 0-9.875-15.198a45.98 45.98 0 0 0-15.808-12.133a46.072 46.072 0 0 0-38.935.005a45.976 45.976 0 0 0-15.804 12.137a83.712 83.712 0 0 0-9.87 15.195c-2.32 4.313-4.584 8.703-6.773 12.949l-.838 1.625c-21.264 41.2-41.699 82.994-60.738 124.221l-.278.6c-2.098 4.54-4.267 9.236-6.339 13.922c-1.37 3.096-2.806 6.437-4.039 9.902a60.699 60.699 0 0 0-3.274 29.588a58.455 58.455 0 0 0 11.835 27.646a58.603 58.603 0 0 0 24.027 18.129a59.593 59.593 0 0 0 22.481 4.349c2.42 0 4.839-.142 7.243-.422a73.906 73.906 0 0 0 27.645-9.327c11.152-6.265 22.165-15.446 34.196-28.566c12.031 13.12 23.044 22.301 34.196 28.566a73.89 73.89 0 0 0 27.645 9.327a62.62 62.62 0 0 0 7.244.422a59.586 59.586 0 0 0 22.48-4.349a58.609 58.609 0 0 0 24.027-18.13a58.453 58.453 0 0 0 11.836-27.645a60.752 60.752 0 0 0-3.274-29.59ZM128 209.17c-14.893-18.878-24.45-36.409-27.804-51.106a45.195 45.195 0 0 1-.956-16.85a27.533 27.533 0 0 1 4.432-11.52a30.688 30.688 0 0 1 10.772-8.802a30.762 30.762 0 0 1 27.116.002a30.685 30.685 0 0 1 10.77 8.803a27.548 27.548 0 0 1 4.432 11.522a45.21 45.21 0 0 1-.96 16.856C152.444 172.77 142.89 190.296 128 209.17Zm110.032 12.802a40.874 40.874 0 0 1-8.275 19.33a40.977 40.977 0 0 1-16.8 12.677a42.823 42.823 0 0 1-21.088 2.758a55.703 55.703 0 0 1-21.055-7.191c-9.926-5.577-19.974-14.138-31.28-26.696c17.999-22.195 29.239-42.652 33.4-60.873a62.51 62.51 0 0 0 1.197-23.421a44.91 44.91 0 0 0-7.307-18.776a48.223 48.223 0 0 0-17.075-14.405a48.313 48.313 0 0 0-43.495-.002a48.205 48.205 0 0 0-17.075 14.403a44.91 44.91 0 0 0-7.308 18.771a62.535 62.535 0 0 0 1.19 23.412c4.16 18.229 15.4 38.69 33.406 60.892c-11.307 12.557-21.355 21.118-31.281 26.696a55.7 55.7 0 0 1-21.055 7.19a42.827 42.827 0 0 1-21.089-2.758a40.978 40.978 0 0 1-16.8-12.677a40.872 40.872 0 0 1-8.273-19.33a43.049 43.049 0 0 1 2.437-21.231c.983-2.761 2.132-5.471 3.556-8.69c2.015-4.555 4.153-9.185 6.221-13.661l.278-.602C49.394 136.792 69.716 95.23 90.864 54.255l.842-1.631c2.153-4.178 4.38-8.497 6.626-12.67a67.774 67.774 0 0 1 7.758-12.115a28.411 28.411 0 0 1 9.8-7.594a28.462 28.462 0 0 1 34.015 7.59a67.46 67.46 0 0 1 7.76 12.111c2.225 4.136 4.432 8.416 6.567 12.555l.904 1.756c21.147 40.97 41.469 82.531 60.404 123.535l.17.369c2.104 4.552 4.28 9.257 6.328 13.891c1.426 3.224 2.577 5.936 3.557 8.687a43.081 43.081 0 0 1 2.437 21.233Z"
                ></path>
              </svg>
            </div>
            <div>
              <h4
                className="
                              font-heading font-semibold
                              text-lg text-muted-800
                              dark:text-muted-100
                            "
              >
                Business analyst
              </h4>
              <p className="font-sans text-sm text-muted-400">
                Airbnb · 3 years exp
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2 text-muted-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                data-icon="lucide:map-pin"
                className="iconify w-4 h-4 iconify--lucide"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </g>
              </svg>
              <span className="font-sans text-base">Los Angeles</span>
            </div>
            <div className="flex items-center gap-2 text-muted-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                data-icon="lucide:clock-2"
                className="iconify w-4 h-4 iconify--lucide"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4-2"></path>
                </g>
              </svg>
              <span className="font-sans text-base">sep 29, 2022</span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="col-span-12 md:col-span-5" key={e.id}>
          <div
            className="
      h-full
      p-10
      bg-white
      dark:bg-muted-1000
      rounded-xl
      border border-muted-200
      dark:border-muted-800
      shadow-xl shadow-muted-400/10
      dark:shadow-muted-800/10
    "
          >
            <div className="h-full flex flex-col justify-between gap-5">
              <h4 className="font-heading font-semibold text-sm uppercase text-muted-400">
                Maras Account
              </h4>

              <h2
                className="
          font-heading font-medium
          text-4xl
          ptablet:text-2xl
          text-muted-800
          dark:text-white
        "
              >
                {e.title} 👋
              </h2>

              <article
                className="font-sans text-muted-500 prose "
                dangerouslySetInnerHTML={{
                  __html: e.content,
                }}
              />
              <a
            href="/payments-receive.html"
            className="
          h-12
          max-w-[220px]
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
            <span>Fund my Account</span>
          </a>
            </div>
          </div>
        </div> */}
    </div>
  );
}
async function getImages(length) {
  return await fetch(
    `https://api.pexels.com/v1/search?query=nature&per_page=${length}&orientation=landscape`,
    {
      headers: {
        Authorization:
          "VIIq3y6ksXWUCdBRN7xROuRE7t6FXcX34DXyiqjnsxOzuIakYACK402j",
      },
    }
  ).then((res) => res.json());
}
