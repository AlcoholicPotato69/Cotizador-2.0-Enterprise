<template>
  <main class="min-h-[100dvh] w-full bg-surface relative overflow-hidden flex items-center justify-center p-4 md:p-12">
    <!-- Antigravity Orb Background -->
    <div class="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
      <div class="w-[40rem] h-[40rem] rounded-full bg-primary-500 opacity-20 blur-[120px]"></div>
    </div>

    <!-- The Editorial Split Container -->
    <div class="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      <!-- Lado Izquierdo: Branding Masivo -->
      <div class="flex flex-col space-y-8">
        <img :src="currentLogo" class="h-16 w-auto mix-blend-plus-lighter object-contain self-start" alt="Logo" />
        <div>
          <span class="px-4 py-1.5 rounded-full border border-white/10 text-[10px] tracking-[0.2em] text-white/50 mb-6 block w-max uppercase">
            Enterprise Portal
          </span>
          <h1 class="font-display text-5xl md:text-7xl text-white leading-[1.1] font-bold">
            Cotiza con <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-500">
              Precisión.
            </span>
          </h1>
        </div>
      </div>

      <!-- Lado Derecho: Double-Bezel Login Card -->
      <div class="p-2 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl" style="box-shadow: var(--shadow-ambient)">
        <div class="bg-surface/80 rounded-[calc(2.5rem-0.5rem)] p-8 md:p-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col space-y-6">
          <div class="space-y-2">
            <h2 class="text-2xl font-display text-white">Bienvenido de vuelta</h2>
            <p class="text-white/50 text-sm font-body">Ingresa tus credenciales para acceder al sistema.</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <input v-model="email" type="email" required placeholder="Correo corporativo" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" />
            <input v-model="password" type="password" required placeholder="Contraseña" class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-primary-500 transition-all outline-none" />
            
            <div v-if="errorMessage" class="text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <button type="submit" :disabled="isLoading" class="group w-full flex items-center justify-between bg-primary-500 hover:brightness-110 text-white rounded-full pl-8 pr-2 py-2 mt-4 transition-all duration-700 active:scale-[0.98] disabled:opacity-50">
              <span class="font-medium">{{ isLoading ? 'Ingresando...' : 'Ingresar' }}</span>
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-[1px]">↗</div>
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const currentLogo = ref('/logo.png');

onMounted(() => {
  if (!document.documentElement.getAttribute('data-tenant')) {
    document.documentElement.setAttribute('data-tenant', 'plaza-mayor');
    currentLogo.value = '/logo.png';
  }
});

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err: any) {
    console.error("Login failed:", err);
    if (err.response && err.response.status === 401) {
      errorMessage.value = 'Correo corporativo o contraseña incorrectos.';
    } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
      errorMessage.value = 'Error de conexión con el servidor. Verifica que el backend esté corriendo.';
    } else {
      errorMessage.value = 'Ocurrió un error inesperado al intentar iniciar sesión.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
