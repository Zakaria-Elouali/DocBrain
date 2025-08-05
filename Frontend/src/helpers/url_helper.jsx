// Authentication Api
export const LOGIN = "/auth/login";
export const SIGNUP = "/auth/signup";
export const LOGOUT = "/logout";
export const EMAILCONFIRMATION = "/auth/confirmaccount";
export const RESENDEMAILCONFIRMATION = "/auth/resend-token";

// file  Api
export const GET_FILES = "/getAllDocuments"
export const GET_FILES_METADATA_BY_FOLDER_ID = "/files/{folderId}/metadata"
export const GET_ALL_FILES_METADATA = "/files/all/metadata"
export const GET_FILE_DATA_BY_FILE_ID = "/files/{documentId}/file-data"
export const UPLOAD_FILES = "/uploadfile"
export const CREATE_FILE = "/createfile"
export const RENAME_FILE = "/renamefile/{fileId}"
export const UPDATE_FILE = "/replaceDocument"
export const UPDATE_FILE_CONTENT = "/files/{fileId}/content"
export const DELETE_FILE = "/deletefile"


//folder Api
export const GET_FOLDERS = "/folders"
export const CREATE_FOLDER = "/folders"
export const UPDATE_FOLDER = "/folders/{folderId}"
export const DELETE_FOLDER = "/folders/{folderId}"

//Appointments  Api
export const GET_APPOINTMENTS_API = "/appointments"
export const ADD_APPOINTMENT_API = "/appointments"
export const UPDATE_APPOINTMENT_API = "/appointments/{appointmentId}"
export const DELETE_APPOINTMENT_API = "/appointments/{appointmentId}"

// Users (employee)
export const GET_EMPLOYEES = "/employees";
export const ADD_EMPLOYEE = "/employees";
export const UPDATE_EMPLOYEE = "/employees/{employeeId}";
export const DELETE_EMPLOYEE = "/employees/{employeeId}";
// Users (client)
export const GET_CLIENTS = "/clients";
export const ADD_CLIENT = "/clients";
export const UPDATE_CLIENT = "/clients/{clientId}";
export const DELETE_CLIENT = "/clients/{clientId}";
// User (profile)
export const GET_USER_PROFILE = "/profile";
export const UPDATE_USER_PROFILE = "/profile";
export const UPDATE_USER_PASSWORD = "/profile/change-password";

//ROLES
export const FETCH_ROLES_API = '/roles';
export const ADD_ROLE_API = '/roles';
export const UPDATE_ROLE_PERMISSIONS_API = '/api/roles/{roleId}/permissions';
export const FETCH_PERMISSIONS_API = '/api/permissions';

//CHATBOT
export const ASK_DOCUMENT = "/chat/withDocument";
export const GET_SESSIONS = "/chat/sessions";
export const GET_SESSIONS_MESSAGES = "/chat/sessions/{sessionId}/messages";
export const GET_DOCUMENT_MESSAGES = "/chat/messages/{documentId}";
export const ASK_GENERAL = "/chat/general";


//Enums
export const ENUMS = "/i18n/enums";



export const SPM = "/spm";

// Invoice API
export const GET_INVOICES = "/invoices";
export const GET_INVOICE_BY_ID = "/invoices/{invoiceId}";
export const GET_INVOICE_BY_NUMBER = "/invoices/number/{number}";
export const ADD_INVOICE = "/invoices";
export const UPDATE_INVOICE = "/invoices/{invoiceId}";
export const DELETE_INVOICE = "/invoices/{invoiceId}";
export const GENERATE_INVOICE_PDF = "/invoices/{invoiceId}/pdf";
export const SAVE_INVOICE_TO_APP = "/invoices/save-to-app";

// Advanced Invoice API
export const GET_INVOICE_ANALYTICS = "/api/invoices/analytics";
export const GET_INVOICE_ANALYTICS_DATE_RANGE = "/api/invoices/analytics/date-range";
export const BULK_DELETE_INVOICES = "/api/invoices/bulk-delete";
export const BULK_UPDATE_INVOICE_STATUS = "/api/invoices/bulk-status";
export const DUPLICATE_INVOICE = "/api/invoices/{id}/duplicate";
export const SEND_INVOICE_EMAIL = "/api/invoices/{id}/send-email";
export const EXPORT_INVOICES = "/api/invoices/export";

// User Interaction
export const INTERACTION_LIKE = "/interaction/like";
export const INTERACTION_GET_LIKE = "/interaction/get_like";
export const INTERACTION_DISLIKE = "/interaction/dislike";
export const INTERACTION_USER_LIKES_BY_ENTITY_NAME =
  "/interaction/get_user_likes_by_entity_name";
export const INTERACTION_COUNT_LIKES_BY_ENTITY_RECORD =
  "/interaction/count_likes_by_entity_record";
