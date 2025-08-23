import Prose from "@/components/Base/Prose";
import Post from "@/components/Post";
import { SITE_META } from "@/constants";
import {
  getPost,
  getPostBySlug,
  getPostIds,
} from "@/lib/server/posts";
import nextConfig from "@/next.config.mjs";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const revalidate = 36000;

export async function generateStaticParams() {
  const posts = await getPostIds({ protected: false, type: "page" });
  const allPostIds = posts.map((post) => ({
    id: String(post.id),
  }));
  const params =
    nextConfig.output === "export" ? allPostIds : allPostIds.slice(0, 10);
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // read route params
  const slug = params.slug;
  const post = await getPostBySlug(slug);

  if (!post || !post.content) {
    return notFound();
  }

  // 写在这里是故意的，这里写了，page 中就需要写，而也能实现跳转
  if (post.protected) {
    return redirect("/protected/" + post.id);
  }
  const abstract = post.excerpt;

  const headerRegex = /^(?!\s)(#{1,6})(.*)/gm;
  const headers =
    post.content!.match(headerRegex)?.map((e) => e.replace(/^(#+\s+)/, "")) ||
    [];

  const keywords = post.tags
    .map((e) => e?.name || "")
    .concat([post.title || ""])
    .concat(SITE_META.author.name)
    .concat(headers)
    .filter((e) => !!e);

  return {
    title: `${post.title} | ${SITE_META.name} ${SITE_META.description}`,
    description: abstract,
    abstract: abstract,
    keywords,
    openGraph: {
      description: abstract || "",
      images: [
        SITE_META.url +
          "/_next/image?url=" +
          encodeURIComponent((post.cover_image as any).src.large) +
          "&w=640&q=60",
        (post.cover_image as any)?.dataURLs?.small,
      ],
    },
  };
}

export default async function page({ params }) {
  if (!params.slug) {
    return;
  }

  const slug = params.slug;

  if (!slug) {
    return notFound();
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }
  if (post.type.includes("collection")) {
    return redirect("/notes/" + params.id);
  }

  return (
    <main className="w-full bg-white container mx-auto min-h-[100vh_-_168px] my-8 p-4 px-6 dark:bg-muted-800">
      {/* @ts-ignore */}
      <Prose content={post.content} className="max-w-full font-LXGW_WenKai" />
      {/* 这里只是为了能在 mdx 中动态使用这个  class ... */}
      <div className="lg:grid-cols-4"></div>
    </main>
  );
}
