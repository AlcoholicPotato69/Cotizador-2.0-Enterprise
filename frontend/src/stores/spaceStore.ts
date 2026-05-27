import { defineStore } from 'pinia';
import { ref } from 'vue';
import { spaceService, type Space } from '../services/spaceService';

export const useSpaceStore = defineStore('space', () => {
    const spaces = ref<Space[]>([]);
    const loading = ref(false);
    const saving = ref(false);

    async function fetchSpaces() {
        loading.value = true;
        try {
            spaces.value = await spaceService.getAll();
        } catch (error) {
            console.error('Error fetching spaces:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    async function createSpace(payload: Partial<Space>) {
        saving.value = true;
        try {
            await spaceService.create(payload);
            await fetchSpaces(); // Refresh
        } catch (error) {
            console.error('Error creating space:', error);
            throw error;
        } finally {
            saving.value = false;
        }
    }

    async function updateSpace(id: string, payload: Partial<Space>) {
        saving.value = true;
        try {
            await spaceService.update(id, payload);
            await fetchSpaces();
        } catch (error) {
            console.error('Error updating space:', error);
            throw error;
        } finally {
            saving.value = false;
        }
    }

    async function removeSpace(id: string) {
        try {
            await spaceService.remove(id);
            await fetchSpaces();
        } catch (error) {
            console.error('Error removing space:', error);
            throw error;
        }
    }

    return {
        spaces,
        loading,
        saving,
        fetchSpaces,
        createSpace,
        updateSpace,
        removeSpace
    };
});
