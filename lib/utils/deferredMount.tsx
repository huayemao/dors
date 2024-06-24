import React, { useEffect, useState } from 'react';

// 定义一个泛型类型，用于约束WrappedComponent的类型
interface WithDeferredMountProps<T> {
  children: React.ComponentType<T>;
  timeout: number;
}

// 定义withDeferredMount函数，使用泛型约束WrappedComponent的类型
function withDeferredMount<T extends React.ComponentType<any>>(
  WrappedComponent: T,
  timeout: number
): React.ComponentType<React.ComponentProps<T>> {
  // 定义WrapperComponent组件
  const WrapperComponent = (props: React.ComponentProps<T>) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setMounted(true);
      }, timeout);
    }, []);

    // 根据mounted状态返回WrappedComponent组件或null
    return mounted ? <WrappedComponent {...props} /> : null;
  };

  // 确保WrapperComponent的类型是WrappedComponent的类型
  return WrapperComponent as React.ComponentType<React.ComponentProps<T>>;
}

export default withDeferredMount;