import { ClientOnly } from "@/components/ClientOnly";
import PostEditor from "@/components/PostEditor";
import { getPost, getPostBySlug } from "@/lib/server/posts";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function page(props) {
  const params = await props.params;
  const idOrSlug = params.id;
  if (!idOrSlug) {
    return notFound();
  }

  let post;
  if (!Number.isNaN(parseInt(idOrSlug))) {
    post = await getPost(idOrSlug);
  } else {
    post = await getPostBySlug(idOrSlug);
  }

  if (!post) {
    return notFound();
  }

  return (
    <ClientOnly>
      <PostEditor post={post} basePath={"/admin/posts/" + params.id} />
    </ClientOnly>
  );
}
