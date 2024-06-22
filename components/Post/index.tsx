import { parseMDX } from "@/lib/parseMDX";
import { getPost, getProcessedPosts, getRecentPosts } from "@/lib/posts";
import { markdownExcerpt } from "@/lib/utils";
import huayemao from "@/public/img/huayemao.svg";
import c from "@/styles/post.module.css";
import "katex/dist/katex.min.css";
import { Edit, MessageSquareIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { join } from "path";
import { BackButton } from "../BackButton";
import PostHead from "../PostHead";
import PostTile from "../PostTile";
import { ShareButton } from "../ShareButton";

const TOC = dynamic(() => import("./toc"), {
  ssr: false,
});
const ContentModal = dynamic(() => import("./ContentModal"), {
  ssr: false,
});

type Props = {
  data: Awaited<ReturnType<typeof getPost>>;
  recentPosts: Awaited<ReturnType<typeof getRecentPosts>>;
};

export default async function Post({ data: post, recentPosts: posts }: Props) {
  if (!post) {
    return null;
  }

  const tmpDir = join(process.cwd(), "tmp");
  console.log(tmpDir);

  const { content } = await parseMDX(post);

  /* @ts-ignore */
  const url = post.cover_image?.src?.large;
  /* @ts-ignore */
  const blurDataURL = post.cover_image?.dataURLs?.large;

  const excerpt =
    post.excerpt || (await markdownExcerpt(post?.content || "")) + "...";

  return (
    <div>
      <PostHead
        post={{ ...post, excerpt }}
        avatar={{ alt: "花野猫", src: huayemao }}
        url={url}
        blurDataURL={blurDataURL}
      />
      <section className="w-full py-12 px-4 bg-white dark:bg-muted-900">
        <div className="w-full max-w-6xl mx-auto">
          <div className="w-full flex flex-col ltablet:flex-row lg:flex-row gap-y-8">
            <div className="w-full ptablet:w-3/4 ltablet:w-2/3 lg:w-3/4 ptablet:mx-auto ptablet:print:w-full">
              <div className="w-full md:px-10 text-xl text-muted-800 leading-normal">
                <div className="flex justify-between w-full mb-5 print:hidden">
                  <BackButton />
                </div>
                <article
                  className={
                    c.content +
                    " " +
                    "dark:prose-invert prose lg:prose-xl py-6 overflow-hidden"
                  }
                >
                  {content}
                </article>
              </div>
            </div>
            <div className="w-full ptablet:w-3/4 ltablet:w-1/3 lg:w-1/4 ptablet:mx-auto print:hidden">
              <div className="mt-10">
                <div>
                  <div className="flex gap-4">
                    <ShareButton
                      options={{
                        title: post.title,
                      }}
                    />
                    <Link
                      prefetch={false}
                      href={`/admin/posts/${post.id}`}
                      className="flex-1 inline-flex justify-center items-center py-4 px-5 rounded bg-muted-200 dark:bg-muted-700 hover:bg-muted-100 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 transition-colors duration-300 cursor-pointer tw-accessibility
"
                    >
                      <Edit className="w-4 h-4 " fill="currentColor" />
                    </Link>
                    <Link
                      href={`https://www.yuque.com/huayemao/yuque/dc_${post.id}`}
                      className="flex-1 inline-flex justify-center items-center py-4 px-5 rounded bg-muted-200 dark:bg-muted-700 hover:bg-muted-100 dark:hover:bg-muted-600 text-muted-600 dark:text-muted-400 transition-colors duration-300 cursor-pointer tw-accessibility
"
                    >
                      <MessageSquareIcon className="w-4 h-4 " fill="currentColor" />
                    </Link>
                  </div>
                </div>
                <hr className="my-10 border-t border-muted-200 dark:border-muted-800" />
                <h2 className="font-heading text-muted-800 dark:text-white font-semibold text-xl mb-6">
                  最近文章
                </h2>
                <RecentPosts posts={posts} />
              </div>
              <TOC />
            </div>
          </div>
        </div>
      </section>
      <ContentModal></ContentModal>
    </div>
  );
}

function RecentPosts({
  posts,
}: {
  posts: Awaited<ReturnType<typeof getProcessedPosts>>;
}) {
  return (
    <ul className="space-y-6">
      {posts.map((e) => (
        <PostTile
          key={e.id}
          type="mini"
          post={e}
          url={e.url}
          blurDataURL={e.blurDataURL}
        />
      ))}
    </ul>
  );
}
