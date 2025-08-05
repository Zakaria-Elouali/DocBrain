// saga.js
import { takeEvery, call, put } from 'redux-saga/effects';
import {
  confirmEmailSuccess,
  confirmEmailFailure,
} from './actions';
import {APIClient} from "../../../helpers/api_helper";
import {EMAILCONFIRMATION, LOGIN, RESENDEMAILCONFIRMATION} from "../../../helpers/url_helper";
import {CONFIRM_EMAIL_REQUEST, RESEND_CONFIRMATION_EMAIL} from "./actionTypes";
import {apiError} from "../login/actions";
const api = new APIClient();

// Worker saga: handles the email confirmation process
function* confirmEmailRequest(action) {
  try {
    console.log("payload ==>" + action.payload);
    // Make an API call to confirm the email
    const response = yield call(api.post, EMAILCONFIRMATION,
        {
          email: action.payload.email,
          ctoken: action.payload.confirmation_code
    });
    yield put(confirmEmailSuccess(response.message));
    window.location.href = "/login";

  } catch (error) {
    yield put(confirmEmailFailure(error.message || 'Failed to confirm email'));
  }
}
function* resendConfirmationEmail(action) {
  try {
    // Make an API call to confirm the email
    const response = yield call(api.post, RESENDEMAILCONFIRMATION, {email: action.payload});
    console.log('response:::' + response);
    //using confirmEmailSuccess here because it just handel success response we don't need to create resendConfirmEmailSuccess
    yield put(confirmEmailSuccess(response.message));
      // if (!response.ok) {
      //   yield put(apiError(response));
      // }
  } catch (error) {
    console.log('error:::' + error);
    //using confirmEmailFailure here because it just handel FAILURE response we don't need to create resendConfirmEmailFailure
    yield put(confirmEmailFailure(error.message || 'Failed to resend email'));
  }
}

function* emailConfirmationSaga() {
  yield takeEvery(CONFIRM_EMAIL_REQUEST, confirmEmailRequest);
  yield takeEvery(RESEND_CONFIRMATION_EMAIL, resendConfirmationEmail);
}
// Watcher saga: watches for CONFIRM_EMAIL_REQUEST actions
export default emailConfirmationSaga;
