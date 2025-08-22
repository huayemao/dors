import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepsProps {
  steps: string[];
  className?: string;
}

export default function Steps({ steps, className }: StepsProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-4">
          {/* Step Number with Icon */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-primary-400 dark:from-primary-400 dark:to-primary-500  flex items-center justify-center ">
                <span className="text-sm font-bold text-white">
                  {index + 1}
                </span>
              </div>
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary-300 dark:from-primary-500 to-transparent" />
              )}
            </div>
          </div>
          
          {/* Step Content */}
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-sm text-muted-700 dark:text-muted-300 leading-relaxed">
              {step}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
