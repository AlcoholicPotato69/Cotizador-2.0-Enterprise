import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { BaseButton } from './BaseButton';
import { Eraser } from 'lucide-react';
import { cn } from '../../utils';

export interface BaseSignaturePadProps {
  onSign: (dataUrl: string) => void;
  className?: string;
  width?: number;
  height?: number;
  label?: string;
}

export function BaseSignaturePad({ onSign, className, width = 500, height = 200, label = "Firme aquí" }: BaseSignaturePadProps) {
  const padRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const clear = () => {
    padRef.current?.clear();
    setIsEmpty(true);
  };

  const save = () => {
    if (!padRef.current?.isEmpty()) {
      onSign(padRef.current.getTrimmedCanvas().toDataURL('image/png'));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-semibold text-text-primary">{label}</label>}
      <div className="border border-border-strong rounded-lg overflow-hidden bg-white w-fit relative">
        <SignatureCanvas
          ref={padRef}
          canvasProps={{
            width,
            height,
            className: 'signature-canvas'
          }}
          penColor="black"
          onEnd={() => setIsEmpty(false)}
        />
        <div className="absolute bottom-2 left-2 text-xs text-text-tertiary pointer-events-none">
          Use su mouse o dedo para firmar
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <BaseButton variant="outline" size="sm" onClick={clear} disabled={isEmpty}>
          <Eraser className="w-4 h-4 mr-2" />
          Borrar
        </BaseButton>
        <BaseButton size="sm" onClick={save} disabled={isEmpty}>
          Aceptar Firma
        </BaseButton>
      </div>
    </div>
  );
}
