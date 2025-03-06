
import { remark } from "remark";
import excerpt from "strip-markdown";

export async function markdownExcerpt(markdown) {
    const result = await remark().use(excerpt).process(markdown);
    return result.toString().slice(0, 100);
}