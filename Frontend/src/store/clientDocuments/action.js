import {
  FETCH_CLIENT_DOCUMENTS_REQUEST,
  FETCH_CLIENT_DOCUMENTS_SUCCESS,
  FETCH_CLIENT_DOCUMENTS_FAILURE,
  UPLOAD_CLIENT_DOCUMENT_REQUEST,
  UPLOAD_CLIENT_DOCUMENT_SUCCESS,
  UPLOAD_CLIENT_DOCUMENT_FAILURE,
  UPLOAD_CLIENT_DOCUMENT_PROGRESS,
  DOWNLOAD_CLIENT_DOCUMENT_REQUEST,
  DOWNLOAD_CLIENT_DOCUMENT_SUCCESS,
  DOWNLOAD_CLIENT_DOCUMENT_FAILURE,
  VIEW_CLIENT_DOCUMENT_REQUEST,
  VIEW_CLIENT_DOCUMENT_SUCCESS,
  VIEW_CLIENT_DOCUMENT_FAILURE,
  SIGN_CLIENT_DOCUMENT_REQUEST,
  SIGN_CLIENT_DOCUMENT_SUCCESS,
  SIGN_CLIENT_DOCUMENT_FAILURE,
  CLEAR_CLIENT_DOCUMENT_DATA,
  FETCH_CLIENT_VAULTS_REQUEST,
  FETCH_CLIENT_VAULTS_SUCCESS,
  FETCH_CLIENT_VAULTS_FAILURE,
  CREATE_CLIENT_VAULT_REQUEST,
  CREATE_CLIENT_VAULT_SUCCESS,
  CREATE_CLIENT_VAULT_FAILURE,
  SELECT_CLIENT_VAULT,
  CLEAR_SELECTED_CLIENT_VAULT
} from './actiontype';

// Fetch client documents
export const fetchClientDocumentsRequest = () => ({
  type: FETCH_CLIENT_DOCUMENTS_REQUEST
});

export const fetchClientDocumentsSuccess = (documents) => ({
  type: FETCH_CLIENT_DOCUMENTS_SUCCESS,
  payload: documents
});

export const fetchClientDocumentsFailure = (error) => ({
  type: FETCH_CLIENT_DOCUMENTS_FAILURE,
  payload: error
});

// Upload document
export const uploadClientDocumentRequest = (file, metadata) => ({
  type: UPLOAD_CLIENT_DOCUMENT_REQUEST,
  payload: { file, metadata }
});

export const uploadClientDocumentSuccess = (document) => ({
  type: UPLOAD_CLIENT_DOCUMENT_SUCCESS,
  payload: document
});

export const uploadClientDocumentFailure = (error) => ({
  type: UPLOAD_CLIENT_DOCUMENT_FAILURE,
  payload: error
});

export const uploadClientDocumentProgress = (fileId, progress) => ({
  type: UPLOAD_CLIENT_DOCUMENT_PROGRESS,
  payload: { fileId, progress }
});

// Download document
export const downloadClientDocumentRequest = (documentId) => ({
  type: DOWNLOAD_CLIENT_DOCUMENT_REQUEST,
  payload: documentId
});

export const downloadClientDocumentSuccess = (documentId) => ({
  type: DOWNLOAD_CLIENT_DOCUMENT_SUCCESS,
  payload: documentId
});

export const downloadClientDocumentFailure = (error) => ({
  type: DOWNLOAD_CLIENT_DOCUMENT_FAILURE,
  payload: error
});

// View document
export const viewClientDocumentRequest = (documentId) => ({
  type: VIEW_CLIENT_DOCUMENT_REQUEST,
  payload: documentId
});

export const viewClientDocumentSuccess = (document) => ({
  type: VIEW_CLIENT_DOCUMENT_SUCCESS,
  payload: document
});

export const viewClientDocumentFailure = (error) => ({
  type: VIEW_CLIENT_DOCUMENT_FAILURE,
  payload: error
});

// Sign document
export const signClientDocumentRequest = (documentId, signatureData) => ({
  type: SIGN_CLIENT_DOCUMENT_REQUEST,
  payload: { documentId, signatureData }
});

export const signClientDocumentSuccess = (documentId) => ({
  type: SIGN_CLIENT_DOCUMENT_SUCCESS,
  payload: documentId
});

export const signClientDocumentFailure = (error) => ({
  type: SIGN_CLIENT_DOCUMENT_FAILURE,
  payload: error
});

// Clear document data
export const clearClientDocumentData = () => ({
  type: CLEAR_CLIENT_DOCUMENT_DATA
});

// Fetch client vaults (document categories)
export const fetchClientVaultsRequest = () => ({
  type: FETCH_CLIENT_VAULTS_REQUEST
});

export const fetchClientVaultsSuccess = (vaults) => ({
  type: FETCH_CLIENT_VAULTS_SUCCESS,
  payload: vaults
});

export const fetchClientVaultsFailure = (error) => ({
  type: FETCH_CLIENT_VAULTS_FAILURE,
  payload: error
});

// Create client vault
export const createClientVaultRequest = (vaultData) => ({
  type: CREATE_CLIENT_VAULT_REQUEST,
  payload: vaultData
});

export const createClientVaultSuccess = (vault) => ({
  type: CREATE_CLIENT_VAULT_SUCCESS,
  payload: vault
});

export const createClientVaultFailure = (error) => ({
  type: CREATE_CLIENT_VAULT_FAILURE,
  payload: error
});

// Select client vault
export const selectClientVault = (vaultId) => ({
  type: SELECT_CLIENT_VAULT,
  payload: vaultId
});

// Clear selected vault
export const clearSelectedClientVault = () => ({
  type: CLEAR_SELECTED_CLIENT_VAULT
});

// Modified upload document to include vaultId
export const uploadClientDocumentWithVaultRequest = (file, metadata, vaultId) => ({
  type: UPLOAD_CLIENT_DOCUMENT_REQUEST,
  payload: { file, metadata, vaultId }
});
