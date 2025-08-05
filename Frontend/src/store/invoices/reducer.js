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

const initialState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
  pdfGenerating: false,
  pdfError: null,
  pdfData: null,
  savingToApp: false,
  saveError: null,
  savedFileData: null,
  // Analytics
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,
  // Bulk operations
  bulkOperationLoading: false,
  bulkOperationError: null,
  // Email
  emailSending: false,
  emailError: null,
  emailSuccess: null,
  // Export
  exporting: false,
  exportError: null,
  exportData: null,
  // Filters and search
  searchTerm: '',
  filters: {
    status: 'All',
    paymentMethod: 'All',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: ''
  },
  // Selection
  selectedInvoices: [],
  // Analytics View State
  showAnalyticsInMainArea: false
};

const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Invoices
    case FETCH_INVOICES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_INVOICES_SUCCESS:
      return {
        ...state,
        loading: false,
        invoices: action.payload
      };
    case FETCH_INVOICES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Add Invoice
    case ADD_INVOICE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case ADD_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        invoices: [...state.invoices, action.payload]
      };
    case ADD_INVOICE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update Invoice
    case UPDATE_INVOICE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPDATE_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        invoices: state.invoices.map(invoice => 
          invoice.id === action.payload.id ? action.payload : invoice
        )
      };
    case UPDATE_INVOICE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Delete Invoice
    case DELETE_INVOICE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DELETE_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        invoices: state.invoices.filter(invoice => invoice.id !== action.payload)
      };
    case DELETE_INVOICE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Generate Invoice PDF
    case GENERATE_INVOICE_PDF_REQUEST:
      return {
        ...state,
        pdfGenerating: true,
        pdfError: null,
        pdfData: null
      };
    case GENERATE_INVOICE_PDF_SUCCESS:
      return {
        ...state,
        pdfGenerating: false,
        pdfData: action.payload
      };
    case GENERATE_INVOICE_PDF_FAILURE:
      return {
        ...state,
        pdfGenerating: false,
        pdfError: action.payload
      };

    // Save Invoice to App
    case SAVE_INVOICE_TO_APP_REQUEST:
      return {
        ...state,
        savingToApp: true,
        saveError: null,
        savedFileData: null
      };
    case SAVE_INVOICE_TO_APP_SUCCESS:
      return {
        ...state,
        savingToApp: false,
        savedFileData: action.payload
      };
    case SAVE_INVOICE_TO_APP_FAILURE:
      return {
        ...state,
        savingToApp: false,
        saveError: action.payload
      };

    // Fetch Invoice By ID
    case FETCH_INVOICE_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        currentInvoice: null
      };
    case FETCH_INVOICE_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentInvoice: action.payload
      };
    case FETCH_INVOICE_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        currentInvoice: null
      };

    // Fetch Invoice Analytics
    case FETCH_INVOICE_ANALYTICS_REQUEST:
      return {
        ...state,
        analyticsLoading: true,
        analyticsError: null
      };
    case FETCH_INVOICE_ANALYTICS_SUCCESS:
      return {
        ...state,
        analyticsLoading: false,
        analytics: action.payload
      };
    case FETCH_INVOICE_ANALYTICS_FAILURE:
      return {
        ...state,
        analyticsLoading: false,
        analyticsError: action.payload
      };

    // Bulk Delete Invoices
    case BULK_DELETE_INVOICES_REQUEST:
      return {
        ...state,
        bulkOperationLoading: true,
        bulkOperationError: null
      };
    case BULK_DELETE_INVOICES_SUCCESS:
      return {
        ...state,
        bulkOperationLoading: false,
        invoices: state.invoices.filter(invoice => !action.payload.includes(invoice.id)),
        selectedInvoices: []
      };
    case BULK_DELETE_INVOICES_FAILURE:
      return {
        ...state,
        bulkOperationLoading: false,
        bulkOperationError: action.payload
      };

    // Bulk Update Invoice Status
    case BULK_UPDATE_INVOICE_STATUS_REQUEST:
      return {
        ...state,
        bulkOperationLoading: true,
        bulkOperationError: null
      };
    case BULK_UPDATE_INVOICE_STATUS_SUCCESS:
      return {
        ...state,
        bulkOperationLoading: false,
        invoices: state.invoices.map(invoice => {
          const updatedInvoice = action.payload.find(updated => updated.id === invoice.id);
          return updatedInvoice || invoice;
        })
      };
    case BULK_UPDATE_INVOICE_STATUS_FAILURE:
      return {
        ...state,
        bulkOperationLoading: false,
        bulkOperationError: action.payload
      };

    // Duplicate Invoice
    case DUPLICATE_INVOICE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DUPLICATE_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        invoices: [...state.invoices, action.payload]
      };
    case DUPLICATE_INVOICE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Send Invoice Email
    case SEND_INVOICE_EMAIL_REQUEST:
      return {
        ...state,
        emailSending: true,
        emailError: null,
        emailSuccess: null
      };
    case SEND_INVOICE_EMAIL_SUCCESS:
      return {
        ...state,
        emailSending: false,
        emailSuccess: action.payload
      };
    case SEND_INVOICE_EMAIL_FAILURE:
      return {
        ...state,
        emailSending: false,
        emailError: action.payload
      };

    // Export Invoices
    case EXPORT_INVOICES_REQUEST:
      return {
        ...state,
        exporting: true,
        exportError: null,
        exportData: null
      };
    case EXPORT_INVOICES_SUCCESS:
      return {
        ...state,
        exporting: false,
        exportData: action.payload
      };
    case EXPORT_INVOICES_FAILURE:
      return {
        ...state,
        exporting: false,
        exportError: action.payload
      };

    // Filter and Search
    case SET_INVOICE_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    case CLEAR_INVOICE_FILTERS:
      return {
        ...state,
        filters: {
          status: 'All',
          paymentMethod: 'All',
          dateFrom: '',
          dateTo: '',
          amountMin: '',
          amountMax: ''
        }
      };
    case SET_INVOICE_SEARCH:
      return {
        ...state,
        searchTerm: action.payload
      };

    // Selection
    case SET_SELECTED_INVOICES:
      return {
        ...state,
        selectedInvoices: action.payload
      };
    case TOGGLE_INVOICE_SELECTION:
      const invoiceId = action.payload;
      const isSelected = state.selectedInvoices.includes(invoiceId);
      return {
        ...state,
        selectedInvoices: isSelected
          ? state.selectedInvoices.filter(id => id !== invoiceId)
          : [...state.selectedInvoices, invoiceId]
      };
    case SELECT_ALL_INVOICES:
      return {
        ...state,
        selectedInvoices: action.payload
      };
    case CLEAR_INVOICE_SELECTION:
      return {
        ...state,
        selectedInvoices: []
      };

    // Analytics View State
    case SET_INVOICE_ANALYTICS_VIEW:
      return {
        ...state,
        showAnalyticsInMainArea: action.payload
      };
    case CLEAR_INVOICE_ANALYTICS_VIEW:
      return {
        ...state,
        showAnalyticsInMainArea: false
      };

    default:
      return state;
  }
};

export default invoiceReducer;
