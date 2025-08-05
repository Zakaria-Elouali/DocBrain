import { combineReducers } from "redux"; // Front
import Layout from "./layouts/reducer"; // Authentication
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer"; // Dashboard Ecommerce
import Enums from "./enums/reducer";
import emailConfirmation from "./auth/emailconfirmation/reducer";
import fileFolderReducer from "./fileManagement/reducer";
import appointmentReducer from "./calendar/reducer";
import chatbotReducer from "./chatbot/reducer";
import UserReducer from "@/store/users/reducer";
import rolesReducer from "@/store/roles/reducer";
import LoginReducer from "./auth/login/reducer";
import invoiceReducer from "./invoices/reducer";
import clientDocumentsReducer from "./clientDocuments/reducer";
import signaturesReducer from "./signatures/reducer";
// import userInteraction from "./userInteraction/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  LoginReducer,
  Account,
  ForgetPassword,
  Profile,
  UserReducer,
  rolesReducer,
  Enums,
  emailConfirmation,
  fileFolderReducer,
  appointmentReducer,
  chatbotReducer,
  invoiceReducer,
  clientDocumentsReducer,
  signaturesReducer,
  // userInteraction,
});

export default rootReducer;
