import {
  FETCH_SIGNATURE_REQUESTS_REQUEST,
  FETCH_SIGNATURE_REQUESTS_SUCCESS,
  FETCH_SIGNATURE_REQUESTS_FAILURE,
  VIEW_SIGNATURE_DOCUMENT_REQUEST,
  VIEW_SIGNATURE_DOCUMENT_SUCCESS,
  VIEW_SIGNATURE_DOCUMENT_FAILURE,
  SIGN_DOCUMENT_REQUEST,
  SIGN_DOCUMENT_SUCCESS,
  SIGN_DOCUMENT_FAILURE,
  DECLINE_SIGNATURE_REQUEST_REQUEST,
  DECLINE_SIGNATURE_REQUEST_SUCCESS,
  DECLINE_SIGNATURE_REQUEST_FAILURE,
  CLEAR_SIGNATURE_DOCUMENT_DATA
} from './actiontype';

const initialState = {
  requests: [],
  selectedRequest: null,
  documentContent: null,
  loading: false,
  signing: false,
  declining: false,
  error: null,
  viewError: null,
  signError: null,
  declineError: null
};

const signaturesReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch signature requests
    case FETCH_SIGNATURE_REQUESTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_SIGNATURE_REQUESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        requests: action.payload,
        error: null
      };
    case FETCH_SIGNATURE_REQUESTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // View signature document
    case VIEW_SIGNATURE_DOCUMENT_REQUEST:
      return {
        ...state,
        selectedRequest: state.requests.find(req => req.id === action.payload) || null,
        documentContent: null,
        loading: true,
        viewError: null
      };
    case VIEW_SIGNATURE_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        documentContent: action.payload,
        viewError: null
      };
    case VIEW_SIGNATURE_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        viewError: action.payload
      };

    // Sign document
    case SIGN_DOCUMENT_REQUEST:
      return {
        ...state,
        signing: true,
        signError: null
      };
    case SIGN_DOCUMENT_SUCCESS:
      return {
        ...state,
        signing: false,
        requests: state.requests.map(req => 
          req.id === action.payload 
            ? { ...req, status: 'Signed', signedDate: new Date().toISOString() } 
            : req
        ),
        signError: null
      };
    case SIGN_DOCUMENT_FAILURE:
      return {
        ...state,
        signing: false,
        signError: action.payload
      };

    // Decline signature request
    case DECLINE_SIGNATURE_REQUEST_REQUEST:
      return {
        ...state,
        declining: true,
        declineError: null
      };
    case DECLINE_SIGNATURE_REQUEST_SUCCESS:
      return {
        ...state,
        declining: false,
        requests: state.requests.map(req => 
          req.id === action.payload 
            ? { ...req, status: 'Declined', declinedDate: new Date().toISOString() } 
            : req
        ),
        declineError: null
      };
    case DECLINE_SIGNATURE_REQUEST_FAILURE:
      return {
        ...state,
        declining: false,
        declineError: action.payload
      };

    // Clear signature document data
    case CLEAR_SIGNATURE_DOCUMENT_DATA:
      return {
        ...state,
        selectedRequest: null,
        documentContent: null,
        viewError: null
      };

    default:
      return state;
  }
};

export default signaturesReducer;
