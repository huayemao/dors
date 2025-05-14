// e:\workspace\dors\app\api\search\route.ts

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// Types
interface PostResult {
    id: number;
    title: string | null;
    slug: string | null;
}

interface TagResult {
    id: number;
    name: string | null;
}

interface SearchResponse {
    posts: PostResult[];
    tags: TagResult[];
    error?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
    try {
        const { q } = await request.json();

        if (!q || typeof q !== 'string') {
            return Response.json({ error: 'Missing search query' }, { status: 400 });
        }

        const results: SearchResponse = {
            posts: [],
            tags: [],
        };

        // Search Posts
        results.posts = await prisma.posts.findMany({
            where: {
                OR: [
                    { title: { contains: q } },
                    { content: { contains: q } },
                ],
            },
            select: {
                id: true,
                title: true,
                slug: true,
            },
        });

        // Search Tags
        results.tags = await prisma.tags.findMany({
            where: {
                name: {
                    contains: q,
                },
            },
            select: {
                id: true,
                name: true,
            },
        });

        return Response.json(results);
    } catch (error) {
        console.error('Search route error:', error);
        return Response.json(
            { error: '搜索失败，请稍后再试' },
            { status: 500 }
        );
    }
}