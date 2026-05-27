import { http } from '../api/http';

export interface Invoice {
    id: string;
    folio?: string;
    total: number;
    total_pagado?: number;
    total_notas_credito?: number;
    saldo_pendiente?: number;
    status: string;
    fecha_emision?: string;
    fecha_vencimiento?: string;
    cliente_nombre?: string;
    contrato_id?: string;
    [key: string]: unknown;
}

export const invoiceService = {
    async getById(id: string): Promise<Invoice> {
        const res = await http.get(`/invoices/${id}`);
        return res.data?.data || res.data;
    }
};

export interface Payment {
    id: string;
    folio?: string;
    factura_id: string;
    monto: number;
    fecha?: string;
    created?: string;
    metodo?: string;
    estado?: string;
    [key: string]: unknown;
}

export const paymentService = {
    async getByInvoiceId(invoiceId: string): Promise<Payment[]> {
        const res = await http.get('/payments', {
            params: { filter: `factura_id = "${invoiceId}"`, sort: '-created' }
        });
        return res.data?.data || res.data || [];
    }
};

export interface CreditNote {
    id: string;
    folio?: string;
    factura_id: string;
    monto: number;
    created?: string;
    motivo?: string;
    [key: string]: unknown;
}

export const creditNoteService = {
    async getByInvoiceId(invoiceId: string): Promise<CreditNote[]> {
        const res = await http.get('/credit_notes', {
            params: { filter: `factura_id = "${invoiceId}"`, sort: '-created' }
        });
        return res.data?.data || res.data || [];
    }
};

export interface Receipt {
    id: string;
    folio?: string;
    factura_id: string;
    created?: string;
    [key: string]: unknown;
}

export const receiptService = {
    async getByInvoiceId(invoiceId: string): Promise<Receipt[]> {
        const res = await http.get('/receipts', {
            params: { filter: `factura_id = "${invoiceId}"`, sort: '-created' }
        });
        return res.data?.data || res.data || [];
    }
};
