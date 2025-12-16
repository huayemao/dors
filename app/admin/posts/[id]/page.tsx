import { ClientOnly } from "@/components/ClientOnly";
import PostEditor from "@/components/PostEditor";
import { getPostByIdOrSlug } from "@/lib/server/service/post";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function page(props) {
  const params = await props.params;
  const idOrSlug = params.id;
  if (!idOrSlug) {
    return notFound();
  }

  const post = await getPostByIdOrSlug(idOrSlug);

  if (!post) {
    return notFound();
  }

  return (
    <ClientOnly>
      <PostEditor post={post} basePath={"/admin/posts/" + params.id} />
    </ClientOnly>
  );
}
