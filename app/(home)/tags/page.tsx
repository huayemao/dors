import { CatsAndTags } from "@/components/CatsAndTags";
import { getTags } from "@/lib/server/tags";

export default async function TagsPage() {
  return <CatsAndTags />;
}
