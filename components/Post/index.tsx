import { parseMDX } from "@/lib/parseMDX";
import { getPost, getRecentPosts } from "@/lib/posts";
import { markdownExcerpt } from "@/lib/utils";
import huayemao from "@/public/img/huayemao.svg";
import c from "@/styles/post.module.css";
import "katex/dist/katex.min.css";
import dynamic from "next/dynamic";
import { BackButton } from "../BackButton";
import { ClientOnly } from "../ClientOnly";
import PostHead from "../PostHead";
import SideTabs from "./SideTabs";
import CollectionContent from "../Collection/Content";
import { markdownToJson } from "../Collection/markdownToJson";

// todo: 这个抽成 content

const ContentModal = dynamic(() => import("./ContentModal"), {
  ssr: false,
});

const LightBox = dynamic(() => import("../../components/Lightbox"), {
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


  const { content } = await parseMDX(post);

  /* @ts-ignore */
  const url = post.cover_image?.src?.large;
  /* @ts-ignore */
  const blurDataURL = post.cover_image?.dataURLs?.blur;

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
                {post.type == 'collection' && <CollectionContent items={markdownToJson(post.content!)}></CollectionContent>}
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
              <ClientOnly>
                <SideTabs post={post} posts={posts}></SideTabs>
              </ClientOnly>
            </div>
          </div>
        </div>
      </section>
      <ContentModal></ContentModal>
      <LightBox></LightBox>
    </div>
  );
}
