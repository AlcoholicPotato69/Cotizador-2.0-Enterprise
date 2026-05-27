import React from 'react';
import { BaseDocumentViewer } from './BaseDocumentViewer';

interface BaseFileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl?: string; // Might be an image
  filename: string;
  type: 'image' | 'doc' | 'pdf';
}

export function BaseFileViewer({ isOpen, onClose, fileUrl, filename, type }: BaseFileViewerProps) {
  return (
    <BaseDocumentViewer
      isOpen={isOpen}
      onClose={onClose}
      documentUrl={fileUrl}
      metadata={{
        name: filename,
        type,
        size: 'Archivo',
        uploadedBy: 'Sistema',
        createdAt: new Date().toISOString()
      }}
    />
  );
}
