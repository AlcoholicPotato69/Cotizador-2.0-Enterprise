import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PDFContentOptions {
  title: string;
  subtitle?: string;
  content?: string[];
  tableData?: any[];
  tableHeaders?: string[];
  filename?: string;
}

export const generatePDF = (options: PDFContentOptions) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text(options.title, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const dateStr = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
  doc.text(`Generado el: ${dateStr}`, 14, 30);

  let startY = 38;

  if (options.subtitle) {
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(options.subtitle, 14, startY);
    startY += 8;
  }

  if (options.content && options.content.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    options.content.forEach(paragraph => {
      const splitText = doc.splitTextToSize(paragraph, 180);
      doc.text(splitText, 14, startY);
      startY += (splitText.length * 6) + 4;
    });
  }

  if (options.tableData && options.tableHeaders && options.tableData.length > 0) {
    autoTable(doc, {
      startY: startY + 5,
      head: [options.tableHeaders],
      body: options.tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
  }

  const finalFilename = options.filename ? 
    `${options.filename}.pdf` : 
    `Documento_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
    
  doc.save(finalFilename);
};
