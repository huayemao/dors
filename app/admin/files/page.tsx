import prisma from "@/lib/prisma";
import { UploadForm } from "../../../components/UploadForm";

export default async function UploadTest() {
  const list = await prisma.file.findMany();

  return (
    <div className="py-4 pt-20 md:px-12">
      {list.map((e) => (
        <div key={e.id}>{e.name}</div>
      ))}

      <UploadForm />
    </div>
  );
}


