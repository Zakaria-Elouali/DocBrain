import React from 'react';
import { FaSignature, FaSpinner, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const SignatureRequestsMain = ({
  selectedRequest,
  documentContent,
  loading,
  signing,
  declining,
  showSignatureModal,
  showDeclineModal,
  declineReason,
  setDeclineReason,
  signatureCanvasRef,
  handleCloseDocumentViewer,
  handleCloseModals,
  handleSubmitSignature,
  handleSubmitDecline,
  setShowSignatureModal,
  setShowDeclineModal
}) => {
  // If no request is selected, show a placeholder
  if (!selectedRequest || !documentContent) {
    return (
      <div className="signature-requests-main-container">
        <div className="main-area-wrapper" data-id="signatures">
          <div className="main-area-content signature-requests-main">
            <div className="signature-requests-main-placeholder">
              <FaSignature size={64} style={{ opacity: 0.3 }} />
              <h3>No Signature Request Selected</h3>
              <p>Select a signature request from the list to view details.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signature-requests-main-container">
      <div className="main-area-wrapper" data-id="signatures">
        <div className="main-area-content signature-requests-main">
          {/* Document Viewer */}
          <div className="document-viewer">
            <div className="document-viewer-header">
              <h3>{selectedRequest.documentName}</h3>
              <div className="document-viewer-actions">
                {selectedRequest.status === 'Pending' && (
                  <>
                    <button
                      className="sign-button"
                      onClick={() => setShowSignatureModal(true)}
                      disabled={signing}
                    >
                      {signing ? <FaSpinner className="spinner" /> : <FaSignature />} Sign
                    </button>
                    <button
                      className="decline-button"
                      onClick={() => setShowDeclineModal(true)}
                      disabled={declining}
                    >
                      {declining ? <FaSpinner className="spinner" /> : <FaTimes />} Decline
                    </button>
                  </>
                )}
                <button className="close-button" onClick={handleCloseDocumentViewer}>
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="document-viewer-content">
              {/* This would be replaced with an actual document viewer component */}
              <div className="document-preview">
                <div className="document-info-display">
                  <h4>Document Information</h4>
                  <p><strong>Document:</strong> {documentContent.documentName}</p>
                  <p><strong>Requested by:</strong> {documentContent.requestedBy}</p>
                  <p><strong>Request date:</strong> {new Date(documentContent.requestDate).toLocaleString()}</p>
                  <p><strong>Due date:</strong> {new Date(documentContent.dueDate).toLocaleString()}</p>
                  <p><strong>Priority:</strong> {documentContent.priority}</p>
                  <p><strong>Status:</strong> {documentContent.status}</p>
                  {documentContent.description && (
                    <div className="document-description">
                      <p><strong>Description:</strong></p>
                      <p>{documentContent.description}</p>
                    </div>
                  )}
                  {documentContent.status === 'Signed' && (
                    <div className="signature-info">
                      <p><strong>Signed on:</strong> {new Date(documentContent.signedDate).toLocaleString()}</p>
                      <p><strong>Signature method:</strong> {documentContent.signatureMethod}</p>
                    </div>
                  )}
                  {documentContent.status === 'Declined' && (
                    <div className="decline-info">
                      <p><strong>Declined on:</strong> {new Date(documentContent.declinedDate).toLocaleString()}</p>
                      {documentContent.declineReason && (
                        <p><strong>Reason:</strong> {documentContent.declineReason}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="document-content-preview">
                  <p className="preview-placeholder">
                    Document preview would be displayed here in a real implementation.
                  </p>
                  <pre>{documentContent.content}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Modal */}
          {showSignatureModal && (
            <div className="signature-modal">
              <div className="signature-modal-content">
                <div className="signature-modal-header">
                  <h3>Sign Document</h3>
                  <button className="close-button" onClick={handleCloseModals}>
                    <FaTimes />
                  </button>
                </div>
                <div className="signature-modal-body">
                  <p>Please sign the document below:</p>
                  <div className="signature-canvas-container">
                    {/* In a real implementation, this would be a signature canvas */}
                    <div className="signature-placeholder" ref={signatureCanvasRef}>
                      Click here to sign
                    </div>
                  </div>
                </div>
                <div className="signature-modal-footer">
                  <button className="cancel-button" onClick={handleCloseModals}>Cancel</button>
                  <button
                    className="sign-button"
                    onClick={handleSubmitSignature}
                    disabled={signing}
                  >
                    {signing ? <FaSpinner className="spinner" /> : <FaSignature />} Sign Document
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Decline Modal */}
          {showDeclineModal && (
            <div className="decline-modal">
              <div className="decline-modal-content">
                <div className="decline-modal-header">
                  <h3>Decline Signature Request</h3>
                  <button className="close-button" onClick={handleCloseModals}>
                    <FaTimes />
                  </button>
                </div>
                <div className="decline-modal-body">
                  <p>Please provide a reason for declining:</p>
                  <textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Enter reason for declining..."
                    rows={4}
                  />
                </div>
                <div className="decline-modal-footer">
                  <button className="cancel-button" onClick={handleCloseModals}>Cancel</button>
                  <button
                    className="decline-button"
                    onClick={handleSubmitDecline}
                    disabled={declining || !declineReason.trim()}
                  >
                    {declining ? <FaSpinner className="spinner" /> : <FaTimes />} Decline Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureRequestsMain;
