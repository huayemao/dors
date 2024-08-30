import { ClientOnly } from "@/components/ClientOnly";
import PostEditor from "@/components/PostEditor";

export default async function CreatePostPage({ params }) {

  return (
    <ClientOnly>
      <PostEditor post={null} basePath="/posts/create" />
    </ClientOnly>
  );
}
