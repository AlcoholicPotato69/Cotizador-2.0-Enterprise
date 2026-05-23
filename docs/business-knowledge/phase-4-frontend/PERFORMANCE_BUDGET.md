# PERFORMANCE BUDGET

## 1. Presupuesto Inicial (Vite / Vue 3)
Dado el contexto Enterprise, debemos evitar interfaces pesadas. Se establecen los siguientes límites duros para la compilación (`npm run build`):

### Límite de Bundle (JS)
- **Main Chunk (Vendor + Vue Core)**: Máximo **150 KB** (Gzipped).
- **Async Chunks (Views)**: Máximo **50 KB** por ruta (Gzipped).

### Límite de Estilos (CSS)
- **Global Tailwind + Unstyled PrimeVue**: Máximo **25 KB** (Gzipped).

## 2. Estrategia de Cumplimiento
1. **Code Splitting**: El `vue-router` ya implementa `() => import('./views/X.vue')`. Cada módulo (Contratos, Cotizaciones) será un chunk independiente.
2. **Tree-Shaking de PrimeVue**: Al usarlo en modo `unstyled`, no se importará el CSS masivo de temas de Prime, ahorrando hasta 100 KB.
3. **Lucide Icons**: Se importarán explícitamente los iconos necesarios (`import { ChevronDown } from 'lucide-vue-next'`), previniendo el peso de la librería completa.