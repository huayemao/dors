import { getAllCategories } from "@/lib/categories";
import { getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import { PostForm } from "../../../../../components/PostForm";

export default async function page({ params }) {
  if (!params.id) {
    return;
  }

  const post = await getPost(parseInt(params.id as string));

  const categories = await getAllCategories();

  if (!post) {
    return notFound();
  }

  return (
    <main className="w-full px-8 py-4">
      <PostForm post={post} categories={categories} />
    </main>
  );
}

export type PostFormProps = {
  post: Awaited<ReturnType<typeof getPost>>;
  categories: Awaited<ReturnType<typeof getAllCategories>>;
};


