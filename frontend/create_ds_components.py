import os
import re

ui_dir = r"h:\Cotizador-2.0-Enterprise\frontend\src\components\ui"

components = {
    "DsColumn.vue": """<template>
  <Column v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </Column>
</template>
<script setup lang="ts">
import Column from 'primevue/column';
defineOptions({ inheritAttrs: false });
</script>""",

    "DsMultiSelect.vue": """<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <MultiSelect 
      v-bind="$attrs"
      v-model="model" 
      :options="options" 
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'rounded-md border bg-surface-50 dark:bg-surface-950 text-sm focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-500' : 'border-surface-300 dark:border-surface-700 focus:ring-primary-500'
      ]"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
defineOptions({ inheritAttrs: false });
defineProps({ options: Array, optionLabel: String, optionValue: String, label: String, placeholder: String, error: String, disabled: Boolean });
const model = defineModel<any>();
</script>""",

    "DsTag.vue": """<template>
  <Tag v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </Tag>
</template>
<script setup lang="ts">
import Tag from 'primevue/tag';
defineOptions({ inheritAttrs: false });
</script>""",

    "DsInputNumber.vue": """<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ label }}</label>
    <InputNumber 
      v-bind="$attrs"
      v-model="model" 
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'rounded-md border bg-surface-50 dark:bg-surface-950 px-3 py-2 text-sm focus:outline-none focus:ring-2',
        error ? 'border-red-500 focus:ring-red-500' : 'border-surface-300 dark:border-surface-700 focus:ring-primary-500'
      ]"
    />
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
  </div>
</template>
<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';
defineOptions({ inheritAttrs: false });
defineProps({ label: String, placeholder: String, error: String, disabled: Boolean });
const model = defineModel<number>();
</script>""",
    
    "DsSkeleton.vue": """<template>
  <Skeleton v-bind="$attrs"></Skeleton>
</template>
<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
defineOptions({ inheritAttrs: false });
</script>""",

    "DsProgressSpinner.vue": """<template>
  <ProgressSpinner v-bind="$attrs"></ProgressSpinner>
</template>
<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner';
defineOptions({ inheritAttrs: false });
</script>""",
}

for name, content in components.items():
    path = os.path.join(ui_dir, name)
    if not os.path.exists(path):
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Created {name}")
    else:
        print(f"Skipped {name}")

print("Done creating components")
