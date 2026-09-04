import { getPost, getPostIds, getRelatedPosts } from "@/lib/server/posts";
import { notFound, redirect } from "next/navigation";
import { renderPost } from "../../posts/[id]/renderPost";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}


export default async function page(props) {
  const params = await props.params;
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
