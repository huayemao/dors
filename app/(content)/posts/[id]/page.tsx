import Post from "@/components/Post";
import { SITE_META } from "@/constants";
import { getPost, getPostIds, getRecentPosts } from "@/lib/posts";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { markdownExcerpt } from "@/lib/utils";
import nextConfig from "@/next.config.mjs";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { join } from "path";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPostIds({ protected: false });
  const allPostIds = posts.map((post) => ({
    id: String(post.id),
  }));
  const params =
    nextConfig.output === "export" ? allPostIds : allPostIds.slice(0, 15);
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

  if (post.protected) {
    return redirect("/protected/" + id);
  }

  const abstract =
    post.excerpt || (await markdownExcerpt(post.content)) + "...";

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
    title: `${post.title} | ${SITE_META.name}——${SITE_META.description}`,
    description: abstract,
    abstract: abstract,
    keywords,

    openGraph: {
      description: abstract,
      images: [(post.cover_image as PexelsPhoto).src.small],
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

  let posts = await getRecentPosts({ protected: false });

  const tmpDir = join(process.cwd(), "tmp");
  console.log(tmpDir);

  return (
    <main className="w-full">
      {/* @ts-ignore */}
      <Post data={post} recentPosts={posts} />
    </main>
  );
}
