import { ClientOnly } from "@/components/ClientOnly";
import React, { useEffect, useState } from "react";

function withClientOnly<T extends React.ComponentType<any>>(
  WrappedComponent: T,
): React.ComponentType<React.ComponentProps<T>> {
  // 定义WrapperComponent组件
  const WrapperComponent = (props: React.ComponentProps<T>) => {
    return (
      <ClientOnly>
        <WrappedComponent {...props} />
      </ClientOnly>
    );
  };

  // 确保WrapperComponent的类型是WrappedComponent的类型
  return WrapperComponent as React.ComponentType<React.ComponentProps<T>>;
}

export default withClientOnly;
