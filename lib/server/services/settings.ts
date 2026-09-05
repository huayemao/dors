import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { getActivityCardsFromSettingValue } from "@/lib/isomorphic/getActivityCards";
import { getNavResourceItems } from "@/lib/isomorphic/getNavResourceItems";

export interface ActivityCardConfig {
  id: string;
  postId: number;
  title: string;
  description: string;
  actionName: string;
  imgUrl?: string;
  info?: string;
}

export interface ActivityCardData extends ActivityCardConfig {
  href: string;
}

export const getActivityCards = unstable_cache(async (): Promise<ActivityCardData[]> => {
  const setting = await prisma.settings.findUnique({
    where: {
      key: "activity_cards",
    },
  });

  if (!setting?.value) {
    return [];
  }

  const res = getActivityCardsFromSettingValue(setting.value as string);
  return res;
}, ['activity_cards'], {
  tags: ['activity_cards', 'posts']
});

export const getNavContent = unstable_cache(
  async function () {
    const res = (
      await prisma.settings.findFirst({ where: { key: "nav_content_post_id" } })
    )?.value;

    if (!res) {
      return null;
    }

    const postId = Number(res as string[][0]);

    const post = await prisma.posts.findFirst({
      where: {
        id: postId,
      },
    });

    return { postId, post };
  },
  ["settings", "nav_content_post_id"],
  { tags: ["settings_nav_content_post_id", "posts"] }
);

export async function parsedNavigationPage(items: any[]) {
  const allContent = items
    .map(
      (e, i) =>
        `\n<Container tags="${e.tags}" id="${e.id}" i="${i}">\n${e.content}\n</Container>\n`
    )
    .join("\n");

  return allContent;
}

export const getResourceItems = unstable_cache(async function () {
  const resourceItemsRes = (
    await prisma.settings.findFirst({ where: { key: "nav_resource" } })
  )?.value;
  const resourceItems = getNavResourceItems(resourceItemsRes as string[]);
  return resourceItems;
}, ['settings', 'nav_resource'], { tags: ['settings_nav_resource'] });

export interface FooterLinkItem {
  id?: string;
  title: string;
  href: string;
}

export interface FooterColumn {
  id?: string;
  title: string;
  links: FooterLinkItem[];
}

export interface FooterConfig {
  brandDescription?: string;
  columns: FooterColumn[];
}

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandDescription:
    "Dors 是花野猫开发为知识工作者打造的数字花园应用，包含的博客、个人记事本、及其他实用功能。",
  columns: [
    {
      id: "garden",
      title: "花园",
      links: [
        { id: "posts", title: "花坛——博客", href: "/posts" },
        { id: "books", title: "果园——知识库", href: "/books" },
      ],
    },
    {
      id: "workshop",
      title: "工坊——作者开发的实用工具",
      links: [
        { id: "notes", title: "小记", href: "/notes" },
        {
          id: "split-v",
          title: "秒切——一键按秒分割视频",
          href: "https://split-v.utities.online/",
        },
        {
          id: "uni",
          title: "中国重点高校地理位置可视化网站",
          href: "https://uni.utities.online/",
        },
        {
          id: "aparecium",
          title: "中国行政区划数据查询平台",
          href: "https://aparecium.huayemao.run/",
        },
        {
          id: "excel-renamer",
          title: "excel 重命名工具",
          href: "/excel-renamer",
        },
      ],
    },
    {
      id: "misc",
      title: "misc",
      links: [
        {
          id: "rules",
          title: "生活章程",
          href: "/rules-to-save-my-life",
        },
        { id: "aigc", title: "画廊", href: "/aigc" },
        { id: "fun", title: "just have fun!", href: "/just-have-fun" },
      ],
    },
  ],
};

export function parseFooterConfig(raw: any): FooterConfig {
  if (!raw) return DEFAULT_FOOTER_CONFIG;
  let parsed = raw;

  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return DEFAULT_FOOTER_CONFIG;
    }
  }

  // Handle case where raw is an array of strings (e.g. from formData.getAll)
  if (Array.isArray(parsed) && parsed.length === 1 && typeof parsed[0] === "string") {
    try {
      parsed = JSON.parse(parsed[0]);
    } catch {
      // ignore
    }
  }

  if (Array.isArray(parsed)) {
    return {
      brandDescription: DEFAULT_FOOTER_CONFIG.brandDescription,
      columns: parsed,
    };
  }

  if (typeof parsed === "object" && parsed !== null) {
    return {
      brandDescription:
        typeof parsed.brandDescription === "string"
          ? parsed.brandDescription
          : DEFAULT_FOOTER_CONFIG.brandDescription,
      columns: Array.isArray(parsed.columns)
        ? parsed.columns
        : DEFAULT_FOOTER_CONFIG.columns,
    };
  }

  return DEFAULT_FOOTER_CONFIG;
}

export const getFooterConfig = unstable_cache(
  async function (): Promise<FooterConfig> {
    try {
      const setting = await prisma.settings.findFirst({
        where: { key: "footer_config" },
      });
      if (!setting?.value) {
        return DEFAULT_FOOTER_CONFIG;
      }
      return parseFooterConfig(setting.value);
    } catch (e) {
      console.error("Failed to get footer config:", e);
      return DEFAULT_FOOTER_CONFIG;
    }
  },
  ["settings", "footer_config"],
  { tags: ["settings_footer_config"] }
);

