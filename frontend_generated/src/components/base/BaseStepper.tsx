import React from 'react';
import { cn } from '../../utils';
import { Check } from 'lucide-react';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

interface BaseStepperProps {
  steps: StepperStep[];
  currentStepIndex: number;
  className?: string;
  onStepClick?: (index: number) => void;
}

export function BaseStepper({ steps, currentStepIndex, className, onStepClick }: BaseStepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <li key={step.id} className="md:flex-1">
              <button
                type="button"
                className={cn(
                  "group flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 text-left transition-colors focus:outline-none",
                  isCompleted ? "border-brand-primary cursor-pointer hover:border-brand-hover" : "",
                  isCurrent ? "border-brand-primary" : "",
                  !isCompleted && !isCurrent ? "border-border-strong cursor-not-allowed" : ""
                )}
                onClick={() => isCompleted && onStepClick?.(index)}
                disabled={!isCompleted && !isCurrent}
              >
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider mb-1",
                  isCompleted ? "text-brand-primary group-hover:text-brand-hover" : "",
                  isCurrent ? "text-brand-primary" : "",
                  !isCompleted && !isCurrent ? "text-text-tertiary" : ""
                )}>
                  {isCompleted ? (
                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Paso {index + 1}</span>
                  ) : (
                    `Paso ${index + 1}`
                  )}
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  (isCompleted || isCurrent) ? "text-text-primary" : "text-text-secondary"
                )}>
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-text-tertiary mt-1 hidden md:block">
                    {step.description}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
