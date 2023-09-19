import { BackButton } from "@/components/BackButton";
import PostHead from "@/components/PostHead";
import PostTile from "@/components/PostTile";
import { ShareButton } from "@/components/ShareButton";
import { SITE_META } from "@/constants";
import { parseMDX } from "@/lib/parseMDX";
import { getPost, getPostIds, getPosts, getProcessedPosts } from "@/lib/posts";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { markdownExcerpt } from "@/lib/utils";
import huayemao from "@/public/img/huayemao.svg";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { join } from "path";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPostIds();
  const params = posts
    .map((post) => ({
      id: String(post.id),
    }))
    .slice(0, 15);
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

  if (!post) {
    return notFound();
  }

  return {
    title: `${post.title} | ${SITE_META.name}——${SITE_META.description}`,
    openGraph: {
      images: [(post.cover_image as PexelsPhoto).src.small],
    },
  };
}

export default async function page({ params }) {
  if (!params.id) {
    return;
  }

  const post = await getPost(parseInt(params.id as string));

  if (!post) {
    return notFound();
  }

  let posts = await getRecentPosts();

  const tmpDir = join(process.cwd(), "tmp");
  console.log(tmpDir);

  const { content } = await parseMDX(post);

  /* @ts-ignore */
  const url = post.cover_image?.src?.large;
  /* @ts-ignore */
  const blurDataURL = post.cover_image?.dataURLs?.large;

  const excerpt = (await markdownExcerpt(post?.content || "")) + "...";

  return (
    <main className="w-full">
      <div>
        <PostHead
          post={{ ...post, excerpt }}
          avatar={{ alt: "花野猫", src: huayemao }}
          url={url}
          blurDataURL={blurDataURL}
        />
        <section className="w-full py-12 px-4 bg-white dark:bg-muted-900 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto">
            <div className="w-full flex flex-col ltablet:flex-row lg:flex-row gap-y-8">
              <div className="w-full ptablet:w-3/4 ltablet:w-2/3 lg:w-3/4 ptablet:mx-auto">
                <div className="w-full md:px-10 text-xl text-muted-800 leading-normal">
                  <div className="flex justify-between w-full mb-5">
                    <BackButton />
                    <a
                      href={`/admin/posts/${params.id}/edit`}
                      className="mr-4 md:mr-8 font-medium text-base text-muted-400 hover:text-primary-500 transition-colors duration-300"
                    >
                      编辑
                    </a>
                  </div>
                  <article className="dark:prose-invert  prose lg:prose-xl py-6 prose-code:bg-primary-100 prose-code:text-primary-500 prose-code:font-medium">
                    {content}
                  </article>
                </div>
              </div>
              <div className="w-full ptablet:w-3/4 ltablet:w-1/3 lg:w-1/4 ptablet:mx-auto">
                <div className="mt-10">
                  <div>
                    <h3
                      className="font-heading text-muted-800 dark:text-white font-semibold text-xl mb-6
          "
                    >
                      分享文章
                    </h3>

                    <div className="flex gap-4">
                      <ShareButton
                        options={{
                          title: post.title,
                        }}
                      />
                    </div>
                  </div>
                  <hr className="my-10 border-t border-muted-200 dark:border-muted-800" />

                  <h3 className="font-heading text-muted-800 dark:text-white font-semibold text-xl mb-6">
                    最近文章
                  </h3>

                  <RecentPosts posts={posts} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

async function getRecentPosts() {
  let posts = await getProcessedPosts(await getPosts({ perPage: 5 }), {
    imageSize: "small",
  });
  return posts;
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
