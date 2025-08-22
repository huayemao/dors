import { ReactNode } from "react";

interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

interface FeatureGridProps {
  features: FeatureItem[];
  className?: string;
}

const FeatureGrid = ({ features, className = "" }: FeatureGridProps) => {
  return (
    <div className={`relative w-full max-w-6xl mx-auto grid ptablet:grid-cols-3 ltablet:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-10 p-6 ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className="relative z-10">
          <div className={`relative inline-flex justify-center items-center w-14 h-14 ${feature.bgColor} ${feature.textColor} mask mask-hexed`}>
            <div className="w-6 h-6 flex items-center justify-center text-3xl">
              {feature.icon}
            </div>
          </div>
          <div className="pt-2">
            <h4 className="font-heading font-semibold text-base text-muted-800 dark:text-white mb-2">
              {feature.title}
            </h4>
            <p className="font-sans text-sm text-muted-500 dark:text-muted-400">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureGrid;
