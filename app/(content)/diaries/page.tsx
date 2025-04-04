import { BaseCard } from "@shuriken-ui/react";
import { getDiaryPosts, processDiaryEntries } from "@/lib/server/diaries";
import { ProcessedDiary } from "@/components/Diary/ProcessedDiary";

export default async function DiariesPage() {
  // Get all diary posts with caching
  const posts = await getDiaryPosts();
  
  // Process all diary entries with optimized MDX parsing
  const processedPosts = await processDiaryEntries(posts);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile month selector */}
      <div className="lg:hidden mb-8">
        <BaseCard rounded="md">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">月份</h2>
            <div className="flex flex-wrap gap-2">
              {processedPosts.map((post) => (
                <a
                  key={post.id}
                  href={`#${post.title}`}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  {post.title}
                </a>
              ))}
            </div>
          </div>
        </BaseCard>
      </div>

      <div className="lg:grid lg:grid-cols-2 gap-12">
        {/* Desktop month selector */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">日记归档</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                这里记录了每个月的点滴生活，点击月份可以快速跳转到对应的日记集合。
              </p>
              <div className="space-y-3">
                {processedPosts.map((post) => (
                  <a
                    key={post.id}
                    href={`#${post.title}`}
                    className="block text-sm hover:text-primary-500 transition-colors pl-2 border-l-2 border-transparent hover:border-primary-500"
                  >
                    {post.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Diary list */}
        <div className="lg:col-span-1 max-w-3xl">
          {processedPosts.map((post) => (
            <div key={post.id} id={post.title} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{post.title}</h2>
              <div className="space-y-4 md:space-y-6">
                {post.processedNotes.map((note) => (
                  <ProcessedDiary key={note.id} data={note} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
