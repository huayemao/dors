import type { getPost } from "../posts";

export type Post = NonNullable<Awaited<ReturnType<typeof getPost>>>;
