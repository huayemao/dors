import prisma from "@/lib/prisma";

export const revalidate = 60 * 60;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const file = await prisma.file.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    
    return new Response(JSON.stringify(file), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error(error)
    return new Response(`error: ${error.message}`, {
      status: 400,
    });
  }
}
