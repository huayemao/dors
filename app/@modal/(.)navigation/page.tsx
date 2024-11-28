import Container from "../Container";
import {
  getNavContent,
  parsedNavigationPage,
} from "@/lib/server/navigation";
import Prose from "@/components/Base/Prose";

export default async function Page({ params }) {
  const res = await getNavContent();

  const content = res ? parsedNavigationPage(JSON.parse(res.post!.content!)) : "";
  return (
    <Container title={'导航'}>
      <Prose
        className="masonry md:masonry-sm mb-auto !max-w-full prose-h3:mt-0"
        content={content}
      ></Prose>
    </Container>
  );
}
