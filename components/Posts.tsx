import FeaturedPosts from "@/components/FeaturedPosts";
import PostTile from "@/components/PostTile";
import { Posts } from "@/lib/posts";

export function Posts({
  data,
  showFeature = false,
  mini,
}: {
  data: Posts;
  showFeature?: boolean;
  mini?: boolean;
}) {
  return (
    <>
      <div className="flex flex-col gap-12 py-12">
        {showFeature && <FeaturedPosts posts={[data[0]]} />}
        <div className="grid ptablet:grid-cols-2 ltablet:grid-cols-3 lg:grid-cols-3 gap-4 -m-3">
          {data.map((e) => (
            <PostTile
              rounded={mini}
              post={e}
              /* @ts-ignore */
              blurDataURL={e.blurDataURL}
              url={e.url}
              key={e.id}
              type={mini ? "mini" : "default"}
            />
          ))}
        </div>
      </div>
    </>
  );
}
