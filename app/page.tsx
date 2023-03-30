import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import useSWR from "swr";
import { markdownToHtml } from "@/lib/utils";

export default async function Home() {
  let articles = await fetch("http://[2409:8a6c:368:8d01:c215:2c0b:2afd:db37]/api/articles", {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    },
    next: {
      revalidate: 60,
    },
  }).then((res) => res.json());

  articles.data = await Promise.all(
    articles.data.map(async (e) => ({
      ...e,
      attributes: {
        ...e.attributes,
        content: await markdownToHtml(e.attributes.content),
      },
    }))
  );

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
      {articles.data?.map((e) => (
        <div className="col-span-12 md:col-span-5" key={e.attributes.id}>
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
                {e.attributes.title} 👋
              </h2>

              <article
                className="font-sans text-muted-500 prose "
                dangerouslySetInnerHTML={{ __html: e.attributes.content }}
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
