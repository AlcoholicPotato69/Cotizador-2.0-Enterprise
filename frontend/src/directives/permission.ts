import type { App, DirectiveBinding } from 'vue';
import { hasPermission } from '../app/access-context';

export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;

    if (!value) {
      console.warn('v-permission necesita un valor');
      return;
    }

    if (!hasPermission(value)) {
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

    if (!Array.isArray(value)) {
      console.warn('v-can-any necesita un array de permisos');
      return;
    }

    if (!hasPermission(value)) {
      el.parentNode?.removeChild(el);
    }
  }
};

export const canAllDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;

    if (!Array.isArray(value)) {
      console.warn('v-can-all necesita un array de permisos');
      return;
    }

    const hasAllPermissions = value.every((permission) => hasPermission(permission));
    if (!hasAllPermissions) {
      el.parentNode?.removeChild(el);
    }
  }
};

export function registerPermissionDirectives(app: App) {
  app.directive('permission', permissionDirective);
  app.directive('can-any', canAnyDirective);
  app.directive('can-all', canAllDirective);
}
