import { SITE_META } from "@/constants";
import { getPost } from "@/lib/server/posts";
import { getDateString, isDataURL } from "@/lib/utils";
import nextConfig from "@/next.config.mjs";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { Category } from "./Category";
import Tag from "./Tag";

type Avatar = {
  alt: string;
  src: ImageProps["src"];
};

type Post = Partial<Awaited<ReturnType<typeof getPost>>>;

interface Props {
  post: Post;
  url: ImageProps["src"];
  blurDataURL?: string;
  avatar: Avatar;
}

const PostHead = ({ post, url, avatar, blurDataURL }: Props) => {
  const cat = post!.posts_category_links![0].categories!;
  return (
    <section className="w-full bg-muted-100 dark:bg-muted-900">
      <div className="w-full max-w-6xl mx-auto">
        <div className="py-14 px-4 relative">
          <div className="w-full mx-auto grid md:grid-cols-2 gap-2 ">
            <div className="bg-cover bg-center w-full mb-5 md:mb-0 ptablet:px-5 ltablet:px-4">
              {/* todo: 图片的齿唇其实需要优化 */}
              <Image
                className="max-w-full h-auto lg:max-w-lg mx-auto object-cover md:w-[512px] md:h-[373px]  rounded-3xl"
                src={url}
                alt={post?.title || "featured image"}
                width={512}
                height={373}
                quality={url.toString().includes(SITE_META.url) ? 100 : 80}
                unoptimized={nextConfig.output === "export" || isDataURL(url)}
                blurDataURL={typeof url === "string" ? blurDataURL : undefined}
                placeholder={(blurDataURL && "blur") || undefined}
              />
            </div>

            <div className="h-full flex items-center ptablet:px-4 ltablet:px-6 break-words justify-center">
              <div className="w-full max-w-lg space-x-2">
                {!!post?.tags?.length &&
                  post.tags.map(
                    (t) =>
                      t && (
                        <Link href={"/tags/" + t.id} key={t.id}>
                          <Tag type="secondary" text={t.name as string} />
                        </Link>
                      )
                  )}

                <h1 className="font-heading text-muted-800 dark:text-white font-extrabold text-3xl ltablet:text-4xl lg:text-4xl">
                  {post?.title}
                </h1>
                <p
                  className=" font-sans text-base text-muted-500 dark:text-muted-400 max-w-md my-4"
                  style={{ wordBreak: "break-word" }}
                >
                  {post?.excerpt}
                </p>
                <div className="flex items-center justify-start w-full relative">
                  <div className="print:invisible">
                    <Category
                      href={`/categories/${cat.id}`}
                      name={cat.name as string}
                      key={cat.id}
                      iconName={(cat.meta as { icon: string }).icon}
                    />
                    {/* <p className="font-sans text-sm text-muted-400"></p> */}
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostHead;
