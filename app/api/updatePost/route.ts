import { getPost, updatePost } from "@/lib/posts";
import { revalidateHomePage } from "@/lib/utils/retalidate";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = (formData.get("id") as string) || undefined;
  const content = (formData.get("content") as string) || undefined;
  const excerpt = (formData.get("excerpt") as string) || undefined;
  const title = (formData.get("title") as string) || undefined;
  const changePhoto = (formData.get("changePhoto") as string) || undefined;
  const category_id = (formData.get("category_id") as string) || undefined;
  const updated_at = (formData.get("updated_at") as string) || undefined;
  const created_at = (formData.get("created_at") as string) || undefined;

  const tags = formData.has("tags")
    ? (formData.getAll("tags") as string[])
    : undefined;

  if (Number.isNaN(parseInt(id as string))) {
    return new NextResponse(
      JSON.stringify({
        success: false,
      }),
      {
        status: 400,
      }
    );
  }

  // todo: 判断 tags 是否已经存在？ 总都得先查询一下 post 的

  const post = await getPost(parseInt(id as string));

  if (!post) {
    return new NextResponse(
      JSON.stringify({
        success: false,
      }),
      {
        status: 404,
      }
    );
  }

  const res = await updatePost(
    post,
    tags,
    id,
    content,
    excerpt,
    title,
    changePhoto,
    updated_at,
    created_at,
    category_id
  );

  await revalidateHomePage(res.id);

  await revalidatePath("/posts/" + post.id);
  await revalidatePath("/(content)/posts/" + post.id);

  if (request.headers.get("accept") === "application/json") {
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: res,
      }),
      {
        status: 200,
      }
    );
  }

  const origin = request.headers.get("Origin");

  const path = new URL(("/posts/" + id) as string, origin || request.url);

  return NextResponse.redirect(path, 303);
}

