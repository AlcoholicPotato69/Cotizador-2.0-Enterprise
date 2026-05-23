<template>
  <div class="p-6 bg-surface-0 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 space-y-6">
    <div class="border-b pb-4">
      <h2 class="text-xl font-bold font-mono">RBAC Sandbox</h2>
      <p class="text-sm text-surface-500">Validador de reglas lógicas: DENY > ALLOW > ROLE</p>
    </div>
    
    <div class="grid grid-cols-3 gap-6">
      <div class="p-4 border rounded bg-surface-50 dark:bg-surface-950">
        <h3 class="font-bold mb-3 text-red-500 flex items-center gap-2">
          <span>⛔ DENY Rules</span>
          <span class="text-[10px] bg-red-100 text-red-800 px-1 rounded">Prioridad 1</span>
        </h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked> client.delete</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox"> contract.approve</label>
        </div>
      </div>

      <div class="p-4 border rounded bg-surface-50 dark:bg-surface-950">
        <h3 class="font-bold mb-3 text-green-500 flex items-center gap-2">
          <span>✅ ALLOW Rules</span>
          <span class="text-[10px] bg-green-100 text-green-800 px-1 rounded">Prioridad 2</span>
        </h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked> contract.approve</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox"> client.banking.update</label>
        </div>
      </div>

      <div class="p-4 border rounded bg-surface-50 dark:bg-surface-950">
        <h3 class="font-bold mb-3 text-blue-500 flex items-center gap-2">
          <span>👥 ROLE Base</span>
          <span class="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">Prioridad 3</span>
        </h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked disabled> client.read</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked disabled> client.create</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" checked disabled> client.delete</label>
        </div>
      </div>
    </div>

    <div class="p-4 bg-surface-900 text-green-400 font-mono text-sm rounded mt-4">
      <div class="text-surface-500 mb-2">// Resultados Evaluados en Tiempo Real:</div>
      <div>> can('client.read') // true (Heredado de ROLE)</div>
      <div>> can('client.create') // true (Heredado de ROLE)</div>
      <div class="text-red-400">> can('client.delete') // false (DENY sobreescribe ROLE)</div>
      <div>> can('contract.approve') // true (ALLOW otorgado explícitamente)</div>
    </div>
  </div>
</template>