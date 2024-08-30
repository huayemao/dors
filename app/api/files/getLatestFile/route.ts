import prisma from "@/lib/prisma";
import { withPagination } from "@/lib/server/withPagination";

export const revalidate = 60 * 60;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const getPaginatedFileList = withPagination(prisma.file.findMany, () => ({
      page: 1, perPage: 5,
    }))

    const list = await getPaginatedFileList({
      select: {
        id: true,
        name: true,
        size: true,
        mimeType: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(list), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}
