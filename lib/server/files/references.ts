import prisma from "@/lib/prisma";

let cachedReferencedFileNames: Set<string> | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 3 * 60 * 1000; // 3 分钟缓存

export async function getReferencedFileNames(forceRefresh = false): Promise<Set<string>> {
  if (cachedReferencedFileNames && !forceRefresh && Date.now() - lastCacheTime < CACHE_TTL) {
    return cachedReferencedFileNames;
  }

  const posts = await prisma.posts.findMany({
    where: {
      OR: [
        { content: { contains: "/api/files/" } },
        { content: { contains: "/files/" } },
      ],
    },
    select: {
      content: true,
      cover_image: true,
    },
  });

  const refNames = new Set<string>();
  const rx = /(?:https?:\/\/[^\s\)\"\'>]+)?\/api\/files\/([^\s\)\"\'>\?#]+)/g;

  for (const p of posts) {
    if (p.content) {
      let m;
      while ((m = rx.exec(p.content)) !== null) {
        refNames.add(decodeURIComponent(m[1]));
        refNames.add(m[1]);
      }
    }
    if (p.cover_image) {
      try {
        const coverStr = JSON.stringify(p.cover_image);
        let m;
        while ((m = rx.exec(coverStr)) !== null) {
          refNames.add(decodeURIComponent(m[1]));
          refNames.add(m[1]);
        }
      } catch {}
    }
  }

  cachedReferencedFileNames = refNames;
  lastCacheTime = Date.now();
  return refNames;
}

export function invalidateReferencedFilesCache() {
  cachedReferencedFileNames = null;
  lastCacheTime = 0;
}
