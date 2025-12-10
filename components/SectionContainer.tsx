import React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  badge: string;
  title: string;
  subtitle: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  badge,
  title,
  subtitle,
}) => {
  return (
    <section className="w-full py-12 px-4 bg-white dark:bg-muted-900 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto py-6">
        <div className="w-full max-w-2xl mx-auto text-center space-y-4 py-6">
          {/*Badge*/}
          <span className="inline-block font-sans text-xs py-1.5 px-3 m-1 rounded-lg bg-primary-100 text-primary-500 dark:bg-primary-500 dark:text-white">
            {badge}
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-muted-800 dark:text-white">
            {title}
          </h2>
          {/*Subtitle*/}
          <p className="font-sans text-lg text-muted-500 dark:text-muted-400 text-balance">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
};
