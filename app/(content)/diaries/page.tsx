import { getPost, getPosts } from "@/lib/server/posts";
import { Note } from "@/app/(projects)/notes/constants";
import { BaseCard } from "@shuriken-ui/react";
import { cn } from "@/lib/utils";
import { getDateStr } from "@/lib/utils";
import { Diary } from "@/components/Diary/Diary";

type PostWithTitle = NonNullable<Awaited<ReturnType<typeof getPost>>> & {
  title: string;
};

export default async function DiariesPage() {
  // 获取所有日记类型的文章
  const posts = await getPosts({ type: "diary-collection" });
  
  // 获取每个帖子的完整内容
  const postsWithContent = await Promise.all(
    posts.map(async (post) => {
      const fullPost = await getPost(post.id);
      return fullPost;
    })
  );

  // 按标题（月份）排序
  const sortedPosts = postsWithContent
    .filter((post): post is PostWithTitle => 
      post !== null && 
      post.title !== null && 
      typeof post.title === 'string'
    )
    .sort((a, b) => {
      const dateA = new Date(a.title.replace(/年|月/g, '-'));
      const dateB = new Date(b.title.replace(/年|月/g, '-'));
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 移动端月份选择器 */}
      <div className="lg:hidden mb-8">
        <BaseCard rounded="md">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">月份</h2>
            <div className="flex flex-wrap gap-2">
              {sortedPosts.map((post) => (
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
        {/* 桌面端月份选择器 */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">日记归档</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                这里记录了每个月的点滴生活，点击月份可以快速跳转到对应的日记集合。
              </p>
              <div className="space-y-3">
                {sortedPosts.map((post) => (
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

        {/* 日记列表 */}
        <div className="lg:col-span-1 max-w-3xl">
          {sortedPosts.map((post) => {
            try {
              const notes = JSON.parse(post.content || "[]") as Note[];
              const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
              return (
                <div key={post.id} id={post.title} className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">{post.title}</h2>
                  <div className="space-y-4 md:space-y-6">
                    {sortedNotes.map((note) => (
                      <Diary key={note.id} data={note} />
                    ))}
                  </div>
                </div>
              );
            } catch (e) {
              console.error("Failed to parse notes:", e);
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
