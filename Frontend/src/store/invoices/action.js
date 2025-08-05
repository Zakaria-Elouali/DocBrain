import {
  FETCH_INVOICES_REQUEST,
  FETCH_INVOICES_SUCCESS,
  FETCH_INVOICES_FAILURE,
  ADD_INVOICE_REQUEST,
  ADD_INVOICE_SUCCESS,
  ADD_INVOICE_FAILURE,
  UPDATE_INVOICE_REQUEST,
  UPDATE_INVOICE_SUCCESS,
  UPDATE_INVOICE_FAILURE,
  DELETE_INVOICE_REQUEST,
  DELETE_INVOICE_SUCCESS,
  DELETE_INVOICE_FAILURE,
  GENERATE_INVOICE_PDF_REQUEST,
  GENERATE_INVOICE_PDF_SUCCESS,
  GENERATE_INVOICE_PDF_FAILURE,
  SAVE_INVOICE_TO_APP_REQUEST,
  SAVE_INVOICE_TO_APP_SUCCESS,
  SAVE_INVOICE_TO_APP_FAILURE,
  FETCH_INVOICE_BY_ID_REQUEST,
  FETCH_INVOICE_BY_ID_SUCCESS,
  FETCH_INVOICE_BY_ID_FAILURE,
  FETCH_INVOICE_ANALYTICS_REQUEST,
  FETCH_INVOICE_ANALYTICS_SUCCESS,
  FETCH_INVOICE_ANALYTICS_FAILURE,
  BULK_DELETE_INVOICES_REQUEST,
  BULK_DELETE_INVOICES_SUCCESS,
  BULK_DELETE_INVOICES_FAILURE,
  BULK_UPDATE_INVOICE_STATUS_REQUEST,
  BULK_UPDATE_INVOICE_STATUS_SUCCESS,
  BULK_UPDATE_INVOICE_STATUS_FAILURE,
  DUPLICATE_INVOICE_REQUEST,
  DUPLICATE_INVOICE_SUCCESS,
  DUPLICATE_INVOICE_FAILURE,
  SEND_INVOICE_EMAIL_REQUEST,
  SEND_INVOICE_EMAIL_SUCCESS,
  SEND_INVOICE_EMAIL_FAILURE,
  EXPORT_INVOICES_REQUEST,
  EXPORT_INVOICES_SUCCESS,
  EXPORT_INVOICES_FAILURE,
  SET_INVOICE_FILTERS,
  CLEAR_INVOICE_FILTERS,
  SET_INVOICE_SEARCH,
  SET_SELECTED_INVOICES,
  TOGGLE_INVOICE_SELECTION,
  SELECT_ALL_INVOICES,
  CLEAR_INVOICE_SELECTION,
  SET_INVOICE_ANALYTICS_VIEW,
  CLEAR_INVOICE_ANALYTICS_VIEW
} from './actiontype';

// Fetch Invoices
export const fetchInvoicesRequest = (params = {}) => ({
  type: FETCH_INVOICES_REQUEST,
  payload: params
});

export const fetchInvoicesSuccess = (invoices) => ({
  type: FETCH_INVOICES_SUCCESS,
  payload: invoices
});

export const fetchInvoicesFailure = (error) => ({
  type: FETCH_INVOICES_FAILURE,
  payload: error
});

// Fetch Invoice By ID
export const fetchInvoiceByIdRequest = (id) => ({
  type: FETCH_INVOICE_BY_ID_REQUEST,
  payload: id
});

export const fetchInvoiceByIdSuccess = (invoice) => ({
  type: FETCH_INVOICE_BY_ID_SUCCESS,
  payload: invoice
});

export const fetchInvoiceByIdFailure = (error) => ({
  type: FETCH_INVOICE_BY_ID_FAILURE,
  payload: error
});

// Add Invoice
export const addInvoiceRequest = (invoice) => ({
  type: ADD_INVOICE_REQUEST,
  payload: invoice
});

export const addInvoiceSuccess = (invoice) => ({
  type: ADD_INVOICE_SUCCESS,
  payload: invoice
});

export const addInvoiceFailure = (error) => ({
  type: ADD_INVOICE_FAILURE,
  payload: error
});

// Update Invoice
export const updateInvoiceRequest = (id, invoice) => ({
  type: UPDATE_INVOICE_REQUEST,
  payload: { id, invoice }
});

export const updateInvoiceSuccess = (invoice) => ({
  type: UPDATE_INVOICE_SUCCESS,
  payload: invoice
});

export const updateInvoiceFailure = (error) => ({
  type: UPDATE_INVOICE_FAILURE,
  payload: error
});

// Delete Invoice
export const deleteInvoiceRequest = (invoiceId) => ({
  type: DELETE_INVOICE_REQUEST,
  payload: invoiceId
});

export const deleteInvoiceSuccess = (invoiceId) => ({
  type: DELETE_INVOICE_SUCCESS,
  payload: invoiceId
});

export const deleteInvoiceFailure = (error) => ({
  type: DELETE_INVOICE_FAILURE,
  payload: error
});

// Generate Invoice PDF
export const generateInvoicePdfRequest = (invoiceId) => ({
  type: GENERATE_INVOICE_PDF_REQUEST,
  payload: invoiceId
});

