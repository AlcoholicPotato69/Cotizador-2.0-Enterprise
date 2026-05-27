import type { Directive, DirectiveBinding } from 'vue';
import type { App } from 'vue';
import { hasPermission } from '../app/access-context';

export const vPermission: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const requiredPermission = binding.value;

        if (requiredPermission) {
            const isAllowed = hasPermission(requiredPermission);
            
            if (!isAllowed) {
                el.parentNode?.removeChild(el);
            }
        }
    },
    updated(el, binding) {
        const requiredPermission = binding.value;

        if (requiredPermission) {
            const isAllowed = hasPermission(requiredPermission);
            
            if (!isAllowed) {
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
