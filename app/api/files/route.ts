import { SITE_META } from "@/constants";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const text = (await request.formData()).get("file");
    if (text instanceof File) {
      
      const file = await prisma.file.create({
        data: {
          name: text.name,
          data: Buffer.from(await text.arrayBuffer()),
          mimeType: "",
        },
      });
      const markdownText = `![${file.name}](${SITE_META.url}/api/files/${file.name})`;

      return new Response(markdownText, {
        status: 200,
      });
    }

  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}
