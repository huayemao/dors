import { BaseCard, BasePlaceload } from "@shuriken-ui/react";

export default function DiariesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile month selector loading */}
      <div className="lg:hidden mb-8">
        <BaseCard rounded="md">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">月份</h2>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-20 h-8">
                  <BasePlaceload className="h-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </BaseCard>
      </div>

      <div className="lg:grid lg:grid-cols-2 gap-12">
        {/* Desktop month selector loading */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">日记归档</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                这里记录了每个月的点滴生活，点击月份可以快速跳转到对应的日记集合。
              </p>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-6">
                    <BasePlaceload className="h-full w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Diary list loading */}
        <div className="lg:col-span-1 max-w-3xl">
          <div className="mb-12">
            <div className="h-8 w-48 mb-6">
              <BasePlaceload className="h-full" />
            </div>
            <div className="space-y-4 md:space-y-6">
              {[1, 2, 3].map((i) => (
                <BaseCard key={i} rounded="md" className="p-4">
                  <div className="h-6 w-32 mb-4">
                    <BasePlaceload className="h-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full">
                      <BasePlaceload className="h-full" />
                    </div>
                    <div className="h-4 w-5/6">
                      <BasePlaceload className="h-full" />
                    </div>
                    <div className="h-4 w-4/6">
                      <BasePlaceload className="h-full" />
                    </div>
                  </div>
                </BaseCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 