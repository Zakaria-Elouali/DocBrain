import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate a PDF invoice
 * @param {Object} invoice - The invoice data
 * @param {string} template - The template to use (law-firm, real-estate, notary, custom)
 * @returns {jsPDF} - The PDF document
 */
export const generateInvoicePdf = (invoice, template = 'law-firm') => {
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: `Invoice ${invoice.invoiceNumber || invoice.number}`,
    subject: 'Invoice',
    author: 'DocBrain',
    keywords: 'invoice, pdf, docbrain',
    creator: 'DocBrain Invoice Generator'
  });

  // Apply template styling based on templateType or fallback
  const templateType = invoice.templateType?.toLowerCase().replace('_', '-') || template;
  applyTemplateStyle(doc, templateType);

  // Add header
  addHeader(doc, invoice, templateType);

  // Add invoice details
  addInvoiceDetails(doc, invoice);

  // Add items/services table (updated for new API structure)
  addItemsTable(doc, invoice.items || invoice.products);

  // Add total
  addTotal(doc, invoice);

  // Add footer
  addFooter(doc, templateType);

  return doc;
};

/**
 * Apply template-specific styling
 * @param {jsPDF} doc - The PDF document
 * @param {string} template - The template to use
 */
const applyTemplateStyle = (doc, template) => {
  switch (template) {
    case 'law-firm':
      doc.setDrawColor(0, 51, 102); // Navy blue
      doc.setFillColor(0, 51, 102);
      break;
    case 'real-estate':
      doc.setDrawColor(0, 102, 51); // Green
      doc.setFillColor(0, 102, 51);
      break;
    case 'notary':
      doc.setDrawColor(102, 0, 51); // Burgundy
      doc.setFillColor(102, 0, 51);
      break;
    case 'custom':
    default:
      doc.setDrawColor(51, 51, 51); // Dark gray
      doc.setFillColor(51, 51, 51);
      break;
  }
};

/**
 * Add header to the invoice
 * @param {jsPDF} doc - The PDF document
 * @param {Object} invoice - The invoice data
 * @param {string} template - The template to use
 */
const addHeader = (doc, invoice, template) => {
  // Add logo placeholder
  doc.rect(14, 10, 30, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('LOGO', 29, 20, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Add company info
  let companyName = 'Your Company';
  let companyTagline = '';
  
  switch (template) {
    case 'law-firm':
      companyName = 'Law Firm XYZ';
      companyTagline = 'Legal Excellence & Integrity';
      break;
    case 'real-estate':
      companyName = 'Real Estate Agency ABC';
      companyTagline = 'Finding Your Perfect Home';
      break;
    case 'notary':
      companyName = 'Notary Office Smith';
      companyTagline = 'Official Document Authentication';
      break;
    default:
      companyName = 'Your Company';
      companyTagline = 'Your Business Tagline';
      break;
  }
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName, 50, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(companyTagline, 50, 22);
  
  // Add invoice title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 195, 20, { align: 'right' });
  
  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.line(14, 30, 196, 30);
};

/**
 * Add invoice details
 * @param {jsPDF} doc - The PDF document
 * @param {Object} invoice - The invoice data
 */
const addInvoiceDetails = (doc, invoice) => {
  // Client info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 40);

  doc.setFont('helvetica', 'normal');
  doc.text(invoice.clientName || invoice.client || 'Client Name', 14, 46);

  // Add client email if available
  if (invoice.clientEmail) {
    doc.text(invoice.clientEmail, 14, 51);
  }

  // Add client address if available
  if (invoice.clientAddress) {
    const addressLines = invoice.clientAddress.split(',');
    let yPos = invoice.clientEmail ? 56 : 51;
    addressLines.forEach((line, index) => {
      doc.text(line.trim(), 14, yPos + (index * 5));
    });
  } else {
    // Fallback address
    doc.text('Client Address Line 1', 14, invoice.clientEmail ? 56 : 51);
    doc.text('Client Address Line 2', 14, invoice.clientEmail ? 61 : 56);
    doc.text('City, State, ZIP', 14, invoice.clientEmail ? 66 : 61);
  }

  // Invoice info
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 140, 40);
  doc.text('Invoice Date:', 140, 46);
  if (invoice.dueDate) {
    doc.text('Due Date:', 140, 52);
    doc.text('Payment Method:', 140, 58);
    doc.text('Status:', 140, 64);
  } else {
    doc.text('Payment Method:', 140, 52);
    doc.text('Status:', 140, 58);
  }

  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoiceNumber || invoice.number || 'INV-0001', 195, 40, { align: 'right' });
  doc.text(invoice.invoiceDate || invoice.date || new Date().toISOString().split('T')[0], 195, 46, { align: 'right' });

  if (invoice.dueDate) {
    doc.text(invoice.dueDate, 195, 52, { align: 'right' });
    doc.text(invoice.paymentMethod || 'Credit Card', 195, 58, { align: 'right' });
  } else {
    doc.text(invoice.paymentMethod || 'Credit Card', 195, 52, { align: 'right' });
  }

  // Status with color
  const status = invoice.status || 'Pending';
  let statusColor;

  switch (status.toLowerCase()) {
    case 'paid':
      statusColor = [0, 153, 0]; // Green
      break;
    case 'pending':
      statusColor = [255, 153, 0]; // Orange
      break;
    case 'overdue':
      statusColor = [204, 0, 0]; // Red
      break;
    default:
      statusColor = [0, 0, 0]; // Black
      break;
  }

  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont('helvetica', 'bold');
  const statusY = invoice.dueDate ? 64 : 58;
  doc.text(status, 195, statusY, { align: 'right' });

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Add horizontal line
  doc.setLineWidth(0.3);
  const lineY = invoice.dueDate ? 70 : 65;
  doc.line(14, lineY, 196, lineY);
};