export const generateInvoicePdfSuccess = (pdfData) => ({
  type: GENERATE_INVOICE_PDF_SUCCESS,
  payload: pdfData
});

export const generateInvoicePdfFailure = (error) => ({
  type: GENERATE_INVOICE_PDF_FAILURE,
  payload: error
});

// Save Invoice to App
export const saveInvoiceToAppRequest = (invoiceId, folderId) => ({
  type: SAVE_INVOICE_TO_APP_REQUEST,
  payload: { invoiceId, folderId }
});

export const saveInvoiceToAppSuccess = (fileData) => ({
  type: SAVE_INVOICE_TO_APP_SUCCESS,
  payload: fileData
});

export const saveInvoiceToAppFailure = (error) => ({
  type: SAVE_INVOICE_TO_APP_FAILURE,
  payload: error
});

// Fetch Invoice Analytics
export const fetchInvoiceAnalyticsRequest = () => ({
  type: FETCH_INVOICE_ANALYTICS_REQUEST
});

export const fetchInvoiceAnalyticsSuccess = (analytics) => ({
  type: FETCH_INVOICE_ANALYTICS_SUCCESS,
  payload: analytics
});

export const fetchInvoiceAnalyticsFailure = (error) => ({
  type: FETCH_INVOICE_ANALYTICS_FAILURE,
  payload: error
});

// Bulk Delete Invoices
export const bulkDeleteInvoicesRequest = (invoiceIds) => ({
  type: BULK_DELETE_INVOICES_REQUEST,
  payload: invoiceIds
});

export const bulkDeleteInvoicesSuccess = (deletedIds) => ({
  type: BULK_DELETE_INVOICES_SUCCESS,
  payload: deletedIds
});

export const bulkDeleteInvoicesFailure = (error) => ({
  type: BULK_DELETE_INVOICES_FAILURE,
  payload: error
});

// Bulk Update Invoice Status
export const bulkUpdateInvoiceStatusRequest = (invoiceIds, status) => ({
  type: BULK_UPDATE_INVOICE_STATUS_REQUEST,
  payload: { invoiceIds, status }
});

export const bulkUpdateInvoiceStatusSuccess = (updatedInvoices) => ({
  type: BULK_UPDATE_INVOICE_STATUS_SUCCESS,
  payload: updatedInvoices
});

export const bulkUpdateInvoiceStatusFailure = (error) => ({
  type: BULK_UPDATE_INVOICE_STATUS_FAILURE,
  payload: error
});

// Duplicate Invoice
export const duplicateInvoiceRequest = (invoiceId) => ({
  type: DUPLICATE_INVOICE_REQUEST,
  payload: invoiceId
});

export const duplicateInvoiceSuccess = (newInvoice) => ({
  type: DUPLICATE_INVOICE_SUCCESS,
  payload: newInvoice
});

export const duplicateInvoiceFailure = (error) => ({
  type: DUPLICATE_INVOICE_FAILURE,
  payload: error
});

// Send Invoice Email
export const sendInvoiceEmailRequest = (invoiceId, email) => ({
  type: SEND_INVOICE_EMAIL_REQUEST,
  payload: { invoiceId, email }
});

export const sendInvoiceEmailSuccess = (emailData) => ({
  type: SEND_INVOICE_EMAIL_SUCCESS,
  payload: emailData
});

export const sendInvoiceEmailFailure = (error) => ({
  type: SEND_INVOICE_EMAIL_FAILURE,
  payload: error
});

// Export Invoices
export const exportInvoicesRequest = (invoiceIds, format) => ({
  type: EXPORT_INVOICES_REQUEST,
  payload: { invoiceIds, format }
});

export const exportInvoicesSuccess = (exportData) => ({
  type: EXPORT_INVOICES_SUCCESS,
  payload: exportData
});

export const exportInvoicesFailure = (error) => ({
  type: EXPORT_INVOICES_FAILURE,
  payload: error
});

// Filter and Search Actions
export const setInvoiceFilters = (filters) => ({
  type: SET_INVOICE_FILTERS,
  payload: filters
});

export const clearInvoiceFilters = () => ({
  type: CLEAR_INVOICE_FILTERS
});

export const setInvoiceSearch = (searchTerm) => ({
  type: SET_INVOICE_SEARCH,
  payload: searchTerm
});

// Selection Actions
export const setSelectedInvoices = (invoiceIds) => ({
  type: SET_SELECTED_INVOICES,
  payload: invoiceIds
});

export const toggleInvoiceSelection = (invoiceId) => ({
  type: TOGGLE_INVOICE_SELECTION,
  payload: invoiceId
});

export const selectAllInvoices = (invoiceIds) => ({
  type: SELECT_ALL_INVOICES,
  payload: invoiceIds
});

export const clearInvoiceSelection = () => ({
  type: CLEAR_INVOICE_SELECTION
});

// Analytics View Actions
export const setInvoiceAnalyticsView = (isVisible) => ({
  type: SET_INVOICE_ANALYTICS_VIEW,
  payload: isVisible
});

export const clearInvoiceAnalyticsView = () => ({
  type: CLEAR_INVOICE_ANALYTICS_VIEW
});
