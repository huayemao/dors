import { MetadataRoute } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const baseUrl = 'https://huayemao.run';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    try {
        // 获取所有非私密的文章
        const publicPosts = await prisma.posts.findMany({
            where: {
                protected: false,
                // published_at: {
                //     not: null
                // }
            },
            select: {
                id: true,
                slug: true,
                updated_at: true,
                published_at: true
            }
        });

        // 获取所有分类
        const categories = await prisma.categories.findMany({
            where: {
                // published_at: {
                //     not: null
                // }
            },
            select: {
                id: true,
                name: true,
                updated_at: true,
                published_at: true
            }
        });

        // 获取所有标签
        const tags = await prisma.tags.findMany({
            where: {
                // published_at: {
                //     not: null
                // }
            },
            select: {
                id: true,
                name: true,
                updated_at: true,
                published_at: true
            }
        });


        const now = new Date();

        // 基础页面
        const basePages: MetadataRoute.Sitemap = [
            {
                url: `${baseUrl}/`,
                lastModified: now,
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/about`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/apps`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/books`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/collection`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/posts`,
                lastModified: now,
                changeFrequency: 'daily',
                priority: 0.9,
            },
            {
                url: `${baseUrl}/categories`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/tags`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/notes`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/quotes`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/qas`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/excel-renamer`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/video-splitter`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/dict-parser`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/kunming-living`,
                lastModified: now,
                changeFrequency: 'monthly',
                priority: 0.8,
            },
        ];

        // 文章页面
        const postPages: MetadataRoute.Sitemap = publicPosts.filter(p => !p.slug).map(post => ({
            url: `${baseUrl}/posts/${post.id}`,
            lastModified: post.updated_at || post.published_at || now,
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        })).concat(publicPosts
            .filter(post => post.slug)
            .map(post => ({
                url: `${baseUrl}/${post.slug}`,
                lastModified: post.updated_at || post.published_at || now,
                changeFrequency: 'monthly' as const,
                priority: 0.9,
            })));

        // 分类页面
        const categoryPages: MetadataRoute.Sitemap = categories
            .filter(category => category.name)
            .map(category => ({
                url: `${baseUrl}/categories/${encodeURIComponent(category.id!)}`,
                lastModified: category.updated_at || category.published_at || now,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));

        // 标签页面
        const tagPages: MetadataRoute.Sitemap = tags
            .filter(tag => tag.name)
            .map(tag => ({
                url: `${baseUrl}/tags/${tag.id}`,
                lastModified: tag.updated_at || tag.published_at || now,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));



        return [
            ...basePages,
            ...postPages,
            ...categoryPages,
            ...tagPages,
        ];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        // 如果出错，至少返回基础页面
        return [
            {
                url: `${baseUrl}/`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'daily',
                priority: 1,
            },
        ];
    } finally {
        await prisma.$disconnect();
    }
}
