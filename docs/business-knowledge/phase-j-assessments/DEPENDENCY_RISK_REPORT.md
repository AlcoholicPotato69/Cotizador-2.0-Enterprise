# DEPENDENCY RISK REPORT (J.7)

- **PocketBase (ALTO)**: Es el núcleo absoluto de backend, DB y Auth. Una deprecación afectaría a todo el proyecto.
- **Vue 3 / PrimeVue (BAJO)**: Ecosistemas maduros y extremadamente estables.
- **Puppeteer/PDFLib (MEDIO)**: Las librerías de generación de PDF suelen ser pesadas y propensas a fallos de memoria si no se limitan los workers.