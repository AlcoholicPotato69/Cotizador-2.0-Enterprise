<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 transition-colors duration-200 p-4">
    <div class="w-full max-w-md bg-surface-0 dark:bg-surface-900 rounded-xl shadow-lg border border-surface-200 dark:border-surface-800 p-8">
      
      <!-- Logo & Branding -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-primary-600 dark:text-primary-400">Cotizador 2.0</h1>
        <p class="text-sm text-surface-500 mt-2">Enterprise Operating System</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full rounded-md border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="usuario@empresa.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full rounded-md border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="••••••••"
          />
        </div>

        <DsButton type="submit" class="w-full mt-6" :loading="isLoading">
          Iniciar Sesión
        </DsButton>
      </form>

      <!-- Security Notice -->
      <div class="mt-8 pt-6 border-t border-surface-200 dark:border-surface-800 text-center">
        <p class="text-xs text-surface-400">
          Acceso Restringido. Todas las sesiones son monitoreadas.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import DsButton from '../components/ui/DsButton.vue';
import { pb } from '../services/pb';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);


async function handleLogin() {
  isLoading.value = true;
  try {
    try {
      await pb.collection('_superusers').authWithPassword(email.value, password.value);
    } catch (_) {
      // If admin fails, try standard user
      await authStore.login(email.value, password.value);
    }
    
    router.push('/playground');
  } catch (err) {
    console.error("Login error", err);
    alert("Credenciales incorrectas");
  } finally {
    isLoading.value = false;
  }
}
</script>
