import React from 'react';
import { BaseDocumentViewer } from './BaseDocumentViewer';

interface BasePdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  filename: string;
  uploadedBy?: string;
}

export function BasePdfViewer({ isOpen, onClose, pdfUrl, filename, uploadedBy }: BasePdfViewerProps) {
  return (
    <BaseDocumentViewer
      isOpen={isOpen}
      onClose={onClose}
      documentUrl={pdfUrl}
      metadata={{
        name: filename,
        type: 'pdf',
        size: 'PDF',
        uploadedBy: uploadedBy || 'Sistema',
        createdAt: new Date().toISOString()
      }}
    />
  );
}
