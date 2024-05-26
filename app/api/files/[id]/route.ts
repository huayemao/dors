import prisma from "@/lib/prisma";

export const revalidate = 60 * 60;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const file = await prisma.file.findFirst({
      where: {
        name: decodeURIComponent(params.id),
      },
    });

    return new Response(file?.data, {
      // headers: {
      //   "Content-Type": "image/jpeg",
      // },
      status: 200,
    });
  } catch (error) {
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}
