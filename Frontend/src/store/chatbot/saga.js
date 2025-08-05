import { takeLatest, put, call } from "redux-saga/effects";
import {
  SEND_MESSAGE_REQUEST,
  FETCH_SESSIONS_REQUEST,
  FETCH_SESSION_MESSAGES_REQUEST
} from "./actiontype";
import {
  sendMessageFailure,
  sendMessageSuccess,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  fetchSessionMessagesSuccess,
  fetchSessionMessagesFailure
} from "./action";
import {
  ASK_DOCUMENT,
  ASK_GENERAL,
  GET_SESSIONS,
  GET_SESSIONS_MESSAGES
} from "@/helpers/url_helper";
import {APIClient} from "@/helpers/api_helper";
const api = new APIClient();


// API call to send a message to the AI model
function* sendMessageSaga(action) {
  try {
    const { documentId, prompt } = action.payload;
    console.log("payload: ", action.payload);
    const url = documentId ? ASK_DOCUMENT : ASK_GENERAL;
    // Send the message and file data to the AI model
    const response = yield call(api.post, url, action.payload);
      console.log("response-->",response)
    // Dispatch success action with the AI response
    yield put(sendMessageSuccess(response));
  } catch (error) {
    // Dispatch failure action with the error message
    yield put(sendMessageFailure(error.message));
  }
}

// API call to fetch chatbot sessions
function* fetchSessionsSaga(action) {
  try {
    console.log("SAGA--> Fetching chatbot sessions...");
    const response = yield call(api.get, GET_SESSIONS);
    const sessionsData = response || response.data || [];
    yield put(fetchSessionsSuccess(sessionsData));
  } catch (error) {
    console.log("error-->",error)
    yield put(fetchSessionsFailure(error.message));
  }
}

// API call to fetch session messages
function* fetchSessionMessagesSaga(action) {
  try {
    console.log("payload: ", action.payload);
    const apiUrl = GET_SESSIONS_MESSAGES.replace('{sessionId}', action.payload);

    const response = yield call(api.get, apiUrl, action.payload);
    console.log("response-->",response)
    yield put(fetchSessionMessagesSuccess(response));
  } catch (error) {
    // Dispatch failure action with the error message
    yield put(fetchSessionMessagesFailure(error.message));
  }
}

// Root saga
export default function* chatbotSaga() {
  yield takeLatest(SEND_MESSAGE_REQUEST, sendMessageSaga);
  yield takeLatest(FETCH_SESSIONS_REQUEST, fetchSessionsSaga);
  yield takeLatest(FETCH_SESSION_MESSAGES_REQUEST, fetchSessionMessagesSaga);
}