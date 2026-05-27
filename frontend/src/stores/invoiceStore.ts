import { defineStore } from 'pinia';
import { ref } from 'vue';
import { http } from '../api/http';
// 

export interface GenerateInvoiceDto {
    clientId: string;
    contractId: string;
    totalAmount: number;
    currencyCode: string;
}

export interface StampResult {
    success: boolean;
    requiresManualUpload: boolean;
    message: string;
}

export interface UploadManualInvoiceDto {
    xmlUrl: string;
    pdfUrl: string;
}

export const useInvoiceStore = defineStore('invoice', () => {
    const invoices = ref<any[]>([]);
    const loading = ref(false);

    const fetchInvoices = async () => {
        loading.value = true;
        try {
            const res = await http.get('/invoices/report');
            invoices.value = res.data?.data || res.data || [];
        } catch (error: any) {
            console.error('Error fetching invoices:', error.message);
            invoices.value = [];
        } finally {
            loading.value = false;
        }
    };

    const getInvoice = async (id: string) => {
        const res = await http.get(`/invoices/${id}`);
        return res.data;
    };

    const generateInvoice = async (data: GenerateInvoiceDto) => {
        const res = await http.post('/invoices/generate', data);
        await fetchInvoices();
        return res.data;
    };

    const stampInvoice = async (id: string): Promise<StampResult> => {
        const res = await http.post(`/invoices/${id}/stamp`);
        await fetchInvoices();
        return res.data;
    };

    const uploadManualInvoice = async (id: string, data: UploadManualInvoiceDto) => {
        const res = await http.post(`/invoices/${id}/upload-manual`, data);
        await fetchInvoices();
        return res.data;
    };

    return {
        invoices,
        loading,
        fetchInvoices,
        getInvoice,
        generateInvoice,
        stampInvoice,
        uploadManualInvoice
    };
});
