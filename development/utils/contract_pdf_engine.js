const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');

function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Generates a physical PDF contract based on the snapshot data.
 * @param {Object} snapshotData The parsed JSON snapshot data.
 * @param {string} contractId The ID of the contract for filename saving.
 * @returns {Promise<{ filePath: string, hash: string }>}
 */
async function generateContractPDF(snapshotData, contractId) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            
            const pdfDir = path.join(__dirname, '../out_pdfs');
            if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);
            
            const filePath = path.join(pdfDir, `Contract_${contractId}.pdf`);
            const writeStream = fs.createWriteStream(filePath);
            
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            
            doc.pipe(writeStream);
            
            // Header
            doc.fontSize(20).text('CONTRATO DE PRESTACIÓN DE SERVICIOS', { align: 'center' });
            doc.moveDown();
            
            doc.fontSize(12).text(`Folio del Contrato: ${snapshotData.contract_folio || 'N/A'}`, { align: 'right' });
            doc.moveDown(2);
            
            // Tenant Info
            const tenant = snapshotData.tenant_data || {};
            const tenantSettings = tenant.settings_json || {};
            doc.fontSize(14).text('1. EL PRESTADOR DEL SERVICIO', { underline: true });
            doc.fontSize(11).text(`Razón Social: ${tenantSettings.razon_social || tenant.name || 'N/A'}`);
            doc.text(`RFC: ${tenantSettings.rfc || 'N/A'}`);
            doc.text(`Dirección Fiscal: ${tenantSettings.direccion_fiscal || 'N/A'}`);
            doc.text(`Representante Legal: ${tenantSettings.representante_legal || 'N/A'}`);
            doc.moveDown();
            
            // Client Info
            const client = snapshotData.client_data || {};
            const clientExp = client.expediente_json || {};
            doc.fontSize(14).text('2. EL CLIENTE', { underline: true });
            doc.fontSize(11).text(`Razón Social: ${client.razon_social || 'N/A'}`);
            doc.text(`RFC: ${client.rfc || 'N/A'}`);
            doc.text(`Dirección Fiscal: ${clientExp.direccion_fiscal || 'N/A'}`);
            doc.text(`Representante Legal: ${clientExp.representante_legal || 'N/A'}`);
            doc.moveDown();
            
            // Financials
            const financials = snapshotData.financial_snapshot || {};
            doc.fontSize(14).text('3. CONDICIONES FINANCIERAS', { underline: true });
            doc.fontSize(11).text(`Moneda: ${financials.currency || 'MXN'}`);
            doc.text(`Subtotal: $${financials.subtotal?.toFixed(2) || '0.00'}`);
            doc.text(`Descuentos: $${financials.discounts?.toFixed(2) || '0.00'}`);
            doc.text(`Impuestos (IVA): $${financials.taxes?.toFixed(2) || '0.00'}`);
            doc.fontSize(12).text(`TOTAL A PAGAR: $${financials.total?.toFixed(2) || '0.00'}`, { stroke: true });
            doc.moveDown();
            
            // Items
            doc.fontSize(14).text('4. CONCEPTOS AUTORIZADOS', { underline: true });
            const items = snapshotData.items || [];
            if (items.length === 0) {
                doc.fontSize(11).text('No hay conceptos específicos detallados.');
            } else {
                items.forEach((item, index) => {
                    doc.fontSize(11).text(`${index + 1}. ${item.concept_name} (Cant: ${item.quantity}) - $${item.total_price?.toFixed(2)}`);
                });
            }
            doc.moveDown(2);
            
            // Signatures block
            doc.fontSize(14).text('5. FIRMAS DE CONFORMIDAD', { underline: true });
            doc.moveDown(3);
            doc.text('__________________________________', { continued: true });
            doc.text('__________________________________', { align: 'right' });
            
            doc.fontSize(10).text('Firma EL PRESTADOR', { continued: true });
            doc.text('Firma EL CLIENTE', { align: 'right' });
            
            // Hash signature at bottom
            doc.moveDown(5);
            doc.fontSize(8).fillColor('gray').text(`Generado el: ${new Date().toISOString()}`, { align: 'center' });
            doc.text(`Source Quote Hash: ${snapshotData.snapshot_hash || 'N/A'}`, { align: 'center' });
            
            doc.end();
            
            writeStream.on('finish', () => {
                const pdfBuffer = Buffer.concat(buffers);
                const hash = sha256(pdfBuffer);
                resolve({ filePath, hash });
            });
            
            writeStream.on('error', (err) => reject(err));
            
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = { generateContractPDF, sha256 };
