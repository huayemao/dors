import huayemao from "@/public/img/huayemao.svg";
import huayemaoAlt from "@/public/img/huayemao1.svg";
import Image from "next/image";

export function Avatar({ alt = false }: { alt?: boolean }) {
  return (
    <Image
      alt="花野猫"
      src={alt ? huayemaoAlt : huayemao}
      width={42}
      height={42}
      placeholder="blur"
    />
  );
}
