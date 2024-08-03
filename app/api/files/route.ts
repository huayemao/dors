import { SITE_META } from "@/constants";
import prisma from "@/lib/prisma";
import mime from "mime";

export const maxDuration = 25;

export const revalidate = 1200;

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const href = searchParams.get("href");
  if (href) {
    const newHref = href
      .replace("//", "//47.114.89.18:8993/suburl/")
      .replaceAll("https", "http");
    const paths = [decodeURIComponent(href), decodeURIComponent(newHref)];
    const resPromises = paths.map(async (e) => {
      const res = await fetch(e);
      return new Response(await res.arrayBuffer());
    });
    return Promise.race(resPromises);
  }

  return new Response(``, {
    status: 400,
  });
}

export async function POST(request: Request) {
  try {
    const files = (await request.formData()).getAll("files");
    const markdown: string[] = [];
    for (const item of files) {
      // todo: 文件大小等信息
      if (item instanceof File) {
        const file = await prisma.file.create({
          data: {
            name: item.name,
            data: Buffer.from(await item.arrayBuffer()),
            mimeType: mime.getType(item.name) || "unknown",
            size: item.size,
          },
        });
        const url = encodeURI(`${SITE_META.url}/api/files/${file.name}`)
        const markdownText = `![${file.name}](${url})`;
        markdown.push((markdownText));
      }
    }
    return new Response(markdown.join("\n"), {
      status: 200,
    });
  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}


