import { getPost, getPostBySlug } from "../posts";

export async function getPostByIdOrSlug(idOrSlug: string): Promise<ReturnType<typeof getPost> | null> {
    let post: Awaited<ReturnType<typeof getPost> | null> = null;

    if (!Number.isNaN(parseInt(idOrSlug))) {
        post = await getPost(parseInt(idOrSlug));
    } else {
        post = await getPostBySlug(idOrSlug);
    }
    return post;
}