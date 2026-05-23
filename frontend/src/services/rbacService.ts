

export const rbacService = {
    /**
     * Gets effective permissions for a user.
     * With Zero Trust, the backend recalculates `effective_permissions` on user save.
     * We just read it from the user model.
     */
    getUserPermissions(user: any): string[] {
        if (!user || !user.effective_permissions) {
            return [];
        }
        return user.effective_permissions;
    }
};
