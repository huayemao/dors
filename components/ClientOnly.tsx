"use client";
/**
 * Hack to work around next.js hydration
 * @see https://github.com/uidotdev/usehooks/issues/218
 */
import { useIsClient } from "@uidotdev/usehooks";
import React, { ReactNode } from "react";

type ClientOnlyProps = {
  children: ReactNode | (() => ReactNode);
};

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const isClient = useIsClient();

  // Render children if on client side, otherwise return null
  if (!isClient) return null;
  
  if (typeof children === "function") {
    return <>{children()}</>;
  }
  
  return <>{children}</>;
};
