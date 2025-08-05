import { takeLatest, put, call, all, fork } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  FETCH_INVOICES_REQUEST,
  FETCH_INVOICE_BY_ID_REQUEST,
  ADD_INVOICE_REQUEST,
  UPDATE_INVOICE_REQUEST,
  DELETE_INVOICE_REQUEST,
  GENERATE_INVOICE_PDF_REQUEST,
  SAVE_INVOICE_TO_APP_REQUEST,
  FETCH_INVOICE_ANALYTICS_REQUEST,
  BULK_DELETE_INVOICES_REQUEST,
  DUPLICATE_INVOICE_REQUEST,
  SEND_INVOICE_EMAIL_REQUEST,
  EXPORT_INVOICES_REQUEST
} from './actiontype';
import {
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  fetchInvoiceByIdSuccess,
  fetchInvoiceByIdFailure,
  addInvoiceSuccess,
  addInvoiceFailure,
  updateInvoiceSuccess,
  updateInvoiceFailure,
  deleteInvoiceSuccess,
  deleteInvoiceFailure,
  generateInvoicePdfSuccess,
  generateInvoicePdfFailure,
  saveInvoiceToAppSuccess,
  saveInvoiceToAppFailure,
  fetchInvoiceAnalyticsSuccess,
  fetchInvoiceAnalyticsFailure,
  bulkDeleteInvoicesSuccess,
  bulkDeleteInvoicesFailure,
  duplicateInvoiceSuccess,
  duplicateInvoiceFailure,
  sendInvoiceEmailSuccess,
  sendInvoiceEmailFailure,
  exportInvoicesSuccess,
  exportInvoicesFailure
} from './action';
import { APIClient } from '@/helpers/api_helper';
import {
  GET_INVOICES,
  GET_INVOICE_BY_ID,
  ADD_INVOICE,
  UPDATE_INVOICE,
  DELETE_INVOICE,
  GENERATE_INVOICE_PDF,
  SAVE_INVOICE_TO_APP,
  GET_INVOICE_ANALYTICS,
  BULK_DELETE_INVOICES,
  DUPLICATE_INVOICE,
  SEND_INVOICE_EMAIL,
  EXPORT_INVOICES
} from '@/helpers/url_helper';

const api = new APIClient();

