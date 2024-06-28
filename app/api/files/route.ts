import { SITE_META } from "@/constants";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const href = searchParams.get("href");
  if (href) {
    try {
      const res = await fetch(decodeURIComponent(href));
      return new Response(await res.arrayBuffer());
    } catch (error) {
      if (error.cause?.code == "UND_ERR_CONNECT_TIMEOUT") {
        const newHref = href
          .replace("//", "//47.114.89.18:8993/suburl/")
          .replaceAll("https", "http");
        const res = await fetch(decodeURIComponent(newHref));
        return new Response(await res.arrayBuffer());
      }
    }
  }

  return new Response(``, {
    status: 400,
  });
}

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
