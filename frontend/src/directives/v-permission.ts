import type { Directive, DirectiveBinding } from 'vue';
import type { App } from 'vue';
import { usePermissionsStore } from '../stores/permissionsStore';

export const vPermission: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const permissionsStore = usePermissionsStore();
        const requiredPermission = binding.value;

        if (requiredPermission) {
            const hasPermission = permissionsStore.hasPermission(requiredPermission);
            
            if (!hasPermission) {
                el.parentNode?.removeChild(el);
            }
        }
    },
    updated(el, binding) {
        const permissionsStore = usePermissionsStore();
        const requiredPermission = binding.value;

        if (requiredPermission) {
            const hasPermission = permissionsStore.hasPermission(requiredPermission);
            
            if (!hasPermission) {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                } else {
                    el.style.display = 'none';
                }
            }
        }
    }
};

export function setupPermissionDirective(app: App) {
    app.directive('permission', vPermission);
}
