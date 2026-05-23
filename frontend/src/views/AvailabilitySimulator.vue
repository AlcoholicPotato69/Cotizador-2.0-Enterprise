<template>
  <div class="availability-simulator">
    <div class="card bg-slate-50 border-1 border-slate-200">
      <h3 class="m-0 mb-2 border-bottom pb-2"><i class="pi pi-calendar-clock mr-2"></i> Availability Simulator</h3>
      <p class="text-sm text-slate-500 mb-4">Simula la disponibilidad antes de publicar una configuración operativa.</p>
      
      <div class="grid">
        <div class="col-12 lg:col-4">
          <label class="block text-xs font-bold mb-1">Espacio</label>
          <select class="p-2 border-round border-1 border-slate-300 w-full" v-model="form.espacio_id">
            <option value="SP_1">Salón Magno</option>
            <option value="SP_2">Explanada Principal</option>
          </select>
        </div>
        <div class="col-12 lg:col-4">
          <label class="block text-xs font-bold mb-1">Fechas</label>
          <div class="flex gap-2">
            <input type="date" class="p-2 border-round border-1 border-slate-300 w-full" v-model="form.fecha_inicio" />
            <input type="date" class="p-2 border-round border-1 border-slate-300 w-full" v-model="form.fecha_fin" />
          </div>
        </div>
        <div class="col-12 lg:col-2">
          <label class="block text-xs font-bold mb-1">Pax</label>
          <input type="number" class="p-2 border-round border-1 border-slate-300 w-full" v-model="form.pax" />
        </div>
        <div class="col-12 lg:col-2">
          <label class="block text-xs font-bold mb-1">Montaje (hrs)</label>
          <input type="number" class="p-2 border-round border-1 border-slate-300 w-full" v-model="form.montaje" />
        </div>
      </div>
      
      <div class="text-right mt-3 border-top pt-3">
        <Button label="Simular Disponibilidad" icon="pi pi-play" class="p-button-outlined" @click="runSim" />
      </div>

      <div class="mt-4 p-3 border-round" :class="isAvail ? 'bg-green-50 border-1 border-green-200' : 'bg-red-50 border-1 border-red-200'" v-if="result">
        <h4 class="m-0 mb-2" :class="isAvail ? 'text-green-800' : 'text-red-800'">
          {{ isAvail ? 'SIMULACIÓN EXITOSA: Disponible' : 'SIMULACIÓN FALLIDA: Conflicto Detectado' }}
        </h4>
        <ul class="m-0 pl-3 text-sm" :class="isAvail ? 'text-green-700' : 'text-red-700'">
          <li v-for="r in result" :key="r">{{ r }}</li>
        </ul>
        <div class="text-xs mt-2" :class="isAvail ? 'text-green-600' : 'text-red-600'" v-if="isAvail">El motor evaluó correctamente horas de montaje, aforos y políticas.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';

const form = ref({
  espacio_id: 'SP_1',
  fecha_inicio: '2026-10-15',
  fecha_fin: '2026-10-16',
  pax: 500,
  montaje: 12
});

const isAvail = ref(false);
const result = ref<string[] | null>(null);

const runSim = () => {
  // Mock logic validating the Availability Engine rules conceptually for the builder UI
  if (form.value.pax > 1000) {
    isAvail.value = false;
    result.value = ['Excede aforo máximo permitido por Protección Civil (1000 pax).'];
  } else if (form.value.montaje > 24) {
    isAvail.value = false;
    result.value = ['Las horas de montaje empalman con una reserva Tentativa de otro cliente el 2026-10-14.'];
  } else {
    isAvail.value = true;
    result.value = ['El espacio está libre y la capacidad es adecuada.'];
  }
};
</script>

<style scoped>
.availability-simulator { width: 100%; }
.card { background: white; border-radius: 1rem; padding: 1.5rem; }
.grid { display: flex; flex-wrap: wrap; margin: -1rem; }
.col-12 { padding: 1rem; width: 100%; }
@media (min-width: 1024px) { 
  .lg\:col-4 { width: 33.333333%; }
  .lg\:col-2 { width: 16.666667%; }
}
.flex { display: flex; }
.gap-2 { gap: 0.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1.5rem; }
.pt-3 { padding-top: 0.75rem; }
.pb-2 { padding-bottom: 0.5rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.pl-3 { padding-left: 1rem; }
.m-0 { margin: 0; }
.block { display: block; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.font-bold { font-weight: 700; }
.text-right { text-align: right; }
.w-full { width: 100%; }
.border-round { border-radius: 0.5rem; }
.border-1 { border-width: 1px; border-style: solid; }
.border-bottom { border-bottom: 1px solid #e2e8f0; }
.border-top { border-top: 1px solid #e2e8f0; }

.text-slate-500 { color: #64748b; }
.bg-slate-50 { background-color: #f8fafc; }
.border-slate-200 { border-color: #e2e8f0; }
.border-slate-300 { border-color: #cbd5e1; }
.bg-green-50 { background-color: #f0fdf4; }
.bg-red-50 { background-color: #fef2f2; }
.border-green-200 { border-color: #bbf7d0; }
.border-red-200 { border-color: #fecaca; }
.text-green-800 { color: #166534; }
.text-red-800 { color: #991b1b; }
.text-green-700 { color: #15803d; }
.text-red-700 { color: #b91c1c; }
.text-green-600 { color: #16a34a; }
.text-red-600 { color: #dc2626; }
</style>
