<template>
  <div class="flex flex-col gap-6 p-2">
    <div>
      <h1 class="font-display text-3xl font-bold m-0 text-white">Directorio de Accesos</h1>
      <p class="text-white/50 m-0 text-sm font-body mt-1">Administración de usuarios, roles y permisos de la plataforma.</p>
    </div>
    <div class="rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6" style="box-shadow: var(--shadow-ambient)">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-display text-xl font-semibold m-0 text-white">Usuarios Activos</h2>
        <Button label="Nuevo Usuario" icon="pi pi-plus" class="bg-primary-500 hover:bg-primary-400 border-none rounded-full px-6 transition-all" @click="openNew" />
      </div>
      <DataTable :value="users" :loading="loading" responsiveLayout="scroll" class="p-datatable-sm">
        <Column field="id" header="ID"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="role" header="Rol"></Column>
        <Column field="status" header="Estado"></Column>
        <Column header="Acciones" :exportable="false" style="width: 120px">
          <template #body="slotProps">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" text rounded class="text-white/70 hover:text-white" @click="editUser(slotProps.data)" />
              <Button icon="pi pi-trash" text rounded class="text-red-400 hover:text-red-300" @click="deleteUser(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { http } from '../../api/http';

const users = ref([]);
const loading = ref(false);

const loadUsers = async () => {
  loading.value = true;
  try {
    const res = await http.get('/users');
    users.value = res.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});

const openNew = () => { /* open modal */ };
const editUser = (_user: any) => { /* edit logic */ };
const deleteUser = async (user: any) => {
  if (confirm('¿Eliminar este usuario de forma permanente?')) {
    try {
      await http.delete(`/users/${user.id}`);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};
</script>
