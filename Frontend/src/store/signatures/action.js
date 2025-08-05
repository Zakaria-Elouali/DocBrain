import {
  FETCH_SIGNATURE_REQUESTS_REQUEST,
  FETCH_SIGNATURE_REQUESTS_SUCCESS,
  FETCH_SIGNATURE_REQUESTS_FAILURE,
  VIEW_SIGNATURE_DOCUMENT_REQUEST,
  VIEW_SIGNATURE_DOCUMENT_SUCCESS,
  VIEW_SIGNATURE_DOCUMENT_FAILURE,
  SIGN_DOCUMENT_REQUEST,
  SIGN_DOCUMENT_SUCCESS,
  SIGN_DOCUMENT_FAILURE,
  DECLINE_SIGNATURE_REQUEST_REQUEST,
  DECLINE_SIGNATURE_REQUEST_SUCCESS,
  DECLINE_SIGNATURE_REQUEST_FAILURE,
  CLEAR_SIGNATURE_DOCUMENT_DATA
} from './actiontype';

// Fetch signature requests
export const fetchSignatureRequestsRequest = () => ({
  type: FETCH_SIGNATURE_REQUESTS_REQUEST
});

export const fetchSignatureRequestsSuccess = (requests) => ({
  type: FETCH_SIGNATURE_REQUESTS_SUCCESS,
  payload: requests
});

export const fetchSignatureRequestsFailure = (error) => ({
  type: FETCH_SIGNATURE_REQUESTS_FAILURE,
  payload: error
});

// View signature document
export const viewSignatureDocumentRequest = (requestId) => ({
  type: VIEW_SIGNATURE_DOCUMENT_REQUEST,
  payload: requestId
});

export const viewSignatureDocumentSuccess = (document) => ({
  type: VIEW_SIGNATURE_DOCUMENT_SUCCESS,
  payload: document
});

export const viewSignatureDocumentFailure = (error) => ({
  type: VIEW_SIGNATURE_DOCUMENT_FAILURE,
  payload: error
});

// Sign document
export const signDocumentRequest = (requestId, signatureData) => ({
  type: SIGN_DOCUMENT_REQUEST,
  payload: { requestId, signatureData }
});

export const signDocumentSuccess = (requestId) => ({
  type: SIGN_DOCUMENT_SUCCESS,
  payload: requestId
});

export const signDocumentFailure = (error) => ({
  type: SIGN_DOCUMENT_FAILURE,
  payload: error
});

// Decline signature request
export const declineSignatureRequestRequest = (requestId, reason) => ({
  type: DECLINE_SIGNATURE_REQUEST_REQUEST,
  payload: { requestId, reason }
});

export const declineSignatureRequestSuccess = (requestId) => ({
  type: DECLINE_SIGNATURE_REQUEST_SUCCESS,
  payload: requestId
});

export const declineSignatureRequestFailure = (error) => ({
  type: DECLINE_SIGNATURE_REQUEST_FAILURE,
  payload: error
});

// Clear signature document data
export const clearSignatureDocumentData = () => ({
  type: CLEAR_SIGNATURE_DOCUMENT_DATA
});
