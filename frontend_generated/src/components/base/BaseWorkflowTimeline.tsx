import React from 'react';
import { Check, Clock, X, AlertCircle } from 'lucide-react';
import { cn } from '../../utils';

export type WorkflowState = 'pending' | 'active' | 'completed' | 'rejected' | 'failed';

export interface WorkflowNode {
  id: string;
  label: string;
  state: WorkflowState;
  date?: string;
  actor?: string;
  description?: string;
}

export interface BaseWorkflowTimelineProps {
  nodes: WorkflowNode[];
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export function BaseWorkflowTimeline({ nodes, className, direction = 'horizontal' }: BaseWorkflowTimelineProps) {
  const getStateIcon = (state: WorkflowState) => {
    switch (state) {
      case 'completed': return <Check className="w-5 h-5" />;
      case 'active': return <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />;
      case 'rejected': return <X className="w-5 h-5" />;
      case 'failed': return <AlertCircle className="w-5 h-5" />;
      case 'pending': return <Clock className="w-4 h-4" />;
    }
  };

  const getStateClasses = (state: WorkflowState) => {
    switch (state) {
      case 'completed': return 'bg-success text-text-inverted border-success';
      case 'active': return 'bg-brand-primary text-text-inverted border-brand-primary ring-4 ring-brand-primary/20';
      case 'rejected': return 'bg-danger text-text-inverted border-danger';
      case 'failed': return 'bg-warning text-text-inverted border-warning';
      case 'pending': return 'bg-bg-surface text-text-tertiary border-border-strong';
    }
  };

  if (direction === 'vertical') {
    return (
      <div className={cn("flow-root", className)}>
        <ul role="list" className="-mb-8">
          {nodes.map((node, nodeIdx) => (
            <li key={node.id}>
              <div className="relative pb-8">
                {nodeIdx !== nodes.length - 1 ? (
                  <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border-base" aria-hidden="true" />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative px-1 pt-1">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2",
                      getStateClasses(node.state)
                    )}>
                      {getStateIcon(node.state)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm">
                      <span className="font-semibold text-text-primary mr-2">{node.label}</span>
                      {node.date && <span className="text-text-tertiary whitespace-nowrap">{node.date}</span>}
                    </div>
                    {(node.description || node.actor) && (
                       <div className="mt-1 text-sm text-text-secondary">
                         {node.actor && <p className="font-medium text-text-primary mb-0.5">{node.actor}</p>}
                         {node.description && <p>{node.description}</p>}
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn("py-4", className)}>
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {nodes.map((node, nodeIdx) => (
            <li key={node.id} className={cn("relative", nodeIdx !== nodes.length - 1 ? "pr-8 sm:pr-20" : "")}>
              <div className="flex items-center">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0",
                  getStateClasses(node.state)
                )}>
                  {getStateIcon(node.state)}
                </div>
                {nodeIdx !== nodes.length - 1 && (
                  <div className={cn(
                    "absolute top-4 left-8 right-0 h-0.5 -mt-px",
                    node.state === 'completed' ? 'bg-success' : 'bg-border-base'
                  )} />
                )}
              </div>
              <div className="absolute top-10 w-32 -mx-12 text-center flex flex-col">
                 <span className="text-sm font-semibold text-text-primary truncate">{node.label}</span>
                 {node.date && <span className="text-xs text-text-tertiary truncate">{node.date}</span>}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
