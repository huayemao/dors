"use client";
import { cn } from "@/lib/utils";
import { BaseCard, BaseHeading } from "@glint-ui/react";
import { ComponentProps, FC, PropsWithChildren } from "react";

export const Panel: FC<
  PropsWithChildren<{
    className?: string;
    title: string;
    description?: string;
    as?: ComponentProps<typeof BaseHeading>["as"];
  }>
> = ({ title, description = "", children, className, as }) => {
  return (
    <BaseCard className={cn("max-w-md p-3 md:p-6", className)}>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <BaseHeading
            as={as || "h3"}
            className="nui-heading nui-heading-sm nui-weight-semibold nui-lead-tight text-muted-800 dark:text-white"
          >
            <span>{title}</span>
          </BaseHeading>
        </div>
        <div className="space-y-4">
          {description.trim() && (
            <p className="nui-paragraph nui-paragraph-sm nui-weight-normal nui-lead-normal pb-3">
              <span className="text-muted-400">{description}</span>
            </p>
          )}
          {children}
        </div>
      </div>
    </BaseCard>
  );
};
