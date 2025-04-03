import type { getPost } from "../server/posts";

export type Post = NonNullable<Awaited<ReturnType<typeof getPost>>>;
