import { takeLatest, put, call, all, fork } from 'redux-saga/effects';
import {
  FETCH_CLIENT_DOCUMENTS_REQUEST,
  UPLOAD_CLIENT_DOCUMENT_REQUEST,
  DOWNLOAD_CLIENT_DOCUMENT_REQUEST,
  VIEW_CLIENT_DOCUMENT_REQUEST,
  SIGN_CLIENT_DOCUMENT_REQUEST,
  FETCH_CLIENT_VAULTS_REQUEST,
  CREATE_CLIENT_VAULT_REQUEST
} from './actiontype';
import {
  fetchClientDocumentsSuccess,
  fetchClientDocumentsFailure,
  uploadClientDocumentSuccess,
  uploadClientDocumentFailure,
  uploadClientDocumentProgress,
  downloadClientDocumentSuccess,
  downloadClientDocumentFailure,
  viewClientDocumentSuccess,
  viewClientDocumentFailure,
  signClientDocumentSuccess,
  signClientDocumentFailure,
  fetchClientVaultsSuccess,
  fetchClientVaultsFailure,
  createClientVaultSuccess,
  createClientVaultFailure
} from './action';
import { APIClient } from '@/helpers/api_helper';
import { saveAs } from 'file-saver';
import mockClientDocumentsAPI from '@/helpers/mockData/clientDocuments';

// API endpoints would need to be defined in your url_helper.js
const API_ENDPOINTS = {
  FETCH_CLIENT_DOCUMENTS: '/client/documents',
  UPLOAD_CLIENT_DOCUMENT: '/client/documents/upload',
  DOWNLOAD_CLIENT_DOCUMENT: '/client/documents/download',
  VIEW_CLIENT_DOCUMENT: '/client/documents/view',
  SIGN_CLIENT_DOCUMENT: '/client/documents/sign',
  FETCH_CLIENT_VAULTS: '/client/vaults',
  CREATE_CLIENT_VAULT: '/client/vaults/create'
};

const api = new APIClient();

// Fetch client documents
function* fetchClientDocumentsSaga() {
  try {
    // Use mock API for now
    const response = yield call(mockClientDocumentsAPI.fetchClientDocuments);
    yield put(fetchClientDocumentsSuccess(response));

    // When backend is ready, use this instead:
    // const response = yield call(api.get, API_ENDPOINTS.FETCH_CLIENT_DOCUMENTS);
    // yield put(fetchClientDocumentsSuccess(response));
  } catch (error) {
    yield put(fetchClientDocumentsFailure(error.message || 'Failed to fetch documents'));
  }
}

// Upload client document
function* uploadClientDocumentSaga(action) {
  const { file, metadata, vaultId } = action.payload;

  try {
    // Create a temporary ID for progress tracking
    const tempId = `temp-${Date.now()}`;

    // Simulate progress updates
    for (let i = 0; i <= 100; i += 10) {
      yield call(delay, 200); // Simulate upload time
      yield put(uploadClientDocumentProgress(tempId, i));
    }

    // Use mock API for now
    const response = yield call(mockClientDocumentsAPI.uploadClientDocument, file, metadata, vaultId);
    yield put(uploadClientDocumentSuccess(response));

    // When backend is ready, use this instead:
    // const formData = new FormData();
    // formData.append('file', file);
    //
    // // Add metadata
    // if (metadata) {
    //   Object.keys(metadata).forEach(key => {
    //     formData.append(key, metadata[key]);
    //   });
    // }
    //
    // const config = {
    //   onUploadProgress: (progressEvent) => {
    //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //     put(uploadClientDocumentProgress(tempId, percentCompleted));
    //   }
    // };
    //
    // const response = yield call(api.post, API_ENDPOINTS.UPLOAD_CLIENT_DOCUMENT, formData, config);
    // yield put(uploadClientDocumentSuccess(response));
  } catch (error) {
    yield put(uploadClientDocumentFailure(error.message || 'Failed to upload document'));
  }
}

// Download client document
function* downloadClientDocumentSaga(action) {
  const documentId = action.payload;

  try {
    // Use mock API for now
    const document = yield call(mockClientDocumentsAPI.downloadClientDocument, documentId);

    // Create a mock blob for demonstration
    const mockBlob = new Blob(['Mock file content for ' + document.name], { type: document.type });
    saveAs(mockBlob, document.name);

    yield put(downloadClientDocumentSuccess(documentId));

    // When backend is ready, use this instead:
    // const response = yield call(api.get, `${API_ENDPOINTS.DOWNLOAD_CLIENT_DOCUMENT}/${documentId}`, { responseType: 'blob' });
    // const documentInfo = yield call(api.get, `${API_ENDPOINTS.VIEW_CLIENT_DOCUMENT}/${documentId}/info`);
    // saveAs(new Blob([response]), documentInfo.name);
    // yield put(downloadClientDocumentSuccess(documentId));
  } catch (error) {
    yield put(downloadClientDocumentFailure(error.message || 'Failed to download document'));
  }
}

