<template>
  <div class="file-uploader-wrapper">
    <FileUpload
      :name="name"
      :url="url"
      :multiple="multiple"
      :accept="accept"
      :maxFileSize="maxFileSize"
      :customUpload="true"
      @uploader="customUploader"
      @select="onSelect"
      @clear="onClear"
      @error="onError"
      :auto="auto"
      :chooseLabel="chooseLabel"
      :uploadLabel="uploadLabel"
      :cancelLabel="cancelLabel"
      class="w-full"
    >
      <template #empty>
        <div class="flex align-items-center justify-content-center flex-column">
          <i class="pi pi-cloud-upload text-4xl text-400 mb-3" />
          <p class="m-0 text-color-secondary">
            {{ dragDropText }}
          </p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup lang="ts">
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload';
import { useAuthStore } from '../stores/authStore';
import { useTenantStore } from '../stores/tenantStore';

const props = defineProps({
  name: {
    type: String,
    default: 'file'
  },
  url: {
    type: String,
    required: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'image/*,application/pdf,text/xml'
  },
  maxFileSize: {
    type: Number,
    default: 10000000 // 10MB
  },
  auto: {
    type: Boolean,
    default: false
  },
  chooseLabel: {
    type: String,
    default: 'Seleccionar'
  },
  uploadLabel: {
    type: String,
    default: 'Subir'
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar'
  },
  dragDropText: {
    type: String,
    default: 'Arrastra y suelta archivos aquí o haz clic para seleccionar'
  },
  provider: {
    type: String,
    default: 'pdf',
    validator: (value: string) => ['pdf', 'image', 'xml'].includes(value)
  },
  uploadFunction: {
    type: Function,
    default: null
  }
});

const emit = defineEmits(['upload', 'error', 'select', 'clear']);

const authStore = useAuthStore();
const tenantStore = useTenantStore();

const customUploader = async (event: FileUploadUploaderEvent) => {
  const files = Array.isArray(event.files) ? event.files : [event.files];
  
  try {
    if (props.uploadFunction) {
      // Delegate to external upload function if provided
      for (const file of files) {
        await props.uploadFunction(file, props.provider);
      }
    } else if (props.url) {
      // Default upload behavior using fetch
      for (const file of files) {
        const formData = new FormData();
        formData.append(props.name, file);
        formData.append('provider', props.provider);
        
        // Compute SHA-256 hash
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        formData.append('hash', hashHex);
        
        const headers: Record<string, string> = {};
        if (authStore.token) {
          headers['Authorization'] = `Bearer ${authStore.token}`;
        }
        if (tenantStore.activeTenant?.id) {
          headers['x-tenant-id'] = tenantStore.activeTenant.id;
        }

        const response = await fetch(props.url, {
          method: 'POST',
          body: formData,
          headers
        });

        if (!response.ok) {
          throw new Error(`Upload failed for file: ${file.name}`);
        }
      }
    } else {
      console.warn("No url or uploadFunction provided to FileUploader");
    }

    // Call the original callback to clear UI if needed, though PrimeVue handles some of it
    emit('upload', { files });
  } catch (err: any) {
    emit('error', { error: err, files });
  }
};

const onSelect = (event: any) => {
  emit('select', event);
};

const onClear = () => {
  emit('clear');
};

const onError = (event: any) => {
  emit('error', event);
};
</script>

<style scoped>
.file-uploader-wrapper :deep(.p-fileupload) {
  border-radius: var(--p-border-radius, 8px);
}
</style>
