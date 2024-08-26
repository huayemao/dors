import { Table } from "@/app/(content)/data-process/Table";
import { Panel } from "@/components/Base/Panel";
import { getPosts } from "@/lib/posts";

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <Panel title="文章列表" className="max-w-full">
      <div className="rounded shadow shadow-primary-100">
        <Table canEdit data={posts.map(e => {
          const { id, title, excerpt, created_at, updated_at, cover_image } = e;
          
          return {
            id,
            cover_image: (cover_image as any)?.src?.small || (cover_image as any)?.dataURLs?.small,
            title, excerpt, created_at: typeof created_at === 'string' ? new Date(created_at) : created_at, updated_at,
          }
        })} />
      </div>
    </Panel>
  );
}
