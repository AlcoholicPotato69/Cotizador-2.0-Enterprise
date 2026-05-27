import { BaseButton } from '../base/BaseButton';
import React, { useState } from 'react';
import { cn } from '../../utils';
import { BaseStepper, StepperStep } from './BaseStepper';

export interface WizardStep extends StepperStep {
  content: React.ReactNode;
}

interface BaseWizardProps {
  steps: WizardStep[];
  onComplete: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function BaseWizard({ steps, onComplete, onCancel, isLoading, className }: BaseWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(s => s - 1);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <BaseStepper 
        steps={steps} 
        currentStepIndex={currentStep} 
        onStepClick={setCurrentStep}
        className="mb-8"
      />
      
      <div className="flex-1 min-h-0 bg-bg-surface border border-border-base rounded-xl p-6 md:p-8 animate-in fade-in duration-300">
        {steps[currentStep].content}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-base">
        <div className="flex items-center gap-3">
          {onCancel && (
            <BaseButton variant="ghost" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </BaseButton>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isFirstStep && (
            <BaseButton variant="secondary" onClick={handlePrev} disabled={isLoading}>
              Regresar
            </BaseButton>
          )}
          <BaseButton variant="primary" onClick={handleNext} isLoading={isLoading}>
            {isLastStep ? 'Finalizar' : 'Continuar'}
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
