import { processFileUpload } from "@/lib/upload";

export const maxDuration = 25;

export const revalidate = 1200;

export async function POST(request: Request) {
  try {
    const files = (await request.formData()).getAll("files") as File[];
    const uploadedFiles = await processFileUpload(files);
    const uploadedFileNames = uploadedFiles.map(file => file.name);

    // 重定向到文件管理页面，带上上传的文件name
    const redirectUrl = "/admin/files?uploaded=" + uploadedFileNames.join(",");
  
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl,
      },
    });
  } catch (error) {
    console.error(error)
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}
