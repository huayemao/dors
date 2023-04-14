import Link from "next/link";
import Image from "next/image";
import { getArticle } from "@/lib/articles";
import { Prisma } from "@prisma/client";
import Tag from "./Tag";

type Article = Awaited<ReturnType<typeof getArticle>>;

interface Props {
  article: Article;
  url: string;
}

function PostTile({ article, url }: Props) {
  const { id, title, tags, published_at } = article;

  return (
    <div className="relative" key={id}>
      <Link
        href={"/posts/" + id}
        className="block h-full w-full rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 overflow-hidden
         "
      >
        <div className="h-full flex flex-col items-start gap-4 p-6">
          <div className="relative w-full space-y-4">
            <div className="relative space-x-2">
              {tags &&
                tags?.length > 0 &&
                (tags as { id: number; name: string }[]).map(
                  (t) =>
                    t && (
                      <Tag
                        key={t.id}
                        type="primary"
                        text={t.name as string}
                      />
                    )
                )}
              <Image
                className="w-full h-52 object-cover rounded-xl"
                /* @ts-ignore */
                src={url}
                alt="Post image"
                width="348"
                height="208"
              />
            </div>
            <h3
              className="
                 font-heading
                 text-lg
                 font-medium
                 text-muted-800
                 dark:text-white
                 leading-6
               "
            >
              {title}
            </h3>
          </div>
          <div className="w-full mt-auto space-y-6">
            <div className="flex items-center justify-start w-full relative">
              <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
                🐈
              </div>
              <div className="pl-2">
                <h3
                  className="
                     font-heading font-medium
                     text-muted-800
                     dark:text-muted-50
                   "
                >
                  花野猫
                </h3>
                <p className="font-sans text-sm text-muted-400">
                  {
                    published_at?.toLocaleString() /* Need to check if it's not undefined before accessing its method */
                  }
                </p>
              </div>
              <div className="block ml-auto font-sans text-sm text-muted-400">
                <span>— 8 min read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PostTile;
