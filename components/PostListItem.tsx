import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PostListItem = ({ post }) => {
  return (
    <li className="rounded-xl hover:bg-muted-100 focus-within:bg-muted-100 dark:hover:bg-muted-700/70 dark:focus-within:bg-muted-700/70 group flex items-center gap-3 p-2">
      <div className="nui-avatar nui-avatar-md nui-avatar-rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-500 ms-1 shrink-0">
        <Image
          className="h-12 w-12 mask mask-blob object-cover"
          src={post.url}
          alt={post.title || "Post image"}
          width="48"
          height="48"
          blurDataURL={post.blurDataURL}
        />
      </div>
      <div>
        <h4 className="nui-heading nui-heading-md nui-weight-semibold text-muted-800 dark:text-white">
          <span>{post.title}</span>
        </h4>
        <p className="nui-paragraph nui-paragraph-sm nui-weight-normal nui-lead-normal">
          <span className="text-muted-400">{post.excerpt}</span>
        </p>
      </div>
      <div className="ms-auto flex -translate-x-1 items-center opacity-0 transition-all duration-300 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100">
        <Link aria-current="page" href={"/notes/" + post.id} className="nui-button-icon nui-button-rounded-lg nui-button-medium nui-button-default scale-90">
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </li>
  );
};

export default PostListItem; 