// chatbotActions.js
import {
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  FETCH_SESSIONS_REQUEST,
  FETCH_SESSIONS_FAILURE,
  FETCH_SESSIONS_SUCCESS,
  FETCH_SESSION_MESSAGES_REQUEST, FETCH_SESSION_MESSAGES_SUCCESS, FETCH_SESSION_MESSAGES_FAILURE, START_NEW_CHAT,
} from "./actiontype";

// Send a message to the chatbot
export const sendMessage = (chatRequest) => ({
  type: SEND_MESSAGE_REQUEST,
  payload: chatRequest,
});

export const sendMessageSuccess = (response) => ({
  type: SEND_MESSAGE_SUCCESS,
  payload: response,
});

export const sendMessageFailure = (error) => ({
  type: SEND_MESSAGE_FAILURE,
  payload: error,
});

// fetch session to the chatbot
export const fetchSessions = () => ({
  type: FETCH_SESSIONS_REQUEST
});

export const fetchSessionsSuccess = (response) => ({
  type: FETCH_SESSIONS_SUCCESS,
  payload: response,
});

export const fetchSessionsFailure = (error) => ({
  type: FETCH_SESSIONS_FAILURE,
  payload: error,
});

// fetch sessionMessages to the chatbot
export const fetchSessionMessages = (payload) => ({
  type: FETCH_SESSION_MESSAGES_REQUEST,
  payload: payload,
});

export const fetchSessionMessagesSuccess = (response) => ({
  type: FETCH_SESSION_MESSAGES_SUCCESS,
  payload: response,
});

export const fetchSessionMessagesFailure = (error) => ({
  type: FETCH_SESSION_MESSAGES_FAILURE,
  payload: error,
});

export const startNewChatSession = (action) => ({
  type: START_NEW_CHAT,
});