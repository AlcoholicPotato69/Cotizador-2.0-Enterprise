import React from 'react';
import { cn } from '../../utils';
import { Check } from 'lucide-react';

interface TimelineStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming' | 'error';
  description?: string;
}

interface WorkflowTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function WorkflowTimeline({ steps, className }: WorkflowTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute top-0 bottom-0 left-[19px] w-px bg-border-strong hidden md:block"></div>
      <ul className="space-y-6">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <li key={step.id} className="relative flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2",
                step.status === 'completed' && "bg-success text-white border-success",
                step.status === 'current' && "bg-bg-surface border-brand-primary text-brand-primary",
                step.status === 'upcoming' && "bg-bg-surface border-border-strong text-text-tertiary",
                step.status === 'error' && "bg-danger text-white border-danger"
              )}>
                {step.status === 'completed' ? <Check className="w-5 h-5" /> : <span className="font-semibold text-sm">{index + 1}</span>}
              </div>
              <div className="flex-1 pt-1 min-w-0">
                <p className={cn(
                  "text-sm font-bold tracking-tight",
                  step.status === 'completed' ? "text-text-primary" : "",
                  step.status === 'current' ? "text-brand-primary" : "",
                  step.status === 'upcoming' ? "text-text-secondary" : "",
                  step.status === 'error' ? "text-danger" : ""
                )}>{step.label}</p>
                {step.description && (
                  <p className="mt-1 text-sm text-text-secondary">{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
