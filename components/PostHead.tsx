import { getArticle } from "@/lib/articles";
import { getDateString } from "@/lib/utils";
import Image, { ImageProps } from "next/image";
import Tag from "./Tag";

type Avatar = {
  alt: string;
  src: ImageProps["src"];
};

type Article = Partial<Awaited<ReturnType<typeof getArticle>>> & {
  excerpt?: string;
};

interface Props {
  article: Article;
  url: ImageProps["src"];
  avatar: Avatar;
}

const PostHead = ({ article, url, avatar }: Props) => {
  return (
    <section className="w-full bg-muted-100 dark:bg-muted-900">
      <div className="w-full max-w-7xl mx-auto">
        <div className="py-14 px-4 relative">
          <div className="mt-4 w-full mx-auto grid md:grid-cols-2 gap-2">
            <div className="bg-cover bg-center w-full mb-5 md:mb-0 ptablet:px-5 ltablet:px-4">
              {/* todo: 图片的齿唇其实需要优化 */}
              <Image
                className="lg:w-[512px] lg:h-[373px] mx-auto object-cover rounded-3xl"
                src={url}
                alt="Featured image"
                width={512}
                height={373}
                quality={80}
                placeholder={typeof url === "string" ? undefined : "blur"}
              />
            </div>

            <div className="h-full flex items-center ptablet:px-4 ltablet:px-6">
              <div className="w-full max-w-lg space-x-2">
                {!!article?.tags?.length &&
                  article.tags.map(
                    (t) =>
                      t && (
                        <Tag
                          key={t.id}
                          type="secondary"
                          text={t.name as string}
                        />
                      )
                  )}

                <h1 className="font-heading text-muted-800 dark:text-white font-extrabold text-3xl ltablet:text-4xl lg:text-4xl">
                  {article?.title}
                </h1>
                <p className=" font-sans text-base text-muted-500 dark:text-muted-400 max-w-md my-4">
                  {article?.excerpt}
                </p>
                <div className="flex items-center justify-start w-full relative">
                  <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
                    <Image
                      alt={avatar.alt}
                      src={avatar.src}
                      width={44}
                      height={44}
                    />
                  </div>
                  <div className="pl-2">
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
                      {article?.published_at
                        ? getDateString(article?.published_at)
                        : ""}
                    </p>
                  </div>
                  <div className="block ml-auto font-sans text-sm text-muted-400">
                    <span>— 5 min read</span>
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
