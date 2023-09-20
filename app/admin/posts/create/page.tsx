import { PostForm } from "@/components/PostForm";
import { getAllCategories } from "@/lib/categories";
import { getTags } from "@/lib/tags";

export default async function CreatePostPage({ params }) {
  const categories = await getAllCategories();
  const tags = await getTags();

  return (
    <main className="w-full px-8 py-4">
      <PostForm post={null} categories={categories} tags={tags}/>
    </main>
  );
}
