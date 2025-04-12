"use client";
import { Menu, MoveLeft } from "lucide-react";
import { Modal } from "../Base/Modal";
import { ActionTabs } from "./SideTabs";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { BaseButtonIcon } from "@shuriken-ui/react";
import withClientOnly from "@/lib/client/utils/withClientOnly";
interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  children?: JSX.Element;
  post;
  posts;
}

export const ActionButton = withClientOnly(
  ({ post, posts, className }: Props) => {
    const isMobile = useMediaQuery("only screen and (max-width : 768px)");
    const [open, setOpen] = useState(false);
    const handleClick = () => {
      setOpen(true);
    };
    return isMobile ? (
      <>
        <BaseButtonIcon size="sm" onClick={handleClick}>
          <Menu className="size-4 fill-current"></Menu>
        </BaseButtonIcon>
        <Modal open={open} onClose={() => setOpen(false)} size="lg">
          <ActionTabs post={post} posts={posts}></ActionTabs>
        </Modal>
      </>
    ) : null;
  }
);
