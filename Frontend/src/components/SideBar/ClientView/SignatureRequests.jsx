import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSignature, FaEye, FaCheck, FaTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SignatureRequestsMain from './SignatureRequestsMain';

// Safely import actions - this prevents crashes if the module is not available
let signatureActions = {
  fetchSignatureRequestsRequest: () => ({ type: 'FETCH_SIGNATURE_REQUESTS_REQUEST' }),
  viewSignatureDocumentRequest: () => ({ type: 'VIEW_SIGNATURE_DOCUMENT_REQUEST' }),
  signDocumentRequest: () => ({ type: 'SIGN_DOCUMENT_REQUEST' }),
  declineSignatureRequestRequest: () => ({ type: 'DECLINE_SIGNATURE_REQUEST_REQUEST' }),
  clearSignatureDocumentData: () => ({ type: 'CLEAR_SIGNATURE_DOCUMENT_DATA' })
};

try {
  // Try to import the real actions
  signatureActions = require('@/store/signatures/action');
} catch (error) {
  console.error('Failed to import signature actions:', error);
}

const {
  fetchSignatureRequestsRequest,
  viewSignatureDocumentRequest,
  signDocumentRequest,
  declineSignatureRequestRequest,
  clearSignatureDocumentData
} = signatureActions;

const SignatureRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const signatureCanvasRef = useRef(null);
  const dispatch = useDispatch();

  // State for handling component state when Redux is not available
  const [componentState, setComponentState] = useState({
    isReduxAvailable: true,
    isLoading: false,
    hasError: false,
    errorMessage: null
  });

  // Try to get data from Redux store
  let reduxState = {};
  try {
    reduxState = useSelector(state => state.signaturesReducer || {});

    // If we get here, Redux is available
    if (componentState.isReduxAvailable === false) {
      setComponentState(prev => ({ ...prev, isReduxAvailable: true }));
    }
  } catch (error) {
    console.error('Error accessing Redux store:', error);

    // If we get here, Redux is not available
    if (componentState.isReduxAvailable === true) {
      setComponentState(prev => ({
        ...prev,
        isReduxAvailable: false,
        hasError: true,
        errorMessage: 'The signature requests feature is not fully initialized. Please try again later.'
      }));
    }
  }

  // Extract data from Redux state or use defaults
  const {
    requests = [],
    documentContent = null,
    loading = false,
    signing = false,
    declining = false,
    error = null,
    viewError = null,
    signError = null,
    declineError = null
  } = reduxState;

  // Debug log to check Redux state
  useEffect(() => {
    console.log('SignatureRequests state:', {
      reduxAvailable: componentState.isReduxAvailable,
      requests,
      loading,
      error,
      componentError: componentState.errorMessage
    });
  }, [requests, loading, error, componentState]);

  // Fetch signature requests on component mount
  useEffect(() => {
    try {
      if (componentState.isReduxAvailable) {
        dispatch(fetchSignatureRequestsRequest());
      }
    } catch (error) {
      console.error('Error dispatching fetch action:', error);
      setComponentState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: 'Failed to load signature requests. Please try again later.'
      }));
    }
  }, [dispatch, componentState.isReduxAvailable]);

  // Show error toasts when errors occur
  useEffect(() => {
    try {
      if (error) toast.error(`Error: ${error}`);
      if (viewError) toast.error(`View error: ${viewError}`);
      if (signError) toast.error(`Signature error: ${signError}`);
      if (declineError) toast.error(`Decline error: ${declineError}`);

      if (componentState.hasError && componentState.errorMessage) {
        toast.error(`Component error: ${componentState.errorMessage}`);
      }
    } catch (err) {
      console.error('Error showing toast notifications:', err);
    }
  }, [error, viewError, signError, declineError, componentState.hasError, componentState.errorMessage]);

  const handleViewRequest = useCallback((request) => {
    setSelectedRequest(request);
    dispatch(viewSignatureDocumentRequest(request.id));
  }, [dispatch]);

  const handleSignRequest = useCallback((request) => {
    setSelectedRequest(request);
    setShowSignatureModal(true);
  }, []);

  const handleDeclineRequest = useCallback((request) => {
    setSelectedRequest(request);
    setShowDeclineModal(true);
  }, []);

  const handleSubmitSignature = useCallback(() => {
    // In a real implementation, you would get signature data from a canvas
    // For now, we'll just simulate a signature with a timestamp
    const signatureData = {
      signatureDate: new Date().toISOString(),
      signatureMethod: 'Electronic',
      signedBy: "Current User"
    };

    dispatch(signDocumentRequest(selectedRequest.id, signatureData));
    setShowSignatureModal(false);
  }, [dispatch, selectedRequest]);

  const handleSubmitDecline = useCallback(() => {
    dispatch(declineSignatureRequestRequest(selectedRequest.id, declineReason));
    setShowDeclineModal(false);
    setDeclineReason('');
  }, [dispatch, selectedRequest, declineReason]);

  const handleCloseModals = useCallback(() => {
    setShowSignatureModal(false);
    setShowDeclineModal(false);
  }, []);

  const handleCloseDocumentViewer = useCallback(() => {
    setSelectedRequest(null);
    dispatch(clearSignatureDocumentData());
  }, [dispatch]);

  // If Redux is not available, show an error message
  if (!componentState.isReduxAvailable) {
    return (
      <div className="signature-requests-container" style={{ backgroundColor: 'var(--bs-body-bg)', minHeight: '100vh' }}>
        <div className="signature-requests-header">
          <h2>Signature Requests</h2>
        </div>
        <div className="error-message" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 20px',
          textAlign: 'center',
          color: 'var(--bs-danger)'
        }}>
          <FaExclamationTriangle size={48} style={{ marginBottom: '20px' }} />
          <h3 style={{ marginBottom: '20px' }}>Component Initialization Error</h3>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px' }}>
            {componentState.errorMessage || 'There was an error loading the signature requests component. Please try refreshing the page.'}
          </p>
        </div>
      </div>
    );
  }

  // Render sidebar content
  const renderSidebarContent = () => {
    return (
      <div className="signature-requests-content">
        <div className="signature-requests-header">
          <h2>Signature Requests</h2>
        </div>

        {loading || componentState.isLoading ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner" /> Loading signature requests...
          </div>
        ) : error || componentState.hasError ? (
          <div className="error-message">
            <FaExclamationTriangle /> {error || componentState.errorMessage || 'An error occurred while loading signature requests.'}
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="requests-list">
            {requests.map(request => (
              <div key={request.id} className="request-item">
                <div className="request-info">
                  <span className="request-document">{request.documentName}</span>
                  <div className="request-meta">
                    <span className="request-date">
                      Requested: {new Date(request.requestDate).toLocaleDateString()}
                    </span>
                    <span className="request-due-date">
                      Due: {new Date(request.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="request-from">From: {request.requestedBy}</span>
                  <span className={`request-status status-${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                  {request.priority && (
                    <span className={`request-priority priority-${request.priority.toLowerCase()}`}>
                      {request.priority}
                    </span>
                  )}
                </div>
                <div className="request-actions">
                  <button
                    onClick={() => handleViewRequest(request)}
                    title="View Document"
                    disabled={loading && selectedRequest?.id === request.id}
                  >
                    {loading && selectedRequest?.id === request.id ?
                      <FaSpinner className="spinner" /> : <FaEye />}
                  </button>
                  {request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleSignRequest(request)}
                        title="Sign Document"
                        disabled={signing}
                        className="sign-button"
                      >
                        {signing && selectedRequest?.id === request.id ?
                          <FaSpinner className="spinner" /> : <FaSignature />}
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request)}
                        title="Decline"
                        disabled={declining}
                        className="decline-button"
                      >
                        {declining && selectedRequest?.id === request.id ?
                          <FaSpinner className="spinner" /> : <FaTimes />}
                      </button>
                    </>
                  )}
                  {request.status === 'Signed' && (
                    <span className="signed-indicator">
                      <FaCheck /> Signed on {new Date(request.signedDate).toLocaleDateString()}
                    </span>
                  )}
                  {request.status === 'Declined' && (
                    <span className="declined-indicator">
                      <FaTimes /> Declined on {new Date(request.declinedDate).toLocaleDateString()}
                    </span>
                  )}
                  {request.status === 'Overdue' && (
                    <span className="overdue-indicator">
                      <FaExclamationTriangle /> Overdue
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-requests" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--bs-primary)' }}>No Signature Requests</h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>
              You don't have any signature requests at this time. When someone sends you a document to sign, it will appear here.
            </p>
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--bs-light)',
              borderRadius: '8px',
              maxWidth: '600px',
              margin: '0 auto',
              border: '1px solid var(--bs-border-color)'
            }}>
              <h4 style={{ color: 'var(--bs-primary)', marginBottom: '15px' }}>What are signature requests?</h4>
              <p>
                Signature requests are documents that require your electronic signature.
                These could be contracts, agreements, or other important documents that need your approval.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div className="signature-requests-container">
        <div className="signature-requests-wrapper">
          {renderSidebarContent()}
        </div>
      </div>

      {/* Main Area */}
      <SignatureRequestsMain
        selectedRequest={selectedRequest}
        documentContent={documentContent}
        loading={loading}
        signing={signing}
        declining={declining}
        showSignatureModal={showSignatureModal}
        showDeclineModal={showDeclineModal}
        declineReason={declineReason}
        setDeclineReason={setDeclineReason}
        signatureCanvasRef={signatureCanvasRef}
        handleCloseDocumentViewer={handleCloseDocumentViewer}
        handleCloseModals={handleCloseModals}
        handleSubmitSignature={handleSubmitSignature}
        handleSubmitDecline={handleSubmitDecline}
        setShowSignatureModal={setShowSignatureModal}
        setShowDeclineModal={setShowDeclineModal}
      />
    </>
  );
};

export default SignatureRequests;
