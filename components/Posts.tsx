import FeaturedPosts from "@/components/FeaturedPosts";
import PostTile from "@/components/PostTile";
import { Posts } from "@/lib/posts";

export function Posts({
  data,
  showFeature = false,
}: {
  data: Posts;
  showFeature?: boolean;
}) {
  return (
    <>
      <div className="flex flex-col gap-12 py-12">
        {showFeature && <FeaturedPosts posts={[data[0]]} />}
        <div className="grid ptablet:grid-cols-2 ltablet:grid-cols-3 lg:grid-cols-3 gap-6 -m-3">
          {data.map((e) => (
            /* @ts-ignore */
            <PostTile post={e} url={e.url} key={e.id} />
          ))}
        </div>
      </div>
    </>
  );
}