// View client document
function* viewClientDocumentSaga(action) {
  const documentId = action.payload;

  try {
    // Use mock API for now
    const response = yield call(mockClientDocumentsAPI.viewClientDocument, documentId);
    yield put(viewClientDocumentSuccess(response));

    // When backend is ready, use this instead:
    // const response = yield call(api.get, `${API_ENDPOINTS.VIEW_CLIENT_DOCUMENT}/${documentId}`);
    // yield put(viewClientDocumentSuccess(response));
  } catch (error) {
    yield put(viewClientDocumentFailure(error.message || 'Failed to view document'));
  }
}

// Sign client document
function* signClientDocumentSaga(action) {
  const { documentId, signatureData } = action.payload;

  try {
    // Use mock API for now
    yield call(mockClientDocumentsAPI.signClientDocument, documentId, signatureData);
    yield put(signClientDocumentSuccess(documentId));

    // When backend is ready, use this instead:
    // const response = yield call(api.post, `${API_ENDPOINTS.SIGN_CLIENT_DOCUMENT}/${documentId}`, signatureData);
    // yield put(signClientDocumentSuccess(documentId));
  } catch (error) {
    yield put(signClientDocumentFailure(error.message || 'Failed to sign document'));
  }
}

// Fetch client vaults
function* fetchClientVaultsSaga() {
  try {
    // Use mock API for now - we'll create a mock function for this
    const mockVaults = [
      { id: 'vault-1', name: 'Personal Documents', createdAt: new Date().toISOString() },
      { id: 'vault-2', name: 'Financial Documents', createdAt: new Date().toISOString() },
      { id: 'vault-3', name: 'Legal Documents', createdAt: new Date().toISOString() }
    ];

    yield call(delay, 500); // Simulate network delay
    yield put(fetchClientVaultsSuccess(mockVaults));

    // When backend is ready, use this instead:
    // const response = yield call(api.get, API_ENDPOINTS.FETCH_CLIENT_VAULTS);
    // yield put(fetchClientVaultsSuccess(response));
  } catch (error) {
    yield put(fetchClientVaultsFailure(error.message || 'Failed to fetch vaults'));
  }
}

// Create client vault
function* createClientVaultSaga(action) {
  const vaultData = action.payload;

  try {
    // Use mock API for now
    const newVault = {
      id: `vault-${Date.now()}`,
      name: vaultData.name,
      createdAt: new Date().toISOString()
    };

    yield call(delay, 800); // Simulate network delay
    yield put(createClientVaultSuccess(newVault));

    // When backend is ready, use this instead:
    // const response = yield call(api.post, API_ENDPOINTS.CREATE_CLIENT_VAULT, vaultData);
    // yield put(createClientVaultSuccess(response));
  } catch (error) {
    yield put(createClientVaultFailure(error.message || 'Failed to create vault'));
  }
}

// Helper function for delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Watchers
function* watchFetchClientDocuments() {
  yield takeLatest(FETCH_CLIENT_DOCUMENTS_REQUEST, fetchClientDocumentsSaga);
}

function* watchUploadClientDocument() {
  yield takeLatest(UPLOAD_CLIENT_DOCUMENT_REQUEST, uploadClientDocumentSaga);
}

function* watchDownloadClientDocument() {
  yield takeLatest(DOWNLOAD_CLIENT_DOCUMENT_REQUEST, downloadClientDocumentSaga);
}

function* watchViewClientDocument() {
  yield takeLatest(VIEW_CLIENT_DOCUMENT_REQUEST, viewClientDocumentSaga);
}

function* watchSignClientDocument() {
  yield takeLatest(SIGN_CLIENT_DOCUMENT_REQUEST, signClientDocumentSaga);
}

function* watchFetchClientVaults() {
  yield takeLatest(FETCH_CLIENT_VAULTS_REQUEST, fetchClientVaultsSaga);
}

function* watchCreateClientVault() {
  yield takeLatest(CREATE_CLIENT_VAULT_REQUEST, createClientVaultSaga);
}

function* clientDocumentsSaga() {
  yield all([
    fork(watchFetchClientDocuments),
    fork(watchUploadClientDocument),
    fork(watchDownloadClientDocument),
    fork(watchViewClientDocument),
    fork(watchSignClientDocument),
    fork(watchFetchClientVaults),
    fork(watchCreateClientVault)
  ]);
}

export default clientDocumentsSaga;
