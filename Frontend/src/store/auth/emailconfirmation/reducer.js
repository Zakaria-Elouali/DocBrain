// reducer.js
import {
  CONFIRM_EMAIL_REQUEST,
  CONFIRM_EMAIL_SUCCESS,
  CONFIRM_EMAIL_FAILURE,
    RESEND_CONFIRMATION_EMAIL
} from './actionTypes';

const initialState = {
  loading: false,
  success: null,
  error: null,
};

const emailConfirmation = (state = initialState, action) => {
  switch (action.type) {
    case CONFIRM_EMAIL_REQUEST:
      return { ...state, loading: true, error: null, success: null };
    case RESEND_CONFIRMATION_EMAIL:
      return { ...state, loading: true, error: null, success: null };
    case CONFIRM_EMAIL_SUCCESS:
      return { ...state, loading: false, success: action.payload, error: null };
    case CONFIRM_EMAIL_FAILURE:
      return { ...state, loading: false, error: action.payload, success: null };
    default:
      return state;
  }
};

export default emailConfirmation;
