# DESIGN PLAYGROUND ARCHITECTURE

## Entorno de Desarrollo Aislado
Además del *Showcase*, se implementará un entorno paralelo (ej. Storybook o un Playground interno en Vue) donde los ingenieros de Frontend probarán los botones, inputs y visores de PDFs inyectando diferentes `tenant_id` y variables sin depender del ciclo de vida de la Base de Datos.