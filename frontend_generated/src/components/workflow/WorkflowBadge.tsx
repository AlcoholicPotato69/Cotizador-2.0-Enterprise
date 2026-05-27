import { BaseBadge } from '../base/BaseBadge';
import React from 'react';

export type FSMState = 
  | 'DRAFT' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' 
  | 'REJECTED' | 'CANCELLED' | 'ACTIVE' | 'EXPIRED' | 'COMPLETED';

interface WorkflowBadgeProps {
  state: FSMState | string;
  className?: string;
}

export function WorkflowBadge({ state, className }: WorkflowBadgeProps) {
  
  const getProps = () => {
    switch(state) {
      case 'DRAFT': return { variant: 'secondary' as const, label: 'Borrador' };
      case 'PENDING': 
      case 'UNDER_REVIEW': return { variant: 'warning' as const, label: 'En Revisión' };
      case 'APPROVED': 
      case 'ACTIVE': 
      case 'COMPLETED': return { variant: 'success' as const, label: 'Aprobado/Activo' };
      case 'REJECTED': 
      case 'CANCELLED': 
      case 'EXPIRED': return { variant: 'danger' as const, label: 'Rechazado/Expirado' };
      default: return { variant: 'ghost' as const, label: state };
    }
  };

  const { variant, label } = getProps();

  return (
    <BaseBadge variant={variant as any} className={className}>
      {label}
    </BaseBadge>
  );
}
