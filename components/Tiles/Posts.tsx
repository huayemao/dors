import FeaturedPosts from "@/components/FeaturedPosts";
import PostTile from "@/components/Tiles/PostTile";
import { type Posts } from "@/lib/server/posts";

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
      <div className="flex flex-col gap-12 py-8">
        {showFeature && <FeaturedPosts posts={[data[0]]} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -m-2">
          {data.map((e) => (
            <PostTile
              rounded={mini}
              /* @ts-ignore */
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
