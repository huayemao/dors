import { Footer } from "@/components/Footer";
import Post from "@/components/Post";
import { SITE_META } from "@/constants";
import { getPost, getPostIds, getRelatedPosts } from "@/lib/server/posts";
import nextConfig from "@/next.config.mjs";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const revalidate = 36000;

export async function generateStaticParams() {
  const posts = await getPostIds({ protected: false });
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
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const id = params.id;
  const post = await getPost(parseInt(id as string));

  if (!post || !post.content) {
    return notFound();
  }
  // 写在这里是故意的，这里写了，page 中就需要写，而也能实现跳转
  if (post.protected) {
    return redirect("/protected/" + id);
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
  if (!params.id) {
    return;
  }

  const id = parseInt(params.id as string);

  if (Number.isNaN(id)) {
    return notFound();
  }

  const post = await getPost(id);

  if (!post) {
    return notFound();
  }

  if (post.type.includes("collection")) {
    return redirect("/notes/" + params.id);
  }

  // 获取关联文章
  const posts = await getRelatedPosts(post, { limit: 5 });

  return (
    <>
      <main className="w-full">
        {/* @ts-ignore */}
        <Post data={post} relatedPosts={posts} />
      </main>
      <Footer></Footer>
    </>
  );
}
