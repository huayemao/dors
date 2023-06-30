import { SITE_META } from "@/constants";
import huayemao from "@/public/img/huayemao.svg";
import huayemaoAlt from "@/public/img/huayemao1.svg";
import Image from "next/image";

export function Avatar({ alt = false }: { alt?: boolean }) {
  return (
    <Image
      alt={SITE_META.author.name}
      src={alt ? huayemaoAlt : huayemao}
      width={42}
      height={42}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KICA8ZmlsdGVyIGlkPSJibHVyLWZpbHRlciI+CgogICAgPGZpbHRlciBpZD0iYmx1ci1maWx0ZXIiPjwvZmlsdGVyPgogICAgPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgZmlsbD0icHVycGxlIiBmaWx0ZXI9InVybCgjYmx1ci1maWx0ZXIpIiAvPjwvc3ZnPgo="
    />
  );
}
