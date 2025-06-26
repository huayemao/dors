import Container from "../Container";
import {
  getNavContent,
  parsedNavigationPage,
} from "@/lib/server/navigation";
import GridItems from "@/app/(content)/navigation/GridItems";

export default async function Page({ params }) {
  const res = await getNavContent();

  const content = res ? parsedNavigationPage(JSON.parse(res.post!.content!)) : "";
  return (
    <Container title={'导航'}>
       <GridItems content={content}></GridItems>
    </Container>
  );
}