// Helper function to generate invoice number
const generateInvoiceNumber = (existingInvoices = []) => {
  const currentYear = new Date().getFullYear();
  const yearInvoices = existingInvoices.filter(inv =>
    inv.number && inv.number.includes(currentYear.toString())
  );
  const nextNumber = yearInvoices.length + 1;
  return `INV-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
};

// Helper function to calculate invoice total
const calculateInvoiceTotal = (products = []) => {
  return products.reduce((total, product) => {
    const subtotal = product.quantity * product.unitPrice;
    const vatAmount = subtotal * (product.vat / 100);
    return total + subtotal + vatAmount;
  }, 0);
};

// Fetch Invoices
function* fetchInvoicesSaga(action) {
  try {
    // Build query parameters from action payload
    const params = action.payload || {};
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size !== undefined) queryParams.append('size', params.size);

    // Add filter parameters
    if (params.status && params.status !== 'All') queryParams.append('status', params.status);
    if (params.paymentMethod && params.paymentMethod !== 'All') queryParams.append('paymentMethod', params.paymentMethod);
    if (params.clientName) queryParams.append('clientName', params.clientName);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.amountMin) queryParams.append('amountMin', params.amountMin);
    if (params.amountMax) queryParams.append('amountMax', params.amountMax);

    const url = queryParams.toString() ? `${GET_INVOICES}?${queryParams.toString()}` : GET_INVOICES;

    try {
      // Try to call the real backend API
      const response = yield call(api.get, url);

      // Handle paginated response structure
      // Note: axios interceptor already extracts response.data, so response is the actual data
      let invoices;
      if (response && response.content && Array.isArray(response.content)) {
        // Paginated response (response is already the data due to interceptor)
        invoices = response.content;
      } else if (Array.isArray(response)) {
        // Direct array response
        invoices = response;
      } else {
        // Fallback
        invoices = [];
        console.warn('Unexpected response structure, using empty array:', response);
      }

      yield put(fetchInvoicesSuccess(invoices));
    } catch (apiError) {
      console.log('Backend API not available, using mock data for development');

      // Fallback to enhanced mock data that matches backend structure
      const mockInvoices = [
        {
          id: 1,
          invoiceNumber: 'INV-2024-001',
          clientName: 'Law Firm XYZ',
          clientEmail: 'contact@lawfirmxyz.com',
          invoiceDate: '2024-05-15',
          dueDate: '2024-06-15',
          totalAmount: 1250.00,
          subtotal: 1041.67,
          taxAmount: 208.33,
          status: 'PAID',
          paymentMethod: 'CREDIT_CARD',
          templateType: 'LAW_FIRM',
          items: [
            { id: 1, itemName: 'Legal Consultation', quantity: 5, unitPrice: 200, vatPercentage: 20, lineTotal: 1200 },
            { id: 2, itemName: 'Document Review', quantity: 2, unitPrice: 125, vatPercentage: 20, lineTotal: 300 }
          ],
          description: 'Legal services provided for corporate restructuring',
          createdAt: '2024-05-15T10:00:00Z',
          updatedAt: '2024-05-15T10:00:00Z'
        },
        {
          id: 2,
          invoiceNumber: 'INV-2024-002',
          clientName: 'Real Estate Agency ABC',
          clientEmail: 'billing@realestateabc.com',
          invoiceDate: '2024-05-18',
          dueDate: '2024-06-18',
          totalAmount: 850.00,
          subtotal: 708.33,
          taxAmount: 141.67,
          status: 'PENDING',
          paymentMethod: 'BANK_TRANSFER',
          templateType: 'REAL_ESTATE',
          items: [
            { id: 3, itemName: 'Property Valuation', quantity: 1, unitPrice: 500, vatPercentage: 20, lineTotal: 600 },
            { id: 4, itemName: 'Legal Documentation', quantity: 2, unitPrice: 175, vatPercentage: 20, lineTotal: 420 }
          ],
          description: 'Property valuation and legal documentation services',
          createdAt: '2024-05-18T14:30:00Z',
          updatedAt: '2024-05-18T14:30:00Z'
        },
        {
          id: 3,
          invoiceNumber: 'INV-2024-003',
          clientName: 'Notary Office Smith',
          clientEmail: 'admin@notarysmith.com',
          invoiceDate: '2024-05-20',
          dueDate: '2024-06-20',
          totalAmount: 1500.00,
          subtotal: 1250.00,
          taxAmount: 250.00,
          status: 'OVERDUE',
          paymentMethod: 'CHECK',
          templateType: 'NOTARY',
          items: [
            { id: 5, itemName: 'Notarization Services', quantity: 10, unitPrice: 125, vatPercentage: 20, lineTotal: 1500 }
          ],
          description: 'Multiple document notarization services',
          createdAt: '2024-05-20T09:15:00Z',
          updatedAt: '2024-05-20T09:15:00Z'
        }
      ];

      // Apply client-side filtering for mock data
      let filteredInvoices = mockInvoices;

      if (params.status && params.status !== 'All') {
        filteredInvoices = filteredInvoices.filter(inv => inv.status === params.status);
      }

      if (params.clientName) {
        filteredInvoices = filteredInvoices.filter(inv =>
          inv.clientName.toLowerCase().includes(params.clientName.toLowerCase())
        );
      }

      yield put(fetchInvoicesSuccess(filteredInvoices));
    }
  } catch (error) {
    console.error('Error in fetchInvoicesSaga:', error);
    yield put(fetchInvoicesFailure(error.message || 'Failed to fetch invoices'));
  }
}

// Add Invoice
function* addInvoiceSaga(action) {
  try {
    console.log('🎯 SAGA: addInvoiceSaga triggered');
    console.log('📦 SAGA: Received payload:', action.payload);
    console.log('🌐 SAGA: API Base URL:', import.meta.env.VITE_API_URL);
    console.log('🔗 SAGA: Full endpoint URL:', `${import.meta.env.VITE_API_URL}${ADD_INVOICE}`);

    // Try to call the real backend API (since backend works correctly)
    console.log('🚀 SAGA: Calling backend API...');
    const response = yield call(api.post, ADD_INVOICE, action.payload);

    console.log('✅ SAGA: Backend response:', response);
    const invoice = response;

    yield put(addInvoiceSuccess(invoice));

    // Show success toast
    toast.success('Invoice created successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });

    console.log('✅ SAGA: Invoice created successfully:', invoice);
  } catch (error) {
    console.error('💥 SAGA: Error creating invoice:', error);
    console.error('💥 SAGA: Error details:', {
      message: error.message,
      status: error.status,
      data: error.data
    });

    yield put(addInvoiceFailure(error.message));

    // Show error toast
    toast.error(`Failed to create invoice: ${error.message}`, {
      position: 'top-right',
      autoClose: 5000,
    });
  }
}

// Update Invoice
function* updateInvoiceSaga(action) {
  try {
    const response = yield call(api.put, UPDATE_INVOICE.replace('{invoiceId}', action.payload.id), action.payload.invoice);

    // Extract the invoice data from response
    // Note: axios interceptor already extracts response.data, so response is the actual data
    const invoice = response;

    yield put(updateInvoiceSuccess(invoice));

    // Show success toast
    toast.success('Invoice updated successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    yield put(updateInvoiceFailure(error.message));

    // Show error toast
    toast.error(`Failed to update invoice: ${error.message}`, {
      position: 'top-right',
      autoClose: 5000,
    });
  }
}

// Delete Invoice
function* deleteInvoiceSaga(action) {
  try {
    yield call(api.delete, DELETE_INVOICE.replace('{invoiceId}', action.payload));
    yield put(deleteInvoiceSuccess(action.payload));

    // Show success toast
    toast.success('Invoice deleted successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });
  } catch (error) {
    yield put(deleteInvoiceFailure(error.message));

    // Show error toast
    toast.error(`Failed to delete invoice: ${error.message}`, {
      position: 'top-right',
      autoClose: 5000,
    });
  }
}

// Generate Invoice PDF
function* generateInvoicePdfSaga(action) {
  try {
    const pdfData = yield call(api.get, GENERATE_INVOICE_PDF.replace('{invoiceId}', action.payload));
    yield put(generateInvoicePdfSuccess(pdfData));
  } catch (error) {
    yield put(generateInvoicePdfFailure(error.message));
  }
}

// Save Invoice to App
function* saveInvoiceToAppSaga(action) {
  try {
    // const fileData = yield call(api.post, SAVE_INVOICE_TO_APP, action.payload);
    // Mock response
    const fileData = {
      id: Math.floor(Math.random() * 1000) + 100,
      name: `Invoice-${action.payload.invoiceId}.pdf`,
      type: 'pdf',
      size: Math.floor(Math.random() * 1000000) + 100000,
      path: `/invoices/Invoice-${action.payload.invoiceId}.pdf`,
      folderId: action.payload.folderId || 'root',
      createdAt: new Date().toISOString()
    };
    yield put(saveInvoiceToAppSuccess(fileData));
  } catch (error) {
    yield put(saveInvoiceToAppFailure(error.message));
  }
}

// Watchers
function* watchFetchInvoices() {
  yield takeLatest(FETCH_INVOICES_REQUEST, fetchInvoicesSaga);
}

function* watchAddInvoice() {
  yield takeLatest(ADD_INVOICE_REQUEST, addInvoiceSaga);
}

function* watchUpdateInvoice() {
  yield takeLatest(UPDATE_INVOICE_REQUEST, updateInvoiceSaga);
}

function* watchDeleteInvoice() {
  yield takeLatest(DELETE_INVOICE_REQUEST, deleteInvoiceSaga);
}

function* watchGenerateInvoicePdf() {
  yield takeLatest(GENERATE_INVOICE_PDF_REQUEST, generateInvoicePdfSaga);
}

function* watchSaveInvoiceToApp() {
  yield takeLatest(SAVE_INVOICE_TO_APP_REQUEST, saveInvoiceToAppSaga);
}

function* invoiceSaga() {
  yield all([
    fork(watchFetchInvoices),
    fork(watchAddInvoice),
    fork(watchUpdateInvoice),
    fork(watchDeleteInvoice),
    fork(watchGenerateInvoicePdf),
    fork(watchSaveInvoiceToApp)
  ]);
}

export default invoiceSaga;
