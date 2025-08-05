import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState } from 'draft-js';
import {
  FaPlus,
  FaFileInvoiceDollar,
  FaSearch,
  FaFilter,
  FaCheckSquare,
  FaSquare,
  FaTrash,
  FaFileExport,
  FaChartBar,
  FaEllipsisV,
  FaEdit,
  FaEnvelope,
  FaCopy,
  FaFileDownload,
  FaArrowLeft
} from 'react-icons/fa';
import {
  fetchInvoicesRequest,
  setInvoiceSearch,
  setInvoiceFilters,
  clearInvoiceFilters,
  toggleInvoiceSelection,
  selectAllInvoices,
  clearInvoiceSelection,
  bulkDeleteInvoicesRequest,
  exportInvoicesRequest
} from '@/store/invoices/action';
import InvoiceModal from '../../../pages/invoices/InvoiceModal';
import InvoiceDetails from '../../../pages/invoices/InvoiceDetails';
import InvoiceDashboard from '../../../pages/invoices/InvoiceDashboard';

// Filter options
const STATUS_OPTIONS = ['All', 'PAID', 'PENDING', 'OVERDUE'];
const PAYMENT_METHOD_OPTIONS = ['All', 'CREDIT_CARD', 'BANK_TRANSFER', 'CASH', 'CHECK'];

