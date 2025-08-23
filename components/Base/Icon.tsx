import React, { lazy, memo, Suspense } from "react";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import withClientOnly from "@/lib/client/utils/withClientOnly";
import { BasePlaceload } from "@shuriken-ui/react";

const fallback = <BasePlaceload className="w-full h-full" />;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}
//  see https://github.com/lucide-icons/lucide/issues/1576
const Icon = memo(({ name, ...props }: IconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name]);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
});

Icon.displayName = "Icon";

export default Icon;
