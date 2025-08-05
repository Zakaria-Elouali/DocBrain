import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import {
  FaEdit,
  FaTrash,
  FaFileDownload,
  FaPrint,
  FaArrowLeft,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaCopy
} from 'react-icons/fa';
import { updateInvoiceRequest, deleteInvoiceRequest, generateInvoicePdfRequest, saveInvoiceToAppRequest, sendInvoiceEmailRequest } from '@/store/invoices/action';
import { useDeleteConfirmation } from 'hooks/useDeleteConfirmation';
import { generateInvoicePdf, savePdf } from '@/components/SideBar/Invoice/InvoicePdfGenerator';

export const InvoiceDetails = ({
  selectedInvoice,
  onInvoiceSelect,
  onCreateInvoice,
  onEditInvoice
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const dispatch = useDispatch();
  const { confirmDelete } = useDeleteConfirmation();

  // Update editor state when selected invoice changes
  useEffect(() => {
    if (selectedInvoice && selectedInvoice.description) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromText(selectedInvoice.description)
        )
      );
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [selectedInvoice]);

  // Handle back to list
  const handleBackToList = useCallback(() => {
    onInvoiceSelect(null);
  }, [onInvoiceSelect]);

  // Handle edit invoice
  const handleEditInvoice = useCallback(() => {
    onEditInvoice(selectedInvoice);
  }, [selectedInvoice, onEditInvoice]);

  // Handle delete invoice
  const handleDeleteInvoice = useCallback(() => {
    if (selectedInvoice) {
      confirmDelete(selectedInvoice.id, (confirmedId) => {
        dispatch(deleteInvoiceRequest(confirmedId));
        handleBackToList();
      });
    }
  }, [selectedInvoice, dispatch, confirmDelete, handleBackToList]);

  // Handle download invoice
  const handleDownloadInvoice = useCallback(() => {
    if (selectedInvoice) {
      try {
        // Generate PDF using the local PDF generator
        const template = selectedInvoice.templateType?.toLowerCase().replace('_', '-') || 'law-firm';
        const pdfDoc = generateInvoicePdf(selectedInvoice, template);

        // Save the PDF
        const filename = `${selectedInvoice.invoiceNumber || selectedInvoice.number || 'invoice'}.pdf`;
        savePdf(pdfDoc, filename);
      } catch (error) {
        console.error('Error generating PDF:', error);
        // Fallback to Redux action if local generation fails
        dispatch(generateInvoicePdfRequest(selectedInvoice.id));
      }
    }
  }, [selectedInvoice, dispatch]);

  // Handle send to client
  const handleSendToClient = useCallback(() => {
    if (selectedInvoice?.id && selectedInvoice?.clientEmail) {
      dispatch(sendInvoiceEmailRequest({
        invoiceId: selectedInvoice.id,
        clientEmail: selectedInvoice.clientEmail,
        clientName: selectedInvoice.clientName || selectedInvoice.client
      }));
    } else {
      alert('Client email is required to send invoice');
    }
  }, [selectedInvoice, dispatch]);

  // Handle print invoice
  const handlePrintInvoice = useCallback(() => {
    window.print();
  }, []);

  // Handle duplicate invoice
  const handleDuplicateInvoice = useCallback(() => {
    if (selectedInvoice) {
      // Create a copy of the invoice for editing
      const duplicatedInvoice = {
        ...selectedInvoice,
        invoiceNumber: `${selectedInvoice.invoiceNumber}-COPY`,
        status: 'PENDING',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      onEditInvoice(duplicatedInvoice);
    }
  }, [selectedInvoice, onEditInvoice]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate total for items (updated for new API structure)
  const calculateItemTotal = (item) => {
    const subtotal = (item.quantity || 0) * (item.unitPrice || 0);
    const vatAmount = subtotal * ((item.vatPercentage || 0) / 100);
    return subtotal + vatAmount;
  };

  // Calculate invoice totals (updated for new API structure)
  const calculateInvoiceTotals = (items) => {
    if (!items || !Array.isArray(items)) {
      return {
        subtotal: 0,
        taxAmount: 0,
        totalAmount: 0
      };
    }

    const subtotal = items.reduce((total, item) =>
      total + ((item.quantity || 0) * (item.unitPrice || 0)), 0
    );

    const taxAmount = items.reduce((total, item) => {
      const itemSubtotal = (item.quantity || 0) * (item.unitPrice || 0);
      return total + (itemSubtotal * ((item.vatPercentage || 0) / 100));
    }, 0);

    return {
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount
    };
  };

  // Get status color class
  const getStatusClass = (status) => {
    if (!status) return '';
    switch(status.toUpperCase()) {
      case 'PAID':
        return 'status-paid';
      case 'PENDING':
        return 'status-pending';
      case 'OVERDUE':
        return 'status-overdue';
      default:
        return '';
    }
  };

  // If no invoice is selected, don't render anything (dashboard will be shown instead)
  if (!selectedInvoice) {
    return null;
  }

  // Debug logging for items display issue
  if (selectedInvoice?.items) {
    console.log('InvoiceDetails - Found items:', selectedInvoice.items.length, selectedInvoice.items);
  } else {
    console.log('InvoiceDetails - No items found in selectedInvoice:', selectedInvoice);
  }

  return (
    <div className="invoice-form-view">
      {/* Professional Invoice Document */}
      <div className="invoice-detail">
        {/* Action Header - Hidden in print */}
        <div className="invoice-detail-header">
          <div className="invoice-title">
            <h3>Invoice</h3>
            <div className="invoice-id">{selectedInvoice.invoiceNumber || selectedInvoice.number}</div>
          </div>
          <div className="invoice-actions">
            <button className="btn-secondary" onClick={handleBackToList}>
              <FaArrowLeft /> Back
            </button>
            <button className="btn-secondary" onClick={handleDownloadInvoice}>
              <FaFileDownload /> Download PDF
            </button>
            <button className="btn-secondary" onClick={handleSendToClient}>
              <FaEnvelope /> Send to Client
            </button>
            <button className="btn-secondary" onClick={handlePrintInvoice}>
              <FaPrint /> Print
            </button>
            <button className="btn-secondary" onClick={handleDuplicateInvoice}>
              <FaCopy /> Duplicate
            </button>
            <button className="btn-danger" onClick={handleDeleteInvoice}>
              <FaTrash /> Delete
            </button>
            <button className="btn-primary" onClick={handleEditInvoice}>
              <FaEdit /> Edit
            </button>
          </div>
        </div>

        {/* Invoice Document Header */}
        <div className="invoice-document-header">
          <div className="company-info">
            <div className="company-logo">
              <FaFileInvoiceDollar size={48} />
            </div>
            <div className="company-details">
              <h1>DocBrain</h1>
              <p>Document Management & Legal Services</p>
              <div className="company-contact">
                <p>123 Business Street, Suite 100</p>
                <p>New York, NY 10001</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: contact@docbrain.com</p>
              </div>
            </div>
          </div>
          <div className="invoice-header-info">
            <h2>INVOICE</h2>
            <div className="invoice-meta">
              <div className="meta-item">
                <label>Invoice #:</label>
                <span>{selectedInvoice.invoiceNumber || selectedInvoice.number}</span>
              </div>
              <div className="meta-item">
                <label>Date:</label>
                <span>{formatDate(selectedInvoice.invoiceDate || selectedInvoice.date)}</span>
              </div>
              {selectedInvoice.dueDate && (
                <div className="meta-item">
                  <label>Due Date:</label>
                  <span>{formatDate(selectedInvoice.dueDate)}</span>
                </div>
              )}
              <div className="meta-item">
                <label>Status:</label>
                <span className={`status-badge ${getStatusClass(selectedInvoice.status)}`}>
                  {selectedInvoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="invoice-billing-section">
          <div className="billing-info">
            <div className="bill-to">
              <h3>Bill To:</h3>
              <div className="client-details">
                <div className="client-name">{selectedInvoice.clientName || selectedInvoice.client}</div>
                {selectedInvoice.clientEmail && (
                  <div className="client-email">{selectedInvoice.clientEmail}</div>
                )}
                {selectedInvoice.clientAddress && (
                  <div className="client-address">{selectedInvoice.clientAddress}</div>
                )}
              </div>
            </div>

            <div className="invoice-details">
              <div className="detail-row">
                <label>Payment Method:</label>
                <span>{selectedInvoice.paymentMethod || 'Credit Card'}</span>
              </div>
              {selectedInvoice.templateType && (
                <div className="detail-row">
                  <label>Service Type:</label>
                  <span>{selectedInvoice.templateType.replace('_', ' ')}</span>
                </div>
              )}
              {selectedInvoice.createdBy && (
                <div className="detail-row">
                  <label>Prepared By:</label>
                  <span>{selectedInvoice.createdBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items/Services Table */}
        <div className="invoice-items-section">
          {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
            <div className="invoice-products">
              <h3 className="section-title">Items/Services</h3>
              <div className="table-responsive">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>VAT (%)</th>
                      <th>Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.itemName}</td>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unitPrice)}</td>
                        <td>{item.vatPercentage}%</td>
                        <td>{formatCurrency(item.lineTotal || calculateItemTotal(item))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Summary */}
              <div className="invoice-summary">
                <div className="summary-table">
                  <div className="summary-row">
                    <div className="summary-label">Subtotal</div>
                    <div className="summary-value">
                      {formatCurrency(selectedInvoice.subtotal || calculateInvoiceTotals(selectedInvoice.items).subtotal)}
                    </div>
                  </div>
                  <div className="summary-row">
                    <div className="summary-label">Tax Amount</div>
                    <div className="summary-value">
                      {formatCurrency(selectedInvoice.taxAmount || calculateInvoiceTotals(selectedInvoice.items).taxAmount)}
                    </div>
                  </div>
                  <div className="summary-row total">
                    <div className="summary-label">Total Amount</div>
                    <div className="summary-value">
                      {formatCurrency(selectedInvoice.totalAmount || calculateInvoiceTotals(selectedInvoice.items).totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Fallback for invoices without items (show basic summary)
            <div className="invoice-summary">
              <h3 className="section-title">Invoice Summary</h3>
              <div className="summary-table">
                <div className="summary-row">
                  <div className="summary-label">Subtotal</div>
                  <div className="summary-value">{formatCurrency(selectedInvoice.subtotal || selectedInvoice.amount || 0)}</div>
                </div>
                <div className="summary-row">
                  <div className="summary-label">Tax Amount</div>
                  <div className="summary-value">{formatCurrency(selectedInvoice.taxAmount || 0)}</div>
                </div>
                <div className="summary-row total">
                  <div className="summary-label">Total Amount</div>
                  <div className="summary-value">{formatCurrency(selectedInvoice.totalAmount || selectedInvoice.amount || 0)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {selectedInvoice.description && (
          <div className="invoice-description-section">
            <h3>Description</h3>
            <div className="description-content">
              <Editor
                editorState={editorState}
                readOnly
              />
            </div>
          </div>
        )}

        {/* Notes */}
        {selectedInvoice.notes && (
          <div className="invoice-notes-section">
            <h3>Notes</h3>
            <div className="notes-content">
              {selectedInvoice.notes}
            </div>
          </div>
        )}

        {/* Footer Information */}
        <div className="invoice-footer">
          <div className="footer-info">
            <div className="payment-terms">
              <h4>Payment Terms</h4>
              <p>Payment is due within 30 days of invoice date.</p>
              <p>Late fees may apply after due date.</p>
            </div>
            <div className="contact-info">
              <h4>Questions?</h4>
              <p>Contact us at contact@docbrain.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
          {(selectedInvoice.createdAt || selectedInvoice.lastModifiedAt) && (
            <div className="invoice-metadata">
              {selectedInvoice.createdAt && (
                <div className="metadata-item">
                  <small>Created: {formatDate(selectedInvoice.createdAt)}</small>
                </div>
              )}
              {selectedInvoice.lastModifiedAt && (
                <div className="metadata-item">
                  <small>Last Modified: {formatDate(selectedInvoice.lastModifiedAt)}</small>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
