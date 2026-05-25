import { useNotificationStore } from '../stores/notificationStore';
import type { ToastServiceMethods } from 'primevue/toastservice';

export interface RealtimeEventPayload {
  type?: 'info' | 'success' | 'warning' | 'error';
  message?: string;
  domainEvent?: string;
  [key: string]: any;
}

export class RealtimeService {
  private eventSource: EventSource | null = null;
  private store: ReturnType<typeof useNotificationStore> | null = null;
  private toastService: ToastServiceMethods | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  init(store: ReturnType<typeof useNotificationStore>, toast: ToastServiceMethods) {
    this.store = store;
    this.toastService = toast;
    this.connect();
  }

  private connect() {
    // Prevent multiple connections
    if (this.eventSource) {
      this.eventSource.close();
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Connect to the NestJS SSE endpoint
    this.eventSource = new EventSource(`${apiUrl}/api/events/sse`, {
      withCredentials: true
    });

    this.eventSource.onopen = () => {
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    // Generic message handler
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleEvent(data);
      } catch (err) {
        console.error('[RealtimeService] Error parsing SSE data', err);
      }
    };

    // Handle specific event types if backend emits named events
    this.eventSource.addEventListener('notification', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        this.handleEvent(data);
      } catch (err) {
        console.error('[RealtimeService] Error parsing notification event', err);
      }
    });

    this.eventSource.onerror = (error) => {
      console.error('[RealtimeService] SSE Error:', error);
      this.eventSource?.close();
      
      // Attempt to reconnect after 5 seconds
      if (!this.reconnectTimeout) {
        this.reconnectTimeout = setTimeout(() => {
          this.reconnectTimeout = null;
          this.connect();
        }, 5000);
      }
    };
  }

  private handleEvent(data: RealtimeEventPayload) {
    if (!this.store || !this.toastService) return;

    const type = data.type || 'info';
    const message = data.message || 'Notificación recibida';
    const domainEvent = data.domainEvent || 'REALTIME_EVENT';

    // 1. Añadir al store
    this.store.addNotification({
      type: type,
      message,
      domainEvent
    });

    // 2. Lanzar Toast
    // Map 'warning' to 'warn' for PrimeVue severity
    const severity = type === 'warning' ? 'warn' : type;
    
    const summaryMap: Record<string, string> = {
      success: 'Éxito',
      error: 'Error',
      warn: 'Advertencia',
      info: 'Notificación'
    };

    this.toastService.add({
      severity: severity,
      summary: summaryMap[severity] || 'Notificación',
      detail: message,
      life: type === 'error' ? 8000 : 5000 // Error toasts stay longer
    });
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export const realtimeService = new RealtimeService();
