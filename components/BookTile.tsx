import { SITE_META } from "@/constants";
import { cn, getDateString, isDataURL } from "@/lib/utils";
import config from "next.config.mjs";
import Image from "next/image";
import Link from "next/link";
import { Category } from "./Category";

type Post = {
  id: number;
  title: string | null;
  updated_at: Date | null;
};

interface Props {
  id: number;
  title: string | null;
  coverImage: any;
  posts: Post[];
}

export default function BookTile({ id, title, coverImage, posts }: Props) {
  if (!title) return null;

  const url = coverImage?.src?.large || coverImage?.dataURLs?.small;
  const blurDataURL = coverImage?.dataURLs?.blur;

  return (
    <hgroup className="relative">
      <div className="h-full flex flex-col gap-3 p-6 md:gap-4 w-full rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 overflow-hidden">
        <Link href={"/posts/" + id} className="h-full  items-start ">
          <div className="relative w-full space-y-4">
            <div className="relative">
              {typeof url == "string" &&
              (isDataURL(url) || !url.startsWith("/")) ? (
                <img
                  className="rounded-xl w-[348px] h-[208px] object-cover"
                  src={url}
                  alt={title || "featured image"}
                  width="348"
                  height="208"
                />
              ) : (
                <Image
                  className="rounded-xl w-[348px] h-[208px] object-cover"
                  src={url}
                  placeholder={(blurDataURL && "blur") || undefined}
                  unoptimized={config.output === "export"}
                  blurDataURL={blurDataURL}
                  alt={title || SITE_META.name}
                  quality={url.toString().includes(SITE_META.url) ? 100 : 80}
                  width="348"
                  height="208"
                />
              )}
            </div>
            <h3 className="font-heading text-lg font-medium text-muted-800 dark:text-white leading-6">
              {title}
            </h3>
          </div>
        </Link>
        <ul className="w-full space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="">
              <Link
                href={"/posts/" + post.id}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-muted-600 dark:text-muted-400">
                  {post.title}
                </span>
                <span className="text-xs text-muted-400">
                  {post.updated_at ? getDateString(post.updated_at) : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </hgroup>
  );
}
