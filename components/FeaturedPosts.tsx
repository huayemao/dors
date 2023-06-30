import { SITE_META } from "@/constants";
import { getArticles } from "@/lib/articles";
import { ImageSrc } from "@/lib/types/Image";
import { getDateString } from "@/lib/utils";
import photo1 from "@/public/img/about/1.jpg";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar } from "./Avatar";
import Tag from "./Tag";
interface Props {
  articles: Awaited<ReturnType<typeof getArticles>>;
}

interface TileProps {
  href: string;
  imageSrc: ImageSrc;
  title: string;
  excerpt: string;
  published_at?: Date;
  tags?: {
    id: number;
    name: string;
  }[];
}

const Hero = ({
  href,
  imageSrc,
  title,
  excerpt,
  published_at,
  tags,
}: TileProps) => {
  return (
    <Link
      href={href}
      className="h-full grid md:grid-cols-2 rounded-xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 w-full max-w-4xl mx-auto overflow-hidden
"
    >
      <div className="h-full p-5">
        <Image
          className="block h-full w-full object-cover rounded-xl "
          /* @ts-ignore */
          src={imageSrc}
          placeholder="blur"
          alt={title}
          width={365}
          height={356}
          style={{ aspectRatio: "365/356" }}
        />
      </div>
      <div className=" flex flex-col items-start gap-4 px-6 md:px-10 py-8 -mt-8 md:mt-0 md:-ml-5">
        <div className="w-full space-y-4">
          <div className="relative space-x-2">
            {!!tags?.length &&
              tags.map(
                (t) =>
                  t && (
                    <Tag key={t.id} type="secondary" text={t.name as string} />
                  )
              )}
          </div>
          <h3 className=" font-heading text-2xl font-semibold text-muted-800 dark:text-white leading-8">
            {title}
          </h3>
        </div>

        <div className="w-full mt-auto space-y-6">
          <p
            className=" text-base mt-auto text-muted-600 dark:text-muted-400 leading-6
      "
          >
            {excerpt}
          </p>
          <div className="flex items-center justify-start w-full relative">
            <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
              <Avatar />
            </div>
            <div className="pl-2">
              <h3
                className="
            font-heading font-medium 
            text-muted-800
            dark:text-muted-50
          "
              >
                {SITE_META.author.name}
              </h3>
              <p className="font-sans text-sm text-muted-400">
                {published_at ? getDateString(published_at) : ""}
              </p>
            </div>
            <div className="block ml-auto font-sans text-sm text-muted-400">
              <span>— 5 min read</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const SubHero = ({
  href,
  title,
  excerpt,
  published_at,
  tags,
}: Omit<TileProps, "imageSrc">) => {
  return (
    <Link
      href={href}
      className="block h-full rounded-xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 w-full max-w-4xl mx-auto overflow-hidden
    "
    >
      <div className="h-full flex flex-col items-start gap-4 px-6 md:px-10 py-8">
        <div className="w-full space-y-4">
          <div className="relative space-x-2">
            {!!tags?.length &&
              tags.map(
                (t) =>
                  t && (
                    <Tag key={t.id} type="secondary" text={t.name as string} />
                  )
              )}
          </div>
          <h3
            className="font-heading text-2xl font-semibold text-muted-800 dark:text-white leading-8
          "
          >
            {title}
          </h3>
        </div>

        <div className="w-full mt-auto space-y-6">
          <p className="text-base mt-auto text-muted-600 dark:text-muted-400 leading-6">
            {excerpt}
          </p>
          <div className="flex items-center justify-start w-full relative">
            <div className="bg-rose-50 mask flex items-center justify-center mask-blob w-12 h-12 text-[36px]">
              <Avatar />
            </div>
            <div className="pl-2">
              <h3
                className=" font-heading font-medium text-muted-800 dark:text-muted-50
              "
              >
                {SITE_META.author.name}
              </h3>
              <p className="font-sans text-sm text-muted-400">
                {published_at ? getDateString(published_at) : ""}
              </p>
            </div>
            <div className="block ml-auto font-sans text-sm text-muted-400">
              <span>— 3 min read</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeaturedPosts: React.FC<Props> = ({ articles }) => {
  return (
    <div className="flex flex-col ltablet:flex-row lg:flex-row gap-6 -m-3">
      <div className="w-full ltablet:w-2/3 lg:w-2/3">
        <Hero
          title="花野猫何许人也"
          href="/about"
          excerpt="关于花野猫"
          imageSrc={photo1}
        />
      </div>
      <div className="w-full ltablet:w-1/3 lg:w-1/3">
        <SubHero title="花野猫何许人也" href="/about" excerpt="关于花野猫" />
      </div>
    </div>
  );
};

export default FeaturedPosts;
