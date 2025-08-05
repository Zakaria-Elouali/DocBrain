// actions.js
import {
  CONFIRM_EMAIL_REQUEST,
  CONFIRM_EMAIL_SUCCESS,
  CONFIRM_EMAIL_FAILURE,
  RESEND_CONFIRMATION_EMAIL,
} from './actionTypes';

// Action to initiate email confirmation
export const confirmEmailRequest = (code) => ({
  type: CONFIRM_EMAIL_REQUEST,
  payload: code,
});

// Action to RESEND email confirmation
export const resendConfirmationEmail = (email) => ({
  type: RESEND_CONFIRMATION_EMAIL,
  payload: email,
});

// Action on successful confirmation
export const confirmEmailSuccess = (message) => ({
  type: CONFIRM_EMAIL_SUCCESS,
  payload: message,
});

// Action on failed confirmation
export const confirmEmailFailure = (error) => ({
  type: CONFIRM_EMAIL_FAILURE,
  payload: error,
});
