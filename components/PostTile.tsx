import { SITE_META } from "@/constants";
import { getPost } from "@/lib/posts";
import { cn, getDateString } from "@/lib/utils";
import config from "next.config.mjs";
import Image from "next/image";
import Link from "next/link";
import { Category } from "./Category";
import Tag from "./Tag";
type Post = Awaited<ReturnType<typeof getPost>>;

interface Props {
  post: Post;
  url: string;
  blurDataURL: string;
  type: "default" | "mini";
  rounded?: boolean;
}

function PostTile({
  post,
  url,
  blurDataURL,
  type = "default",
  rounded = false,
}: Props) {
  if (!post) return null;

  const { id, title, tags, updated_at } = post;

  const isFirstCreated =
    post.updated_at?.toString() === post.created_at?.toString();
  const timeLabel = isFirstCreated ? "创建于" : "更新于";

  const updatedOrcreatedAtText = post.created_at
    ? timeLabel + getDateString(post.updated_at as Date)
    : "";

  if (type === "mini") {
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
            <Image
              unoptimized={config.output === "export"}
              className="h-12 w-12 mask mask-blob object-cover"
              src={url}
              alt={post.title || "Post image"}
              width="48"
              height="48"
              blurDataURL={blurDataURL}
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

  const cat = post!.posts_category_links![0].categories!;

  return (
    <div className="relative" key={id}>
      <Link
        href={"/posts/" + id}
        className="block h-full w-full rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 overflow-hidden
         "
      >
        <div className="h-full flex flex-col items-start gap-3 p-6 md:gap-4">
          <div className="relative w-full space-y-3  md:space-y-4">
            <div className="relative">
              <div className="space-x-2 absolute top-3 left-3">
                {tags &&
                  tags?.length > 0 &&
                  (tags as { id: number; name: string }[]).map(
                    (t) =>
                      t && (
                        <Tag
                          className="shadow-xl shadow-primary-500/20"
                          key={t.id}
                          type="primary"
                          text={t.name as string}
                        />
                      )
                  )}
              </div>
              <Image
                className="rounded-xl w-[348px] h-[208px] object-cover"
                src={url}
                placeholder={(blurDataURL && "blur") || undefined}
                unoptimized={config.output === "export"}
                blurDataURL={blurDataURL}
                alt={post.title || SITE_META.name}
                quality={url.toString().includes(SITE_META.url) ? 100 : 80}
                width="348"
                height="208"
              />
            </div>
            <h3
              className="font-heading text-lg font-medium text-muted-800 dark:text-white leading-6"
            >
              {title}
            </h3>
          </div>
          <div
            suppressHydrationWarning
            className="flex items-center justify-start w-full relative"
          >
            <Category
              size="sm"
              href={`/categories/${cat.id}`}
              name={cat.name as string}
              key={cat.id}
            />
            <div className="block ml-auto font-sans text-sm text-muted-400 text-right">
              <div>
                {post?.updated_at
                  ? "更新于 " + getDateString(post?.updated_at)
                  : ""}
              </div>
              <div>— {post?.wordCount} 字</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostTile;
