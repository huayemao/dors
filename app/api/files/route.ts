import { processFileUpload } from "@/lib/upload";

export const maxDuration = 25;

export const revalidate = 1200;

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const href = searchParams.get("href");
  if (href) {
    // todo: 这里只是想整个代理功能，现在 47.XXX 这台主机已经不用了，就用当前的服务器来代理
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
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const uploadOriginal = formData.get("uploadOriginal") === "true";
    const uploadedFiles = await processFileUpload(files, uploadOriginal);
    const markdown = uploadedFiles.map(file => file.markdown);

    return new Response(markdown.join("\n"), {
      status: 200,
    });
  } catch (error) {
    console.error(error)
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}


