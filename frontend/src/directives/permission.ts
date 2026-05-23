import type { App, DirectiveBinding } from 'vue';
import { usePermissionsStore } from '../stores/permissions';

export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const permissionsStore = usePermissionsStore();

    if (!value) {
      console.warn('v-permission necesita un valor');
      return;
    }

    if (!permissionsStore.can(value)) {
      el.parentNode?.removeChild(el); // Oculta el elemento del DOM si no tiene permiso
    }
  },
  updated(_el: HTMLElement, _binding: DirectiveBinding) {
    // Si cambian los permisos dinámicamente, Vue recrea el DOM. 
    // Para simplificar, la directiva remueve el elemento original de raíz.
  }
};

export const canAnyDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const permissionsStore = usePermissionsStore();

    if (!Array.isArray(value)) {
      console.warn('v-can-any necesita un array de permisos');
      return;
    }

    if (!permissionsStore.canAny(value)) {
      el.parentNode?.removeChild(el);
    }
  }
};

export const canAllDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const permissionsStore = usePermissionsStore();

    if (!Array.isArray(value)) {
      console.warn('v-can-all necesita un array de permisos');
      return;
    }

    if (!permissionsStore.canAll(value)) {
      el.parentNode?.removeChild(el);
    }
  }
};

export function registerPermissionDirectives(app: App) {
  app.directive('permission', permissionDirective);
  app.directive('can-any', canAnyDirective);
  app.directive('can-all', canAllDirective);
}
