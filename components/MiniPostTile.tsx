import { cn, getDateString } from "@/lib/utils";
import Link from "next/link";

export function MiniPostTile({
  post,
  url,
  blurDataURL,
  type = "default",
  rounded = false,
}) {
  const { id, title, tags, updated_at } = post;

  const isFirstCreated =
    post.updated_at?.toString() === post.created_at?.toString();
  const timeLabel = isFirstCreated ? "创建于" : "更新于";

  const updatedOrcreatedAtText = post.created_at
    ? timeLabel + getDateString(post.updated_at as Date)
    : "";
  return (
    <li
      style={{ listStyle: "none" }}
      className={cn({
        "bg-white p-2 rounded-lg border dark:bg-muted-800 dark:border-muted-700":
          rounded,
      })}
    >
      <Link href={"/posts/" + id} className="flex items-center">
        <div className="relative flex justify-start gap-2 w-full">
          <img
            className="h-12 w-12 mask mask-blob object-cover"
            src={url}
            alt={post.title || "Post image"}
            width="48"
            height="48"
          />
          <div className="truncate">
            <h3
              title={post.title as string}
              className="truncate font-heading font-medium text-muted-800 dark:text-muted-50 leading-snug overflow-hidden text-ellipsis max-w-3/4 line-clamp-2 mb-1"
            >
              {post.title}
            </h3>
            <p className="font-sans text-sm text-muted-400">
              {updatedOrcreatedAtText}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
}
