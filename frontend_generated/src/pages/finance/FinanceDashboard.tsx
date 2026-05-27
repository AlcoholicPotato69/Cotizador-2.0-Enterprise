import React, { useState } from 'react';
import { BaseCard } from '../../components/base/BaseCard';
import { BaseBreadcrumb } from '../../components/base/BaseBreadcrumb';
import { BaseSearch } from '../../components/base/BaseSearch';
import { BaseDataTable } from '../../components/base/BaseDataTable';
import { BaseBadge } from '../../components/base/BaseBadge';
import { BaseButton } from '../../components/base/BaseButton';
import { BaseModal } from '../../components/base/BaseModal';
import { BaseSelect } from '../../components/base/BaseSelect';
import { PermissionGuard } from '../../core/PermissionGuard';
import { useNotificationStore } from '../../core/notifications';
import { DollarSign, Upload, Search, CheckCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { api } from '../../core/api';

export function FinanceDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState('pago_total');

  React.useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const [invoicesRes, paymentsRes] = await Promise.all([
          api.get('/invoices'),
          api.get('/payments')
        ]);
        if (mounted) {
          setInvoices(invoicesRes.data || []);
          setPayments(paymentsRes.data || []);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch finance data', err);
          setError('Error al cargar datos financieros');
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const handleOpenPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleRegisterPayment = () => {
    if (selectedInvoice) {
      setInvoices(prev => prev.map(inv => 
        inv.id === selectedInvoice.id 
          ? { ...inv, status: paymentType === 'pago_total' ? 'PAID' : 'PARTIAL' }
          : inv
      ));
    }
    useNotificationStore.getState().add({
      title: 'Pago Registrado',
      message: `El pago para la factura ${selectedInvoice?.id} ha sido registrado.`,
      type: 'info'
    });
    toast.success('Pago registrado y recibo subido exitosamente. Flujo de aprobación notificado.');
    setIsModalOpen(false);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('Reporte Financiero', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);
      
      autoTable(doc, {
        startY: 40,
        head: [['Factura', 'Cotización', 'Cliente', 'Monto', 'Fecha Emisión', 'Estado']],
        body: invoices.map(inv => [
          inv.id,
          inv.quote,
          inv.client,
          inv.amount,
          inv.date,
          inv.status === 'PAID' ? 'Pagado' : inv.status === 'PARTIAL' ? 'Abono Parcial' : 'Pendiente'
        ]),
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85] },
        styles: { fontSize: 10 }
      });
      
      doc.save('reporte_financiero.pdf');
      toast.success('Reporte exportado como PDF');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Error al generar el reporte PDF');
    }
  };

  const columns = [
    { header: 'Factura', accessorKey: 'id' },
    { header: 'Cotización', accessorKey: 'quote' },
    { header: 'Cliente', accessorKey: 'client' },
    { header: 'Monto', accessorKey: 'amount' },
    { header: 'Fecha Emisión', accessorKey: 'date' },
    { 
      header: 'Estado', 
      accessorKey: 'status',
      cell: (row: any) => {
        switch(row.status) {
          case 'PAID': return <BaseBadge variant="success">Pagado</BaseBadge>;
          case 'PARTIAL': return <BaseBadge variant="warning">Abono Parcial</BaseBadge>;
          case 'PENDING_PAYMENT': return <BaseBadge variant="danger">Pendiente</BaseBadge>;
          default: return <BaseBadge>{row.status}</BaseBadge>;
        }
      }
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: (row: any) => (
        <PermissionGuard permissions="admin.access">
          <BaseButton variant="ghost" size="sm" onClick={() => handleOpenPayment(row)}>
            Registrar Pago
          </BaseButton>
        </PermissionGuard>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseBreadcrumb items={[{ label: 'Centro Financiero' }]} className="mb-6" />
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Centro Financiero</h1>
          <p className="text-sm text-text-secondary mt-1">Gestión de Facturación, Recibos y Aprobación de Pagos.</p>
        </div>
        <div>
          <BaseButton onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </BaseButton>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <BaseCard title="Ingresos del Mes" className="border-l-4 border-l-success">
            <p className="text-3xl font-bold text-text-primary">$8,200.00</p>
         </BaseCard>
         <BaseCard title="Facturas Pendientes" className="border-l-4 border-l-danger">
            <p className="text-3xl font-bold text-danger">2</p>
         </BaseCard>
         <BaseCard title="Cuentas por Cobrar" className="border-l-4 border-l-brand-primary">
            <p className="text-3xl font-bold text-text-primary">$39,500.00</p>
         </BaseCard>
      </div>

      <div className="bg-bg-surface border border-border-base rounded-xl p-4 shadow-sm mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Control de Facturas</h2>
        {isLoading ? (
          <div className="text-center py-4 text-text-secondary">Cargando facturas...</div>
        ) : error ? (
          <div className="text-center py-4 text-danger">{error}</div>
        ) : (
          <BaseDataTable columns={columns} data={invoices} />
        )}
      </div>

      <div className="bg-bg-surface border border-border-base rounded-xl p-4 shadow-sm mb-8 space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Historial de Pagos Recibidos</h2>
        {isLoading ? (
          <div className="text-center py-4 text-text-secondary">Cargando pagos...</div>
        ) : error ? (
          <div className="text-center py-4 text-danger">{error}</div>
        ) : (
          <BaseDataTable 
            columns={[
              { header: 'ID Pago', accessorKey: 'id' },
              { header: 'Factura', accessorKey: 'invoiceId' },
              { header: 'Monto', accessorKey: 'amount' },
              { header: 'Fecha', accessorKey: 'date' },
              { header: 'Método', accessorKey: 'method' }
            ]} 
            data={payments} 
          />
        )}
      </div>

      <BaseModal
        title="Registrar Pago y Subir Recibo"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <div className="p-3 bg-brand-primary/10 rounded-lg text-sm text-brand-primary mb-4">
            Factura seleccionada: <strong>{selectedInvoice?.id}</strong> ({selectedInvoice?.client})<br />
            Monto a pagar: <strong>{selectedInvoice?.amount}</strong>
          </div>
          
          <BaseSelect 
            label="Tipo de Pago" 
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            options={[
              { value: 'pago_total', label: 'Pago Total' },
              { value: 'anticipo', label: 'Anticipo / Abono Parcial' }
            ]} 
          />
          <BaseSelect 
            label="Método de Pago" 
            options={[
              { value: 'transferencia', label: 'Transferencia SPEI' },
              { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
              { value: 'efectivo', label: 'Efectivo' }
            ]} 
          />
          
          <div className="border border-dashed border-border-strong rounded-lg p-6 text-center bg-bg-surface-hover mt-4">
            <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-sm font-medium text-text-primary">Sube aquí el comprobante (PDF o Imagen)</p>
            <p className="text-xs text-text-tertiary mt-1">Requerido para la aprobación por Dirección.</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <BaseButton variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</BaseButton>
            <BaseButton variant="primary" onClick={handleRegisterPayment}>Subir y Registrar</BaseButton>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
