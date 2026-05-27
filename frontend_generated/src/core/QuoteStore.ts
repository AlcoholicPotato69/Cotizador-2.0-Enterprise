import { create } from 'zustand';

interface QuoteState {
  clientId: string | null;
  spaceId: string | null;
  services: string[];
  totalCalculation: any;
  setClient: (id: string) => void;
  setSpace: (id: string) => void;
  toggleService: (service: string) => void;
  calculateTotal: () => Promise<void>;
  reset: () => void;
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  clientId: null,
  spaceId: null,
  services: [],
  totalCalculation: null,
  setClient: (id) => set({ clientId: id }),
  setSpace: (id) => set({ spaceId: id }),
  toggleService: (service) => {
    const current = get().services;
    if (current.includes(service)) {
      set({ services: current.filter(s => s !== service) });
    } else {
      set({ services: [...current, service] });
    }
  },
  calculateTotal: async () => {
    // Pricing calculation MUST happen in the backend API.
    // This frontend method will be wired to an API call later.
    console.warn('calculateTotal invoked: This must call the backend API.');
  },
  reset: () => set({ clientId: null, spaceId: null, services: [], totalCalculation: null }),
}));
