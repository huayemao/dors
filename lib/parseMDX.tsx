import { languages } from "@/lib/shiki";
import { serialize } from "next-mdx-remote/serialize";
import rehypeRaw from "rehype-raw";
import remarkShikiTwoslash from "remark-shiki-twoslash";
const theme = require("shiki/themes/nord.json");

export async function parseMDX(article: {
  tags:
    | (
        | import("d:/workspace/applications/my-work/dors/prisma/client").tags
        | null
      )[]
    | undefined;
  id?: number | undefined;
  content?: string | null | undefined;
  title?: string | null | undefined;
  created_at?: Date | null | undefined;
  updated_at?: Date | null | undefined;
  published_at?: Date | null | undefined;
  created_by_id?: number | null | undefined;
  updated_by_id?: number | null | undefined;
  cover_image?:
    | import("d:/workspace/applications/my-work/dors/prisma/client").Prisma.JsonValue
    | undefined;
  tags_articles_links?:
    | (import("d:/workspace/applications/my-work/dors/prisma/client").tags_articles_links & {
        tags:
          | import("d:/workspace/applications/my-work/dors/prisma/client").tags
          | null;
      })[]
    | undefined;
}) {
  return await serialize(article?.content || "", {
    mdxOptions: {
      rehypePlugins: [rehypeRaw],
      remarkPlugins: [
        [
          remarkShikiTwoslash,
          {
            theme,
            langs: languages,
          },
        ],
      ],
      format: "mdx",
    },
  });
}
