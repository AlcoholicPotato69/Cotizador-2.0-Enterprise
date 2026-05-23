# CFDI AUDIT TRAIL

## Trazabilidad de Ciclo de Vida

Todo registro de la colección `invoices` emitirá logs inmutables hacia `document_audit_log`:
- **[UPLOADED]**: Hash SHA-256 del XML y del PDF, ID del usuario que lo subió y Timestamp.
- **[VIEWED]**: Cada vez que el visor nativo pide la *Presigned URL*, se registra la IP del espectador.
- **[DOWNLOADED]**: Si el usuario tiene el privilegio `invoice.download` y lo ejerce, se audita la salida física.
- **[APPROVED] / [REJECTED]**: Firma digital de la decisión con comentario adjunto.

Cero repudio: No hay interacción fiscal que quede fuera de la cadena de bloques interna.