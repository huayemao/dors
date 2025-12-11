import { getPost, getRecentPosts, getRelatedPosts } from "@/lib/server/posts";
import { cn } from "@/lib/utils";
import huayemao from "@/public/img/huayemao.svg";
import { BackButton } from "./BackButton";
import { ClientOnly } from "../ClientOnly";
import PostHead from "../PostHead";
import SideTabs from "./SideTabs";
import parseMDX from "@/lib/mdx/parseMDX";
import Prose from "../Base/Prose";
import { ActionButton } from "./ActionButton";

type Props = {
  data: Awaited<ReturnType<typeof getPost>>;
  relatedPosts: Awaited<ReturnType<typeof getRelatedPosts>>;
};

export default async function Post({ data: post, relatedPosts: posts }: Props) {
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
