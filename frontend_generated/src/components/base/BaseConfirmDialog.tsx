import { BaseButton } from '../base/BaseButton';
import React from 'react';
import { BaseModal } from '../base/BaseModal';

interface BaseConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function BaseConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
  isLoading = false,
}: BaseConfirmDialogProps) {
  const footer = (
    <>
      <BaseButton variant="ghost" onClick={onClose} disabled={isLoading}>
        {cancelText}
      </BaseButton>
      <BaseButton 
        variant={isDestructive ? 'danger' : 'primary'} 
        onClick={onConfirm}
        isLoading={isLoading}
      >
        {confirmText}
      </BaseButton>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={footer}
      size="sm"
    >
      {/* Description is handled by BaseModal props, leaving generic children empty for pure confirm dialogs */}
    </BaseModal>
  );
}
