import { getPost, getRecentPosts, getRelatedPosts, getBookByPostId } from "@/lib/server/posts";
import { cn } from "@/lib/utils";
import huayemao from "@/public/img/huayemao.svg";
import { BackButton } from "./BackButton";
import { ClientOnly } from "../ClientOnly";
import PostHead from "../PostHead";
import SideTabs from "./SideTabs";
import parseMDX from "@/lib/mdx/parseMDX";
import Prose from "../Base/Prose";
import { ActionButton } from "./ActionButton";
import Link from "next/link";

type Props = {
  data: Awaited<ReturnType<typeof getPost>>;
  relatedPosts: Awaited<ReturnType<typeof getRelatedPosts>>;
  book?: Awaited<ReturnType<typeof getBookByPostId>>;
};

export default async function Post({ data: post, relatedPosts: posts, book }: Props) {
  if (!post) {
    return null;
  }

  const { content } = await parseMDX(post);

  /* @ts-ignore */
  const url = post.cover_image?.src?.large;
  /* @ts-ignore */
  const blurDataURL = post.cover_image?.dataURLs?.blur;

  const excerpt = post.excerpt;

  return (
    <>
      <PostHead
        post={{ ...post, excerpt }}
        avatar={{ alt: "花野猫", src: huayemao }}
        url={url}
        blurDataURL={blurDataURL}
      />
      <section className="w-full py-12 px-4 bg-white dark:bg-muted-900">
        <div
          className={cn("w-full max-w-6xl mx-auto")}
        >
          <div className="w-full flex flex-col ltablet:flex-row lg:flex-row gap-y-8">
            <div
              className={cn(
                "w-full ptablet:w-3/4 ltablet:w-2/3 lg:w-3/4 ptablet:mx-auto ptablet:print:w-full",

              )}
            >
              <div className="w-full md:px-10 text-xl text-muted-800 leading-normal">
                <div className="flex justify-between w-full mb-5 print:hidden">
                  <BackButton />
                  <ActionButton post={post} posts={posts} />
                </div>
                
                {/* 渲染 book 信息 */}
                {book && (
                  <div className="mb-10 p-4 bg-muted-100 dark:bg-muted-800 rounded-lg border border-muted-200 dark:border-muted-700">
                    <div className="flex items-center gap-2 text-muted-600 dark:text-muted-400 mb-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M14.707 2.293a1 1 0 010 1.414l-10 10a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L4 10.586l8.293-8.293a1 1 0 011.414 0z" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                      <span className="text-sm">本文收录于以下知识库</span>
                    </div>
                    <Link 
                      href={`/posts/${book.id}`} 
                      className="text-lg font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors"
                    >
                      {book.title}
                    </Link>
                    {book.excerpt && (
                      <p className="mt-2 text-sm text-muted-600 dark:text-muted-400">{book.excerpt}</p>
                    )}
                  </div>
                )}
                
                <Prose className="font-LXGW_WenKai" content={content} />
              </div>
            </div>
            <div className="w-full ptablet:w-3/4 ltablet:w-1/3 lg:w-1/4 ptablet:mx-auto print:hidden">
              <ClientOnly>
                <SideTabs post={post} posts={posts}></SideTabs>
              </ClientOnly>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
