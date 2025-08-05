import { all, fork, take, call, spawn, cancel } from "redux-saga/effects";
//layout
import LayoutSaga from "./layouts/saga";
//Auth
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import invoiceSaga from "./invoices/saga";

// Other imports...
import chatbotSaga from "./chatbot/saga";
import UserSaga from "@/store/users/saga";
import {rolesSaga} from "@/store/roles/saga";
import clientDocumentsSaga from "./clientDocuments/saga";
import signaturesSaga from "./signatures/saga";

// Import necessary action types
import { LOGIN_SUCCESS, LOGOUT_USER, LOGOUT_USER_SUCCESS } from "./auth/login/actionTypes";
import emailConfirmationSaga from "@/store/auth/emailconfirmation/saga";
import enumSaga from "@/store/enums/saga";
import fileFolderSaga from "@/store/fileManagement/saga";
import {AppointmentsSaga} from "@/store/calendar/saga";

// This function handles the chatbot saga lifecycle
function* manageChatbotSaga() {
  while (true) {
    // Wait for successful login before starting chatbot saga
    yield take(LOGIN_SUCCESS);
    console.log("User logged in, starting chatbot saga");
    // Start the chatbot saga and get its task reference
    const chatbotTask = yield fork(chatbotSaga);
    // Wait for logout action
    yield take([LOGOUT_USER, LOGOUT_USER_SUCCESS]);
    console.log("User logged out, cancelling chatbot saga");
    // Cancel the chatbot saga when user logs out
    yield cancel(chatbotTask);
  }
}

export default function* rootSaga() {
  try {
    yield all([
      //public
      fork(LayoutSaga),
      fork(AccountSaga),
      fork(AuthSaga),
      fork(ForgetSaga),
      fork(ProfileSaga),
      fork(emailConfirmationSaga),
      fork(enumSaga),

      fork(fileFolderSaga),
      fork(AppointmentsSaga),
      // Don't fork chatbotSaga directly here
      fork(chatbotSaga), //<-- Remove this line
      fork(UserSaga),
      fork(rolesSaga),
      fork(invoiceSaga),
      fork(clientDocumentsSaga),
      fork(signaturesSaga),

      // Instead, fork the manager saga that will handle the chatbot saga lifecycle
      // fork(manageChatbotSaga),
    ]);
  } catch (e) {
    console.error('Error in rootSaga:', e);
  }
}