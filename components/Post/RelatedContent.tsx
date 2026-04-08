import { BaseHeading } from "@glint-ui/react";
import { MiniPostTile } from "../Tiles/MiniPostTile";

type Props = {
  posts: any[];
};

export default function RelatedContent({ posts }: Props) {
  return (
    <div>
      <BaseHeading as="h3" className="font-heading text-muted-800 dark:text-white font-semibold text-lg mb-6">
        相关内容
      </BaseHeading>
      <ul className="space-y-6">
        {posts.map((e) => (
          <MiniPostTile
            key={e.id}
            type="mini"
            post={e}
            url={e.cover_image?.src?.small || e.cover_image?.dataURLs?.small}
            blurDataURL={e.blurDataURL}
          />
        ))}
      </ul>
    </div>
  );
}