/**
 * Add items/services table (updated for new API structure)
 * @param {jsPDF} doc - The PDF document
 * @param {Array} items - The items/services
 */
const addItemsTable = (doc, items = []) => {
  // If no items, add a default one
  if (!items || items.length === 0) {
    items = [
      { itemName: 'Sample Service', description: 'Sample description', quantity: 1, unitPrice: 100, vatPercentage: 19 }
    ];
  }

  // Table header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  // Table data
  const tableData = items.map(item => {
    // Handle both new API structure (items) and old structure (products)
    const itemName = item.itemName || item.name || 'Service';
    const description = item.description || '';
    const quantity = item.quantity || 1;
    const unitPrice = item.unitPrice || 0;
    const vatPercentage = item.vatPercentage || item.vat || 0;

    const totalPrice = quantity * unitPrice;
    const vatAmount = totalPrice * (vatPercentage / 100);
    const totalWithVat = totalPrice + vatAmount;

    return [
      itemName,
      description.length > 30 ? description.substring(0, 30) + '...' : description,
      quantity,
      `$${unitPrice.toFixed(2)}`,
      `${vatPercentage}%`,
      `$${totalWithVat.toFixed(2)}`
    ];
  });

  // Generate table
  doc.autoTable({
    startY: 75,
    head: [['Item', 'Description', 'Qty', 'Unit Price', 'VAT', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [51, 51, 51],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 25, halign: 'right' }
    }
  });
};

/**
 * Add total section
 * @param {jsPDF} doc - The PDF document
 * @param {Object} invoice - The invoice data
 */
const addTotal = (doc, invoice) => {
  // Use API provided totals if available, otherwise calculate
  let subtotal = invoice.subtotal || 0;
  let vatTotal = invoice.taxAmount || 0;
  let total = invoice.totalAmount || 0;

  // If API totals not available, calculate from items
  if (!subtotal && !vatTotal && !total) {
    const items = invoice.items || invoice.products || [];

    if (items.length > 0) {
      items.forEach(item => {
        const itemSubtotal = (item.quantity || 1) * (item.unitPrice || 0);
        subtotal += itemSubtotal;
        vatTotal += itemSubtotal * ((item.vatPercentage || item.vat || 0) / 100);
      });
      total = subtotal + vatTotal;
    } else {
      // Default values if no items
      subtotal = 100;
      vatTotal = 20;
      total = 120;
    }
  }

  // Get the final Y position after the table
  const finalY = doc.previousAutoTable.finalY + 10;

  // Add total section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');

  doc.text('Subtotal:', 150, finalY);
  doc.text('Tax Amount:', 150, finalY + 6);
  doc.text('Total:', 150, finalY + 12);

  doc.setFont('helvetica', 'normal');
  doc.text(`$${subtotal.toFixed(2)}`, 195, finalY, { align: 'right' });
  doc.text(`$${vatTotal.toFixed(2)}`, 195, finalY + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text(`$${total.toFixed(2)}`, 195, finalY + 12, { align: 'right' });

  // Add horizontal line
  doc.setLineWidth(0.3);
  doc.line(150, finalY + 14, 196, finalY + 14);
};

/**
 * Add footer to the invoice
 * @param {jsPDF} doc - The PDF document
 * @param {string} template - The template to use
 */
const addFooter = (doc, template) => {
  // Add payment instructions
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Instructions:', 14, 240);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Please make payment within 30 days of invoice date.', 14, 245);
  doc.text('Bank: Example Bank', 14, 250);
  doc.text('Account: 1234567890', 14, 255);
  doc.text('Reference: Invoice number', 14, 260);
  
  // Add thank you note
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for your business!', 105, 270, { align: 'center' });
  
  // Add page number
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page ${doc.internal.getNumberOfPages()}`, 195, 285, { align: 'right' });
};

/**
 * Save the PDF with a given filename
 * @param {jsPDF} doc - The PDF document
 * @param {string} filename - The filename to save as
 */
export const savePdf = (doc, filename = 'invoice.pdf') => {
  doc.save(filename);
};

/**
 * Get a data URL for the PDF
 * @param {jsPDF} doc - The PDF document
 * @returns {string} - The data URL
 */
export const getPdfDataUrl = (doc) => {
  return doc.output('datauristring');
};

/**
 * Get the PDF as a blob
 * @param {jsPDF} doc - The PDF document
 * @returns {Blob} - The PDF blob
 */
export const getPdfBlob = (doc) => {
  return doc.output('blob');
};
