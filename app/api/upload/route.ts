import { SITE_META } from "@/constants";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const text = (await request.formData()).get("file");
    if (text instanceof File) {
      console.log(text.name);

      const file = await prisma.file.create({
        data: {
          name: text.name,
          data: Buffer.from(await text.arrayBuffer()),
          mimeType: "",
        },
      });
      const markdownText = `![这是一个描述](${SITE_META.url}/api/files/${file.name})`;

      return new Response(markdownText, {
        status: 200,
      });
    }

    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
}
