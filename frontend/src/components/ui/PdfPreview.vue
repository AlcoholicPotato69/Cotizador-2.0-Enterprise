<template>
  <div class="pdf-preview-container w-full h-full min-h-[600px] flex flex-col bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden relative">
    
    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center bg-surface-100 dark:bg-surface-900 z-10">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-500 mb-4"></i>
      <span class="text-surface-600 dark:text-surface-300 font-medium">Cargando documento PDF...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="absolute inset-0 flex flex-col items-center justify-center bg-surface-100 dark:bg-surface-900 z-10 text-center p-6">
      <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-4"></i>
      <span class="text-surface-800 dark:text-surface-100 font-bold text-lg mb-2">Error al cargar el documento</span>
      <span class="text-surface-600 dark:text-surface-400">{{ error }}</span>
    </div>

    <!-- PDF Viewer -->
    <div v-else class="flex-1 w-full h-full relative">
      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        class="w-full h-full border-none"
        title="PDF Preview"
        @load="handleIframeLoad"
      ></iframe>
      <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-surface-500">
        <i class="pi pi-file-pdf text-6xl mb-4 opacity-50"></i>
        <span>No hay documento disponible</span>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  /** Direct URL to the PDF file */
  url?: string;
  /** Base64 encoded PDF string */
  base64?: string;
  /** Buffer or Blob of the PDF */
  buffer?: ArrayBuffer | Uint8Array | Blob;
}>();

const emit = defineEmits(['load', 'error']);

const loading = ref(true);
const error = ref<string | null>(null);
const pdfUrl = ref<string | null>(null);

let objectUrl: string | null = null;

const createBlobUrl = (data: Blob | ArrayBuffer | Uint8Array, type = 'application/pdf') => {
  try {
    const blob = data instanceof Blob ? data : new Blob([data as unknown as BlobPart], { type });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Error creating blob:', err);
    throw new Error('No se pudo procesar el formato del documento.');
  }
};

const processDocument = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Clean up previous object URL if any
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }

    if (props.buffer) {
      objectUrl = createBlobUrl(props.buffer);
      pdfUrl.value = objectUrl;
    } else if (props.base64) {
      // Ensure base64 string doesn't have the data URL prefix if we are going to convert it, 
      // or just use it directly as data URL
      let b64Data = props.base64;
      if (!b64Data.startsWith('data:')) {
        b64Data = `data:application/pdf;base64,${b64Data}`;
      }
      
      // Sometimes direct base64 data URLs in iframe are blocked by browser security (CSP).
      // It's safer to convert base64 to Blob and use ObjectURL.
      const base64WithoutPrefix = b64Data.split(',')[1] || b64Data;
      const byteCharacters = atob(base64WithoutPrefix);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      objectUrl = createBlobUrl(byteArray);
      pdfUrl.value = objectUrl;
    } else if (props.url) {
      pdfUrl.value = props.url;
    } else {
      loading.value = false;
      pdfUrl.value = null;
    }
  } catch (err: any) {
    error.value = err.message || 'Error desconocido al cargar el PDF.';
    loading.value = false;
    emit('error', err);
  }
};

const handleIframeLoad = () => {
  loading.value = false;
  emit('load');
};

watch(() => [props.url, props.base64, props.buffer], () => {
  processDocument();
}, { deep: true });

onMounted(() => {
  processDocument();
});

onBeforeUnmount(() => {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
});
</script>

<style scoped>
/* To keep dark mode consistency within the iframe if the browser natively supports it, 
   we can use color-scheme, though standard browser PDF viewers control their own UI.
   We ensure the container around it adapts to the dark theme. */
.pdf-preview-container {
  color-scheme: light dark;
}
</style>

