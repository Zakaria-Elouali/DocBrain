import { takeLatest, put, call, all, fork } from 'redux-saga/effects';
import {
  FETCH_SIGNATURE_REQUESTS_REQUEST,
  VIEW_SIGNATURE_DOCUMENT_REQUEST,
  SIGN_DOCUMENT_REQUEST,
  DECLINE_SIGNATURE_REQUEST_REQUEST
} from './actiontype';
import {
  fetchSignatureRequestsSuccess,
  fetchSignatureRequestsFailure,
  viewSignatureDocumentSuccess,
  viewSignatureDocumentFailure,
  signDocumentSuccess,
  signDocumentFailure,
  declineSignatureRequestSuccess,
  declineSignatureRequestFailure
} from './action';
import { APIClient } from '@/helpers/api_helper';
import mockSignatureRequestsAPI from '@/helpers/mockData/signatureRequests';

// API endpoints would need to be defined in your url_helper.js
const API_ENDPOINTS = {
  FETCH_SIGNATURE_REQUESTS: '/client/signature-requests',
  VIEW_SIGNATURE_DOCUMENT: '/client/signature-requests/document',
  SIGN_DOCUMENT: '/client/signature-requests/sign',
  DECLINE_SIGNATURE_REQUEST: '/client/signature-requests/decline'
};

const api = new APIClient();

// Helper function for delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch signature requests
function* fetchSignatureRequestsSaga() {
  try {
    // Use mock API for now
    const response = yield call(mockSignatureRequestsAPI.fetchSignatureRequests);
    yield put(fetchSignatureRequestsSuccess(response));
    
    // When backend is ready, use this instead:
    // const response = yield call(api.get, API_ENDPOINTS.FETCH_SIGNATURE_REQUESTS);
    // yield put(fetchSignatureRequestsSuccess(response));
  } catch (error) {
    yield put(fetchSignatureRequestsFailure(error.message || 'Failed to fetch signature requests'));
  }
}

// View signature document
function* viewSignatureDocumentSaga(action) {
  const requestId = action.payload;
  
  try {
    // Use mock API for now
    const response = yield call(mockSignatureRequestsAPI.viewSignatureDocument, requestId);
    yield put(viewSignatureDocumentSuccess(response));
    
    // When backend is ready, use this instead:
    // const response = yield call(api.get, `${API_ENDPOINTS.VIEW_SIGNATURE_DOCUMENT}/${requestId}`);
    // yield put(viewSignatureDocumentSuccess(response));
  } catch (error) {
    yield put(viewSignatureDocumentFailure(error.message || 'Failed to view document'));
  }
}

// Sign document
function* signDocumentSaga(action) {
  const { requestId, signatureData } = action.payload;
  
  try {
    // Use mock API for now
    yield call(mockSignatureRequestsAPI.signDocument, requestId, signatureData);
    yield put(signDocumentSuccess(requestId));
    
    // When backend is ready, use this instead:
    // const response = yield call(api.post, `${API_ENDPOINTS.SIGN_DOCUMENT}/${requestId}`, signatureData);
    // yield put(signDocumentSuccess(requestId));
  } catch (error) {
    yield put(signDocumentFailure(error.message || 'Failed to sign document'));
  }
}

// Decline signature request
function* declineSignatureRequestSaga(action) {
  const { requestId, reason } = action.payload;
  
  try {
    // Use mock API for now
    yield call(mockSignatureRequestsAPI.declineSignatureRequest, requestId, reason);
    yield put(declineSignatureRequestSuccess(requestId));
    
    // When backend is ready, use this instead:
    // const response = yield call(api.post, `${API_ENDPOINTS.DECLINE_SIGNATURE_REQUEST}/${requestId}`, { reason });
    // yield put(declineSignatureRequestSuccess(requestId));
  } catch (error) {
    yield put(declineSignatureRequestFailure(error.message || 'Failed to decline signature request'));
  }
}

// Watchers
function* watchFetchSignatureRequests() {
  yield takeLatest(FETCH_SIGNATURE_REQUESTS_REQUEST, fetchSignatureRequestsSaga);
}

function* watchViewSignatureDocument() {
  yield takeLatest(VIEW_SIGNATURE_DOCUMENT_REQUEST, viewSignatureDocumentSaga);
}

function* watchSignDocument() {
  yield takeLatest(SIGN_DOCUMENT_REQUEST, signDocumentSaga);
}

function* watchDeclineSignatureRequest() {
  yield takeLatest(DECLINE_SIGNATURE_REQUEST_REQUEST, declineSignatureRequestSaga);
}

function* signaturesSaga() {
  yield all([
    fork(watchFetchSignatureRequests),
    fork(watchViewSignatureDocument),
    fork(watchSignDocument),
    fork(watchDeclineSignatureRequest)
  ]);
}

export default signaturesSaga;
