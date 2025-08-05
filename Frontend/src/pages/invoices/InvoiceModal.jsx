import React, {useEffect, useMemo, useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import { Editor, EditorState, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import {
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaSpinner
} from 'react-icons/fa';
import { addInvoiceRequest, updateInvoiceRequest } from '@/store/invoices/action';


const validationSchema = Yup.object({
  invoiceNumber: Yup.string().required('Invoice number is required'),
  clientName: Yup.string().required('Client name is required'),
  clientEmail: Yup.string().email('Invalid email format').required('Client email is required'),
  clientAddress: Yup.string().required('Client address is required'),
  invoiceDate: Yup.date().required('Invoice date is required'),
  dueDate: Yup.date().required('Due date is required'),
  status: Yup.string().required('Status is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  templateType: Yup.string().required('Template type is required'),
  // createdBy is auto-populated, so not required in validation
  items: Yup.array().of(
    Yup.object().shape({
      itemName: Yup.string().required('Item name is required'),
      description: Yup.string(), // Made optional - not required
      quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
      unitPrice: Yup.number().min(0, 'Unit price must be at least 0').required('Unit price is required'),
      vatPercentage: Yup.number().min(0, 'VAT must be at least 0').max(100, 'VAT cannot exceed 100%').required('VAT is required')
    })
  ).min(1, 'At least one item is required')
});

const InvoiceModal = ({ isOpen, onClose, invoice, mode, editorState, setEditorState }) => {
  const dispatch = useDispatch();
  const { user: loginUser } = useSelector((state) => state.LoginReducer);
  const { loading, error } = useSelector((state) => state.invoiceReducer);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate invoice number only once
  const [generatedInvoiceNumber] = useState(() =>
    `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
  );

  const initialValues = useMemo(() => ({
    invoiceNumber: generatedInvoiceNumber,
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'PENDING',
    paymentMethod: 'CREDIT_CARD',
    templateType: 'CUSTOM',
    createdBy: loginUser?.fullName || 'Current User',
    items: [{ itemName: '', description: '', quantity: 1, unitPrice: 0, vatPercentage: 19 }],
    description: '',
    notes: ''
  }), [loginUser?.fullName, generatedInvoiceNumber]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,

    onSubmit: (values) => {
      console.log('🚀 Form submission started');
      console.log('📝 Form values:', values);
      console.log('🔧 Mode:', mode);
      console.log('👤 Login user:', loginUser);

      // Check if form is valid
      console.log('✅ Form validation errors:', formik.errors);
      console.log('🎯 Form touched fields:', formik.touched);

      // Calculate totals
      const subtotal = calculateSubtotal(values.items);
      const taxAmount = calculateTaxAmount(values.items);
      const totalAmount = subtotal + taxAmount;

      const invoiceData = {
        invoiceNumber: values.invoiceNumber,
        clientName: values.clientName,
        clientEmail: values.clientEmail,
        clientAddress: values.clientAddress,
        invoiceDate: values.invoiceDate,
        dueDate: values.dueDate,
        status: values.status,
        paymentMethod: values.paymentMethod,
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(4)),
        totalAmount: parseFloat(totalAmount.toFixed(4)),
        description: editorState.getCurrentContent().getPlainText(),
        notes: values.notes,
        templateType: values.templateType,
        createdBy: loginUser?.fullName || 'Current User',
        items: values.items.map(item => ({
          itemName: item.itemName,
          description: item.description || '', // Ensure description is never undefined
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          vatPercentage: parseFloat(item.vatPercentage),
          lineTotal: parseFloat((item.quantity * item.unitPrice * (1 + item.vatPercentage / 100)).toFixed(4))
        })),
        files: []
      };

      console.log('📝 Editor content:', editorState.getCurrentContent().getPlainText());
      console.log('📦 Final invoice data to be sent:', invoiceData);
      console.log('🌐 API URL from env:', import.meta.env.VITE_API_URL);
      console.log('🔑 Auth token available:', !!JSON.parse(sessionStorage.getItem("authUser") || '{}')?.token);

      // Set submitting state to track the operation
      setIsSubmitting(true);

      if (mode === 'create') {
        console.log('🎯 Dispatching addInvoiceRequest...');
        dispatch(addInvoiceRequest(invoiceData));
      } else {
        console.log('🎯 Dispatching updateInvoiceRequest...');
        dispatch(updateInvoiceRequest(invoice.id, { ...invoiceData, id: invoice.id }));
      }

      console.log('✅ Action dispatched successfully');
      // Don't close modal immediately - let the saga handle success/failure
      // onClose() will be called when the operation completes
    },
  });

  // Calculate subtotal (before tax)
  const calculateSubtotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, item) => {
      return acc + (item.unitPrice * item.quantity);
    }, 0);
  };

  // Calculate total tax amount
  const calculateTaxAmount = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((acc, item) => {
      const subtotal = item.unitPrice * item.quantity;
      const vatAmount = subtotal * (item.vatPercentage / 100);
      return acc + vatAmount;
    }, 0);
  };

  // Calculate total amount (subtotal + tax)
  const calculateTotal = (items) => {
    const subtotal = calculateSubtotal(items);
    const taxAmount = calculateTaxAmount(items);
    return subtotal + taxAmount;
  };

  // Handle adding a new item
  const handleAddItem = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      { itemName: '', description: '', quantity: 1, unitPrice: 0, vatPercentage: 19 }
    ]);
  };

  // Handle removing an item
  const handleRemoveItem = (index) => {
    const updatedItems = [...formik.values.items];
    updatedItems.splice(index, 1);
    formik.setFieldValue('items', updatedItems);
  };

  // Handle modal closing when operation completes
  useEffect(() => {
    if (isSubmitting && !loading) {
      // Operation completed (either success or failure)
      setIsSubmitting(false);
      if (!error) {
        // Success - close modal
        onClose();
      }
      // If there's an error, keep modal open to show error message
    }
  }, [loading, error, isSubmitting, onClose]);

  // Set form values when editing an existing invoice
  useEffect(() => {
    if (invoice && mode === 'edit') {
      const initialValues = {
        invoiceNumber: invoice.invoiceNumber || '',
        clientName: invoice.clientName || '',
        clientEmail: invoice.clientEmail || '',
        clientAddress: invoice.clientAddress || '',
        invoiceDate: invoice.invoiceDate || new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: invoice.status || 'PENDING',
        paymentMethod: invoice.paymentMethod || 'CREDIT_CARD',
        templateType: invoice.templateType || 'CUSTOM',
        createdBy: invoice.createdBy || '',
        items: invoice.items || [{ itemName: '', description: '', quantity: 1, unitPrice: 0, vatPercentage: 19 }],
        description: invoice.description || '',
        notes: invoice.notes || ''
      };

      formik.setValues(initialValues);

      if (invoice.description) {
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromText(invoice.description)
          )
        );
      } else {
        setEditorState(EditorState.createEmpty());
      }
    } else if (mode === 'create') {
      // Reset form for create mode
      formik.resetForm();
      setEditorState(EditorState.createEmpty());
    }
  }, [invoice?.id, mode]); // Only depend on invoice.id and mode, not the entire invoice object

  if (!isOpen) return null;

  return (
    <div className="invoice-modal-container">
      <div className="main-area-wrapper" data-id="invoice-modal">
        <div className="invoice-modal-content">
          <div className="modal-header">
            <h2>{mode === 'create' ? 'Create New Invoice' : 'Edit Invoice'}</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="invoice-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="invoiceNumber">Invoice Number</label>
              <input
                id="invoiceNumber"
                name="invoiceNumber"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.invoiceNumber}
                className="form-input"
              />
              {formik.touched.invoiceNumber && formik.errors.invoiceNumber && (
                <div className="error">{formik.errors.invoiceNumber}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="clientName">Client Name</label>
              <input
                id="clientName"
                name="clientName"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.clientName}
                className="form-input"
              />
              {formik.touched.clientName && formik.errors.clientName && (
                <div className="error">{formik.errors.clientName}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientEmail">Client Email</label>
              <input
                id="clientEmail"
                name="clientEmail"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.clientEmail}
                className="form-input"
              />
              {formik.touched.clientEmail && formik.errors.clientEmail && (
                <div className="error">{formik.errors.clientEmail}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="clientAddress">Client Address</label>
              <input
                id="clientAddress"
                name="clientAddress"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.clientAddress}
                className="form-input"
              />
              {formik.touched.clientAddress && formik.errors.clientAddress && (
                <div className="error">{formik.errors.clientAddress}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="invoiceDate">Invoice Date</label>
              <input
                id="invoiceDate"
                name="invoiceDate"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.invoiceDate}
                className="form-input"
              />
              {formik.touched.invoiceDate && formik.errors.invoiceDate && (
                <div className="error">{formik.errors.invoiceDate}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dueDate}
                className="form-input"
              />
              {formik.touched.dueDate && formik.errors.dueDate && (
                <div className="error">{formik.errors.dueDate}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                className="form-select"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <div className="error">{formik.errors.status}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.paymentMethod}
                className="form-select"
              >
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="CHECK">Check</option>
              </select>
              {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                <div className="error">{formik.errors.paymentMethod}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="templateType">Template Type</label>
              <select
                id="templateType"
                name="templateType"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.templateType}
                className="form-select"
              >
                <option value="CUSTOM">Custom</option>
                <option value="LAW_FIRM">Law Firm</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="NOTARY">Notary</option>
              </select>
              {formik.touched.templateType && formik.errors.templateType && (
                <div className="error">{formik.errors.templateType}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="createdBy">Created By</label>
              <input
                id="createdBy"
                name="createdBy"
                type="text"
                value={loginUser?.fullName || 'Current User'}
                className="form-input"
                readOnly
                style={{
                  backgroundColor: 'var(--bs-gray-100)',
                  cursor: 'not-allowed',
                  color: 'var(--bs-gray-600)'
                }}
              />
              {formik.touched.createdBy && formik.errors.createdBy && (
                <div className="error">{formik.errors.createdBy}</div>
              )}
            </div>
          </div>

          <div className="products-section">
            <div className="section-header">
              <h3>Items/Services</h3>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={handleAddItem}
              >
                <FaPlus /> Add Item
              </button>
            </div>

            {formik.values.items.map((item, index) => (
              <div key={index} className="product-item">
                <div className="product-grid">
                  <div className="product-field">
                    <label>Item Name</label>
                    <input
                      type="text"
                      name={`items[${index}].itemName`}
                      value={item.itemName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-input"
                    />
                    {formik.touched.items?.[index]?.itemName && formik.errors.items?.[index]?.itemName && (
                      <div className="error">{formik.errors.items[index].itemName}</div>
                    )}
                  </div>
                  <div className="product-field">
                    <label>Description (Optional)</label>
                    <input
                      type="text"
                      name={`items[${index}].description`}
                      value={item.description || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-input"
                      placeholder="Item description..."
                    />
                    {formik.touched.items?.[index]?.description && formik.errors.items?.[index]?.description && (
                      <div className="error">{formik.errors.items[index].description}</div>
                    )}
                  </div>
                  <div className="product-field">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      name={`items[${index}].quantity`}
                      value={item.quantity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-input"
                    />
                    {formik.touched.items?.[index]?.quantity && formik.errors.items?.[index]?.quantity && (
                      <div className="error">{formik.errors.items[index].quantity}</div>
                    )}
                  </div>
                  <div className="product-field">
                    <label>Unit Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name={`items[${index}].unitPrice`}
                      value={item.unitPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-input"
                    />
                    {formik.touched.items?.[index]?.unitPrice && formik.errors.items?.[index]?.unitPrice && (
                      <div className="error">{formik.errors.items[index].unitPrice}</div>
                    )}
                  </div>
                  <div className="product-field">
                    <label>VAT (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name={`items[${index}].vatPercentage`}
                      value={item.vatPercentage}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-input"
                    />
                    {formik.touched.items?.[index]?.vatPercentage && formik.errors.items?.[index]?.vatPercentage && (
                      <div className="error">{formik.errors.items[index].vatPercentage}</div>
                    )}
                  </div>
                  <div className="product-field product-actions">
                    <button
                      type="button"
                      className="btn-danger btn-sm"
                      onClick={() => handleRemoveItem(index)}
                      disabled={formik.values.items.length <= 1}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="invoice-total">
              <div className="total-breakdown">
                <div className="total-line">
                  <span>Subtotal: ${calculateSubtotal(formik.values.items).toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>Tax Amount: ${calculateTaxAmount(formik.values.items).toFixed(2)}</span>
                </div>
                <div className="total-line total-final">
                  <h3>Total Amount: ${calculateTotal(formik.values.items).toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <div className="editor-container">
              <Editor
                editorState={editorState}
                onChange={setEditorState}
                placeholder="Enter invoice description..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.notes}
              className="form-input"
              placeholder="Payment terms, additional notes..."
            />
            {formik.touched.notes && formik.errors.notes && (
              <div className="error">{formik.errors.notes}</div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              className={`btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  {mode === 'create' ? 'Creating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <FaSave />
                  {mode === 'create' ? 'Create Invoice' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
