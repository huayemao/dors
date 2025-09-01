import FeaturedPosts from "@/components/FeaturedPosts";
import PostTile from "@/components/Tiles/PostTile";
import { type Posts } from "@/lib/server/posts";
import { cn } from "@/lib/utils";

export function Posts({
  data,
  showFeature = false,
  singlColumn = false,
  mini = false,
}: {
  data: Posts;
  showFeature?: boolean;
  mini?: boolean;
  singlColumn?: boolean
}) {
  return (
    <>
      <div className={cn("flex flex-col gap-12 py-6")}>
        {showFeature && <FeaturedPosts posts={[data[0]]} />}
        <div className={cn("grid grid-cols-1  gap-4 -m-2", {
          "md:grid-cols-2": !singlColumn,
          "gap-2": singlColumn,
        })}>
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
