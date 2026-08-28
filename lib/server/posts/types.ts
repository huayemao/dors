import { Prisma } from "@/lib/prisma";
import { PaginateOptions } from "@/lib/paginator";

export type PostWithRelations = Prisma.postsGetPayload<{
  include: {
    posts_category_links: {
      include: {
        categories: true;
      };
    };
    tags_posts_links: {
      include: {
        tags: true;
      };
    };
  };
}> & {
  toc?: Prisma.JsonValue;
};

// Prisma 类型扩展
declare global {
  namespace Prisma {
    interface postsCreateInput {
      toc?: { id: number }[];
    }
    interface postsUpdateInput {
      toc?: { id: number }[];
    }
  }
}

export type PostType = "collection" | "normal" | "diary-collection" | "page" | "book";

export type getPostOptions = PaginateOptions & {
  tagId?: number;
  categoryId?: number;
  unCategorized?: boolean;
  protected?: boolean;
  includeHiddenCategories?: boolean;
  type?: PostType;
  search?: string;
};

export interface FindManyArgs {
  take?: number;
  skip?: number;
}

export type PostPayload = {
  type?: string;
  tags?: string[];
  id: string;
  content?: string;
  excerpt?: string;
  title?: string;
  changePhoto?: string;
  isProtected?: boolean;
  updated_at?: string;
  created_at?: string;
  categoryId?: string;
  cover_image_url?: string;
  slug?: string;
  toc?: string[];
  meta?: any;
};

export type CreatePostPayload = Omit<PostPayload, "id">;
