const PocketBase = require('pocketbase/cjs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const pb = new PocketBase('http://127.0.0.1:8090');

async function generatePDF() {
    await pb.collection('_superusers').authWithPassword('admin@acme.com', 'Password123!');
    const versions = await pb.collection('quote_versions').getList(1, 10);
    // Sort manually to get the last one since API sort fails on this field
    versions.items.reverse();
    
    if (versions.items.length === 0) {
        console.error("No quote versions found to generate PDF.");
        return;
    }
    
    const v = versions.items[0];
    const sd = v.snapshot_data;
    
    const doc = new PDFDocument({ margin: 50 });
    
    // Save to artifacts
    const outPath = 'C:\\Users\\johan\\.gemini\\antigravity\\brain\\ed67d679-888e-488e-b5f8-186486587e85\\Contract_Draft.pdf';
    doc.pipe(fs.createWriteStream(outPath));
    
    doc.fontSize(20).text('CONTRATO DE SERVICIOS (DRAFT)', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Folio: ${sd.folio}`);
    doc.text(`Version: ${sd.current_version}`);
    doc.text(`Hash: ${v.snapshot_hash}`);
    doc.moveDown();
    
    // Arrendador
    doc.fontSize(14).text('ARRENDADOR (TENANT)', { underline: true });
    if(sd.tenant_data && sd.tenant_data.settings_json) {
        doc.fontSize(12).text(`Nombre: ${sd.tenant_data.settings_json.razon_social}`);
        doc.text(`RFC: ${sd.tenant_data.settings_json.rfc}`);
        doc.text(`Representante Legal: ${sd.tenant_data.settings_json.representante_legal}`);
    } else {
        doc.text('No tenant metadata embedded.');
    }
    doc.moveDown();
    
    // Cliente
    doc.fontSize(14).text('ARRENDATARIO (CLIENT)', { underline: true });
    if(sd.client_data) {
        doc.fontSize(12).text(`Nombre: ${sd.client_data.razon_social}`);
        doc.text(`RFC: ${sd.client_data.rfc}`);
        if(sd.client_data.expediente_json) {
            doc.text(`Dirección Fiscal: ${sd.client_data.expediente_json.direccion_fiscal}`);
            doc.text(`Representante Legal: ${sd.client_data.expediente_json.representante_legal}`);
        }
    } else {
        doc.text('No client metadata embedded.');
    }
    doc.moveDown();
    
    // Items
    doc.fontSize(14).text('CONCEPTOS', { underline: true });
    doc.fontSize(12);
    if(sd.items && sd.items.length > 0) {
        sd.items.forEach(i => {
            doc.text(`- ${i.description} | Cantidad: ${i.quantity} | Total: $${i.total_price}`);
        });
    } else {
        doc.text('No items.');
    }
    doc.moveDown();
    
    // Totals
    doc.fontSize(14).text('RESUMEN FINANCIERO', { underline: true });
    doc.fontSize(12);
    if(sd.financial_snapshot) {
        doc.text(`Subtotal: $${sd.financial_snapshot.subtotal}`);
        doc.text(`Descuentos: $${sd.financial_snapshot.discounts}`);
        doc.text(`IVA (${sd.financial_snapshot.tax_rate * 100}%): $${sd.financial_snapshot.taxes}`);
        doc.fontSize(14).text(`Total a Pagar: $${sd.financial_snapshot.total}`);
    }
    
    doc.end();
    console.log(`PDF Generated successfully at ${outPath}`);
}

generatePDF().catch(console.error);
