# TEMPLATE SNAPSHOT STRATEGY

## 1. Justificación Arquitectónica
El *Template Engine* almacena plantillas HTML para Contratos, Cotizaciones, Anexos, etc. 
Actualmente, el sistema versiona las plantillas (Ej. "Contrato Salones V1", luego pasa a "V2" y la V1 se archiva).
Aunque la base de datos conserva la V1 en estado "archived", basar la inmutabilidad de un contrato en un apuntador relacional (FK) hacia `templates_registry` es riesgoso. Si un DBA elimina accidentalmente los registros archivados, o si la base de datos sufre una purga, el documento histórico queda huérfano y su contenido legal se pierde.

## 2. Inmutabilidad Exigida (Raw HTML Embedding)
Para mitigar esto, no basta con guardar la `template_version`. El documento transaccional (Cotización, Contrato) debe **absorber el HTML crudo** en su propio Snapshot.

## 3. Composición del Template Snapshot
El campo `template_snapshot` (JSON) embebido dentro de la colección transaccional contendrá:

```json
{
  "template_id": "tpl_888999",
  "name": "Contrato Base Salones Físicos",
  "version_aplicada": 3,
  "html_raw": "<html><body><h1>Contrato de Arrendamiento...</h1></body></html>",
  "clausulas_adicionales_generadas": [
    "<p>Cláusula de Penalización por Cancelación (Regla V2)</p>"
  ]
}
```

## 4. Recuperación del Documento
Cuando el UI pida ver el "Contrato #4500", el Frontend no realizará un fetch a `templates_registry`. Leerá directamente `contrato.template_snapshot.html_raw`, aplicará las variables (que están en el `client_snapshot` y `space_snapshot`), y mostrará el resultado. Esto vuelve al contrato 100% independiente y auto-suficiente.
