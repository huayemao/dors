import { BaseButtonAction, BaseCard } from "@glint-ui/react";
import { SITE_META } from "@/constants";
import { getDiaryPosts, processDiaryEntries } from "@/lib/server/diaries";
import { ProcessedDiary } from "@/components/Diary/ProcessedDiary";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DiariesPage({
  searchParams,
}: {
  searchParams: { postId?: string };
}) {
  // Get all diary posts with caching
  const posts = await getDiaryPosts();

  // Get the active post ID from the URL or default to the latest post
  const activePostId = searchParams.postId
    ? parseInt(searchParams.postId)
    : posts[0]?.id;

  // Find the active post
  const activePost = posts.find(post => post.id === activePostId);

  // If no active post is found, return 404
  if (!activePost) {
    notFound();
  }

  // Process only the active diary entry with optimized MDX parsing
  const processedActivePost = await processDiaryEntries(activePost);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile month selector */}
      <div className="lg:hidden mb-8">
        <BaseCard rounded="md">
          <div className="p-4 relative">
            <h2 className="text-lg font-semibold mb-4">月份</h2>
            <div className="flex flex-wrap gap-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/diaries?postId=${post.id}`}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${post.id === activePostId
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900"
                    }`}
                >
                  {post.title}
                </Link>
              ))}
            </div>
            <BaseButtonAction className="absolute right-4 top-4" color="muted" href={'/notes/'+activePostId}>转到小记</BaseButtonAction>
          </div>
        </BaseCard>
      </div>

      <div className="lg:grid lg:grid-cols-5 gap-12">
        {/* Desktop month selector */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold mb-2">{SITE_META.author.name}的日记归档</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                这里记录了每个月的点滴生活，点击月份可以快速跳转到对应的日记集合。
              </p>
              <div className="space-y-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/diaries?postId=${post.id}`}
                    className={`block text-sm transition-colors pl-2 border-l-2 ${post.id === activePostId
                        ? "text-primary-500 border-primary-500"
                        : "border-transparent hover:text-primary-500 hover:border-primary-500"
                      }`}
                  >
                    {post.title}
                  </Link>
                ))}
              </div>
              <div className="w-full text-right">
                <BaseButtonAction color="primary" href={'/notes/'+activePostId}>转到小记</BaseButtonAction>
              </div>

            </div>
          </div>
        </div>

        {/* Diary list - only show active post */}
        <div className="lg:col-span-3 max-w-3xl">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{processedActivePost.title}</h2>
            <div className="space-y-4 md:space-y-6">
              {processedActivePost.processedNotes.map((note) => (
                <ProcessedDiary key={note.id + note.updatedAt} data={note} postId={processedActivePost.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
