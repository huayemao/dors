import React from "react";
import { cn } from "@/lib/utils";

interface NumberedListItem {
  number: string;
  title: string;
  description: string;
}

interface NumberedListProps {
  items: NumberedListItem[];
  className?: string;
}

export const NumberedList: React.FC<NumberedListProps> = ({ items, className }) => {
  return (
    <div className={cn("flex flex-col space-y-8", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col space-y-2 md:space-y-0 md:space-x-6 md:flex-row"
        >
          {/* Heading */}
          <div className="rounded-l-full bg-primary-500 md:bg-transparent">
            <div className="flex items-center space-x-2">
              <div className="font-sans px-4 py-2 text-white rounded-full md:py-1 bg-primary-500">
                {item.number}
              </div>
              <h3 className="font-heading text-base font-bold text-white dark:text-white md:mb-4 md:hidden">
                {item.title}
              </h3>
            </div>
          </div>

          <div>
            <h3 className="hidden mb-4 font-heading text-lg font-bold text-muted-800 dark:text-white md:block">
              {item.title}
            </h3>
            <p className="font-sans text-muted-500 dark:text-muted-400">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
