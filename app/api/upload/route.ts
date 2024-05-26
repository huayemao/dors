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
      console.log(file);
    }

    console.log(text instanceof File);
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  return new Response("Success!", {
    status: 200,
  });
}
