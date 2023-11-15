import Carousel from "@/components/Carousel";
import prisma from "@/lib/prisma";

async function ImagePage() {
  const res = await prisma.posts.findMany({
    select: { content: true, id: true, title: true },
    where: {
      OR: [
        {
          content: {
            contains: "imghost",
          },
        },
        {
          content: {
            contains: "svgur",
          },
        },
        {
          content: {
            contains: "svgshare",
          },
        },
      ],
    },
  });
  const regex = /(http(s)?:\/\/[^\s]+\.(jpg|jpeg|png|gif))/g;
  const urls = res.flatMap((e) => {
    return (
      e.content?.match(regex)?.map((record) => {
        return {
          ...e,
          content: record,
        };
      }) || []
    );
  });

  return (
    <div>
      <table className="prose">
        {urls.map((item) => (
          <tr key={item.content}>
            <td>{item.title}</td>
            <td>{item.content}</td>
          </tr>
        ))}
      </table>

      <Carousel
        className="w-[800px] h-[480px]"
        items={urls.map((e) => {
          return {
            image: e.content,
            caption: e.title as string,
          };
        })}
      ></Carousel>
    </div>
  );
}

export default ImagePage;
