import { PostForm } from "@/components/PostForm";
import { getAllCategories } from "@/lib/categories";

export default async function CreatePostPage({ params }) {
  const categories = await getAllCategories();

  return (
    <main className="w-full px-8 py-4">
      <PostForm post={null} categories={categories} />
    </main>
  );
}
