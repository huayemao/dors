import { ClientOnly } from "@/components/ClientOnly";
import { BaseButton, BaseCard } from "@glint-ui/react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { useEffect, useState } from "react";

function withClientOnly<T extends React.ComponentType<any>>(
  WrappedComponent: T
): React.ComponentType<React.ComponentProps<T>> {
  "use client";

  const WrapperComponent = (props: React.ComponentProps<T>) => {
    let tried = false;
    const ErrorComp = ({ error, reset }) => {
      return (
        <div>
          <BaseCard color="danger" className="p-6 not-prose my-2">
            出错了：{error.message}
          </BaseCard>
          <BaseButton onClick={reset}>重试</BaseButton>
        </div>
      );
    };

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
