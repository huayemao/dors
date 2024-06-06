import { getPost } from "@/lib/posts";
import { getDateString } from "@/lib/utils";
import nextConfig from "@/next.config.mjs";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
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
  return (
    <section className="w-full bg-muted-100 dark:bg-muted-900">
      <div className="w-full max-w-6xl mx-auto">
        <div className="py-14 px-4 relative">
          <div className="w-full mx-auto grid md:grid-cols-2 gap-2 ">
            <div className="bg-cover bg-center w-full mb-5 md:mb-0 ptablet:px-5 ltablet:px-4">
              {/* todo: 图片的齿唇其实需要优化 */}
              <Image
                className="h-full w-full max-w-lg mx-auto object-cover rounded-3xl"
                src={url}
                alt={post?.title || "featured image"}
                width={512}
                height={512}
                // quality={80}
                unoptimized={nextConfig.output === "export"}
                blurDataURL={typeof url === "string" ? blurDataURL : undefined}
                placeholder={"blur"}
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
                  <div className="print:invisible bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
                    <Image
                      alt={avatar.alt}
                      src={avatar.src}
                      width={44}
                      height={44}
                    />
                  </div>
                  <div className="pl-2 print:invisible">
                    <h3
                      className="
                      font-heading font-medium 
                      text-muted-800
                      dark:text-muted-50
                    "
                    >
                      {avatar.alt}
                    </h3>
                    <p className="font-sans text-sm text-muted-400">
                      {post?.updated_at
                        ? "更新于 " + getDateString(post?.updated_at)
                        : ""}
                    </p>
                  </div>
                  <div className="block ml-auto font-sans text-sm text-muted-400">
                    <span>— {post?.wordCount} 字</span>
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
