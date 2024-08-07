"use client";
import { BaseCard } from "@shuriken-ui/react";
import { FC, PropsWithChildren } from "react";

export const Panel: FC<
  PropsWithChildren<{
    title: string;
    description: string;
  }>
> = ({ title, description, children }) => {
  return (
    <BaseCard className="max-w-md p-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="nui-heading nui-heading-sm nui-weight-semibold nui-lead-tight text-muted-800 dark:text-white">
            <span>{title}</span>
          </h3>
        </div>
        <div>
          <p className="nui-paragraph nui-paragraph-sm nui-weight-normal nui-lead-normal pb-3">
            <span className="text-muted-400">{description}</span>
          </p>
          {children}
        </div>
      </div>
    </BaseCard>
  );
};
