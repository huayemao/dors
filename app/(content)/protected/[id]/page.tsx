import { getPost, getPostIds, getRelatedPosts } from "@/lib/server/posts";
import { notFound, redirect } from "next/navigation";
import { renderPost } from "../../posts/[id]/renderPost";


export default async function page({ params }) {
  if (!params.id) {
    return;
  }

  const id = parseInt(params.id as string);

  if (Number.isNaN(id)) {
    return notFound();
  }

  const post = await getPost(id);

  return await renderPost(post);
}
