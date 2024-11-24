import { ClientOnly } from "@/components/ClientOnly";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { useEffect, useState } from "react";

const ErrorComp = ({ error }) => <div>出错了：{error.message}</div>;

function withClientOnly<T extends React.ComponentType<any>>(
  WrappedComponent: T
): React.ComponentType<React.ComponentProps<T>> {
  "use client";
  const WrapperComponent = (props: React.ComponentProps<T>) => {
    return (
      <ClientOnly>
        <ErrorBoundary errorComponent={ErrorComp}>
          <WrappedComponent {...props} />
        </ErrorBoundary>
      </ClientOnly>
    );
  };

  // 确保WrapperComponent的类型是WrappedComponent的类型
  return WrapperComponent as React.ComponentType<React.ComponentProps<T>>;
}

export default withClientOnly;
