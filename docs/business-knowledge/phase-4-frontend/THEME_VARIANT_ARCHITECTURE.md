# THEME VARIANT ARCHITECTURE (Fase 4.1)

## Conmutación de Temas (Vue Composition API)
El `ThemeProvider` inyecta CSS Custom Properties dinámicamente según 2 ejes:
1. **Mode**: Light vs Dark.
2. **Tenant**: 
   - Plaza Mayor: `--color-primary` = Rojo Corporativo.
   - Casa de Piedra: `--color-primary` = Café Corporativo.
La UI observará la tienda de Pinia (`useTenant() y useTheme()`) y repintará el sistema de inmediato.