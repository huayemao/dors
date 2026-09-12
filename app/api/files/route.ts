import { processFileUpload } from "@/lib/upload";

export const maxDuration = 25;

export const revalidate = 1200;

function isInternalUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== "http:" && url.protocol !== "https:") return true;

    const hostname = url.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return true;
    }

    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);
      if (p1 === 10) return true;
      if (p1 === 172 && p2 >= 16 && p2 <= 31) return true;
      if (p1 === 192 && p2 === 168) return true;
      if (p1 === 169 && p2 === 254) return true;
      if (p1 === 127) return true;
    }

    return false;
  } catch {
    return true;
  }
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const href = searchParams.get("href");
  if (href) {
    const decodedHref = decodeURIComponent(href);
    if (isInternalUrl(decodedHref)) {
      return new Response("Forbidden target URL", { status: 400 });
    }

    try {
      const res = await fetch(decodedHref, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) {
        return new Response("Failed to fetch target URL", { status: res.status });
      }
      return new Response(await res.arrayBuffer(), {
        headers: {
          "Content-Type": res.headers.get("content-type") || "application/octet-stream",
        },
      });
    } catch (error) {
      return new Response(`Fetch error: ${(error as Error).message}`, { status: 500 });
    }
  }

  return new Response("Missing href parameter", {
    status: 400,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const uploadOriginal = formData.get("uploadOriginal") === "true";
    const groupIdStr = formData.get("groupId") as string;
    const groupId = groupIdStr ? parseInt(groupIdStr, 10) : undefined;
    const uploadedFiles = await processFileUpload(files, uploadOriginal, groupId);
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


