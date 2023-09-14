import Link from "next/link";

export default async function AdminPage({ params }) {

  return (
    <main className="w-full px-8 py-4">
      <Link href={'/admin/posts/create'}>创建文章</Link>
    </main>
  );
}