const InvoiceSidebar = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [localFilters, setLocalFilters] = useState({
    status: 'All',
    paymentMethod: 'All',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    clientName: ''
  });

  const dispatch = useDispatch();

  // Safety check for required hooks
  if (!dispatch) {
    return <div>Loading...</div>;
  }

  const invoiceState = useSelector(state => state.invoiceReducer);

  const {
    invoices = [],
    loading = false,
    error = null,
    searchTerm = '',
    filters = {},
    selectedInvoices = []
  } = invoiceState || {};

  // Fetch invoices on component mount (only once)
  useEffect(() => {
    dispatch(fetchInvoicesRequest({
      page: 0,
      size: 20
    }));
  }, [dispatch]); // Only depend on dispatch, not filters

  // Handle search
  const handleSearch = useCallback((term) => {
    dispatch(setInvoiceSearch(term));
  }, [dispatch]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType, value) => {
    setLocalFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    dispatch(setInvoiceFilters(localFilters));
    setShowFilters(false);
  }, [dispatch, localFilters]);

  // Clear filters
  const clearFilters = useCallback(() => {
    const emptyFilters = {
      status: 'All',
      paymentMethod: 'All',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      clientName: ''
    };
    setLocalFilters(emptyFilters);
    dispatch(clearInvoiceFilters());
  }, [dispatch]);

  // Handle invoice selection
  const handleInvoiceSelection = useCallback((id) => {
    dispatch(toggleInvoiceSelection(id));
  }, [dispatch]);

  // Memoized filtered invoices
  const filteredInvoices = useMemo(() => {
    if (!invoices || !Array.isArray(invoices)) return [];

    let filtered = [...invoices]; // Create a copy to avoid mutations

    // Apply search
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
        invoice.clientName?.toLowerCase().includes(searchLower) ||
        invoice.status?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [invoices, searchTerm]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (!filteredInvoices || !Array.isArray(filteredInvoices)) return;

    const selectedCount = selectedInvoices ? selectedInvoices.length : 0;
    const filteredCount = filteredInvoices.length;

    if (selectedCount === filteredCount && filteredCount > 0) {
      dispatch(clearInvoiceSelection());
    } else {
      dispatch(selectAllInvoices(filteredInvoices.map(inv => inv.id)));
    }
  }, [dispatch, selectedInvoices, filteredInvoices]);

  // Handle bulk delete
  const handleBulkDelete = useCallback(() => {
    if (!selectedInvoices || selectedInvoices.length === 0) return;

    if (window.confirm(`Delete ${selectedInvoices.length} selected invoices?`)) {
      dispatch(bulkDeleteInvoicesRequest([...selectedInvoices])); // Create copy
      dispatch(clearInvoiceSelection());
    }
  }, [dispatch, selectedInvoices]);

  // Handle export
  const handleExport = useCallback((format = 'csv') => {
    if (!selectedInvoices || !filteredInvoices) return;

    const invoicesToExport = selectedInvoices.length > 0
      ? [...selectedInvoices]
      : filteredInvoices.map(inv => inv.id);
    dispatch(exportInvoicesRequest(invoicesToExport, format));
  }, [dispatch, selectedInvoices, filteredInvoices]);

  // Handle view invoice details (similar to calendar's date selection)
  const handleViewInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice);
  }, []);

  // Handle create invoice
  const handleCreateInvoice = useCallback(() => {
    setSelectedInvoice(null);
    setModalMode('create');
    setEditorState(EditorState.createEmpty());
    setModalOpen(true);
  }, []);

  // Handle edit invoice
  const handleEditInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice);
    setModalMode('edit');
    setModalOpen(true);
  }, []);

  // Handle view analytics (reset to show dashboard)
  const handleViewAnalytics = useCallback(() => {
    setSelectedInvoice(null); // This will show analytics dashboard in main area
  }, []);

  // Handle close modal
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedInvoice(null);
    setEditorState(EditorState.createEmpty());
  }, []);

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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Early return if Redux state is not ready
  if (!invoiceState) {
    return (
      <div className="invoice-sidebar-content">
        <div className="loading-spinner">Initializing...</div>
      </div>
    );
  }

  // Render invoice list (similar to calendar's appointment list)
  const renderInvoicesList = () => {
    if (loading) {
      return (
        <div className="loading-spinner">Loading invoices...</div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <p>Error loading invoices: {error}</p>
          <button
            className="btn-secondary btn-sm"
            onClick={() => dispatch(fetchInvoicesRequest({ page: 0, size: 20 }))}
          >
            Retry
          </button>
        </div>
      );
    }

    if (!filteredInvoices || filteredInvoices.length === 0) {
      return (
        <div className="no-invoices">
          <p>No invoices found.</p>
          <button className="create-invoice-btn" onClick={handleCreateInvoice}>
            <FaPlus /> Create First Invoice
          </button>
        </div>
      );
    }

    return (
      <>
        <h3 className="sidebar-header">
          Invoices ({filteredInvoices.length})
        </h3>
        <div className="invoices-content">
          {filteredInvoices.map(invoice => (
            <div
              key={invoice.id}
              className={`invoice-card ${selectedInvoice?.id === invoice.id ? 'selected' : ''}`}
              onClick={() => handleViewInvoice(invoice)}
            >
              <div className="invoice-header">
                <div className="invoice-number">
                  <FaFileInvoiceDollar className="invoice-icon" />
                  <span>{invoice.invoiceNumber}</span>
                </div>
                <span className={`invoice-status ${getStatusClass(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="invoice-details">
                <div className="detail-row">
                  <span className="client-name">{invoice.clientName}</span>
                </div>
                <div className="detail-row">
                  <span className="invoice-date">{formatDate(invoice.invoiceDate)}</span>
                  <span className="invoice-amount">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="invoice-container">
      <div className="invoices-list">
        <div className="invoice-panel-header">
          <h2>Invoices</h2>
          <div className="header-actions">
            <button
              className="btn-secondary btn-sm"
              onClick={handleViewAnalytics}
              title="View Analytics"
            >
              <FaChartBar />
            </button>
            <button
              className="create-invoice-btn"
              onClick={handleCreateInvoice}
            >
              <FaPlus /> Create
            </button>
          </div>
        </div>

        <div className="search-and-filter-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
            title="Toggle Filters"
          >
            <FaFilter />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Payment Method</label>
              <select
                value={localFilters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="filter-select"
              >
                {PAYMENT_METHOD_OPTIONS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Client Name</label>
              <input
                type="text"
                value={localFilters.clientName}
                onChange={(e) => handleFilterChange('clientName', e.target.value)}
                className="filter-input"
                placeholder="Filter by client name"
              />
            </div>
            <div className="filter-actions">
              <button className="btn-secondary btn-sm" onClick={clearFilters}>
                Clear
              </button>
              <button className="btn-primary btn-sm" onClick={applyFilters}>
                Apply
              </button>
            </div>
          </div>
        )}

        {renderInvoicesList()}
      </div>

      <div className="main-area-wrapper" data-id="invoice">
        <div className="main-area-content invoice-main">
          {/* Show dashboard when no invoice is selected, invoice details when selected */}
          {!selectedInvoice ? (
            <InvoiceDashboard />
          ) : (
            <InvoiceDetails
              selectedInvoice={selectedInvoice}
              onInvoiceSelect={setSelectedInvoice}
              onCreateInvoice={handleCreateInvoice}
              onEditInvoice={handleEditInvoice}
            />
          )}

          <InvoiceModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            invoice={selectedInvoice}
            mode={modalMode}
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </div>
      </div>



    </div>
  );
};

export default InvoiceSidebar;
