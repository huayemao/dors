import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { markdownToHtml } from "@/lib/utils";
import prisma from "@/prisma/client";
import { cache } from "react";

export const revalidate = 300;
//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

const getArticles = cache(
  async () =>
    await Promise.all(
      (
        await prisma.articles.findMany()
      ).map(async (e) => ({
        ...e,
        content: await markdownToHtml(e.content),
      }))
    )
);

export default async function Home() {
  const articles = await getArticles();

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
      {articles?.map((e) => (
        <div className="col-span-12 md:col-span-5" key={e.id}>
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
              {/* <a
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
          </a> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
