"use client";
import React, { ReactElement } from "react";
import { cn } from "../utils";
import Link from "next/link";
import { Link as ClientLink } from "react-router-dom";
import { filterEmptyLines } from "./filterEmptyLines";
import { ClientOnly } from "@/components/ClientOnly";
import { usePathname } from "next/navigation";

export default function NavList(props) {
  const arr = React.Children.toArray(props.children);
  const ul = arr[0] as ReactElement;
  const lis = filterEmptyLines(React.Children.toArray(ul.props.children));
  const pathname = usePathname();

  return (
    <ul className={cn("not-prose", props.className)}>
      {lis.map((li: ReactElement, i) => {
        const a = React.Children.toArray(li.props.children)[0] as ReactElement;
        const title = React.Children.toArray(a.props.children)[0] as string;
        const href = a.props.href;
        const description = a.props.title;
        return (
          <li
            key={i}
            className="nui-list-item hover:bg-muted-100 transition rounded-lg px-4 py-2"
          >
            {pathname.includes("/notes") && href.startsWith("/notes") ? (
              <ClientLink to={href.replace("/notes", "")}>
                <h6 className="nui-heading nui-heading-md nui-weight-medium nui-lead-tight">
                  {title}
                </h6>
                <p className="nui-paragraph nui-paragraph-xs nui-weight-normal nui-lead-normal text-muted-500 dark:text-muted-400">
                  {description || title}
                </p>
              </ClientLink>
            ) : (
              <Link
                prefetch={
                  ["/protected", "/notes"].some((e) => href.startsWith(e))
                    ? false
                    : undefined
                }
                href={href}
              >
                <h6 className="nui-heading nui-heading-md nui-weight-medium nui-lead-tight">
                  {title}
                </h6>
                <p className="nui-paragraph nui-paragraph-xs nui-weight-normal nui-lead-normal text-muted-500 dark:text-muted-400">
                  {description || title}
                </p>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
