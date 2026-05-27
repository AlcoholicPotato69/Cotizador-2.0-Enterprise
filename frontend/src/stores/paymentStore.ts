import { defineStore } from 'pinia';
import { ref } from 'vue';
import { http } from '../api/http';

export interface SubmitPaymentDto {
    invoiceId: string;
    paymentAmount: number;
    evidenceUrl: string;
    currencyCode: string;
}

export interface RejectPaymentDto {
    rejectionReason: string;
}

export interface RefundPaymentDto {
    refundReason: string;
}

export const usePaymentStore = defineStore('payment', () => {
    const payments = ref<any[]>([]);
    const loading = ref(false);

    // Assuming a generic GET /payments exists to fetch all payments based on context
    const fetchPayments = async () => {
        loading.value = true;
        try {
            const res = await http.get('/payments');
            payments.value = res.data?.data || res.data || [];
        } catch (error: any) {
            console.error('Error fetching payments:', error.message);
            payments.value = [];
        } finally {
            loading.value = false;
        }
    };

    const submitPayment = async (data: SubmitPaymentDto) => {
        const res = await http.post('/payments/submit', data);
        await fetchPayments();
        return res.data;
    };

    const approvePayment = async (id: string) => {
        const res = await http.post(`/payments/${id}/approve`);
        await fetchPayments();
        return res.data;
    };

    const rejectPayment = async (id: string, data: RejectPaymentDto) => {
        const res = await http.post(`/payments/${id}/reject`, data);
        await fetchPayments();
        return res.data;
    };

    const refundPayment = async (id: string, data: RefundPaymentDto) => {
        const res = await http.post(`/payments/${id}/refund`, data);
        await fetchPayments();
        return res.data;
    };

    return {
        payments,
        loading,
        fetchPayments,
        submitPayment,
        approvePayment,
        rejectPayment,
        refundPayment
    };
});
