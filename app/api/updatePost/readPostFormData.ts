export function readPostFormData(formData: FormData) {
  const id = (formData.get("id") as string) || undefined;
  const content = (formData.get("content") as string) || undefined;
  const excerpt = formData.get("excerpt") as string | undefined;
  const title = (formData.get("title") as string) || undefined;
  const changePhoto = (formData.get("changePhoto") as string) || undefined;
  const protectedStr = (formData.get("protected") as string) || undefined;
  const category_id = (formData.get("category_id") as string) || undefined;
  const updated_at = (formData.get("updated_at") as string) || undefined;
  const created_at = (formData.get("created_at") as string) || undefined;
  const type = (formData.get("type") as string) || undefined;
  const slug = (formData.get("slug") as string) || undefined;
  const cover_image_url =
    (formData.get("cover_image_url") as string) || undefined;
  const tags = formData.has("tags")
    ? (formData.getAll("tags") as string[])
    : undefined;
  const toc = formData.has("toc")
    ? (formData.getAll("toc") as string[])
    : undefined;

  return {
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
    type,
    slug,
    toc
  };
}
