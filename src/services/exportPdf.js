import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportPdf = (data, filename, title) => {
  if (!data || data.length === 0) return;
  
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title || 'Financial Report', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj));
  
  doc.autoTable({
    startY: 40,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] } // Indigo 600
  });
  
  doc.save(`${filename}.pdf`);
};
