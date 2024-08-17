import { getPost, updatePost } from "@/lib/posts";
import { revalidateHomePage } from "@/lib/utils/retalidate";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { readPostFormData } from "./readPostFormData";

export async function POST(request: Request) {
  const formData = await request.formData();
  const {
    id,
    content,
    excerpt,
    title,
    changePhoto,
    protectedStr,
    updated_at,
    created_at,
    category_id,
    tags,
    cover_image_url,
  } = readPostFormData(formData);

 

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

  const res = await updatePost(post, {
    tags,
    id: id!,
    content,
    excerpt,
    title,
    changePhoto,
    isProtected: protectedStr
      ? protectedStr === "on"
        ? true
        : false
      : undefined,
    updated_at,
    created_at,
    categoryId: category_id,
    cover_image_url,
  });

  await revalidateHomePage(res.id);


  if(post.protected){
    await revalidatePath("/protected/" + post.id);
    await revalidatePath("/(content)/protected/" + post.id);
  }

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

