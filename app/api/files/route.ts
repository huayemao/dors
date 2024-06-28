import { SITE_META } from "@/constants";
import prisma from "@/lib/prisma";

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
