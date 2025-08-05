import {
  FETCH_CLIENT_DOCUMENTS_REQUEST,
  FETCH_CLIENT_DOCUMENTS_SUCCESS,
  FETCH_CLIENT_DOCUMENTS_FAILURE,
  UPLOAD_CLIENT_DOCUMENT_REQUEST,
  UPLOAD_CLIENT_DOCUMENT_SUCCESS,
  UPLOAD_CLIENT_DOCUMENT_FAILURE,
  UPLOAD_CLIENT_DOCUMENT_PROGRESS,
  DOWNLOAD_CLIENT_DOCUMENT_REQUEST,
  DOWNLOAD_CLIENT_DOCUMENT_SUCCESS,
  DOWNLOAD_CLIENT_DOCUMENT_FAILURE,
  VIEW_CLIENT_DOCUMENT_REQUEST,
  VIEW_CLIENT_DOCUMENT_SUCCESS,
  VIEW_CLIENT_DOCUMENT_FAILURE,
  SIGN_CLIENT_DOCUMENT_REQUEST,
  SIGN_CLIENT_DOCUMENT_SUCCESS,
  SIGN_CLIENT_DOCUMENT_FAILURE,
  CLEAR_CLIENT_DOCUMENT_DATA,
  FETCH_CLIENT_VAULTS_REQUEST,
  FETCH_CLIENT_VAULTS_SUCCESS,
  FETCH_CLIENT_VAULTS_FAILURE,
  CREATE_CLIENT_VAULT_REQUEST,
  CREATE_CLIENT_VAULT_SUCCESS,
  CREATE_CLIENT_VAULT_FAILURE,
  SELECT_CLIENT_VAULT,
  CLEAR_SELECTED_CLIENT_VAULT
} from './actiontype';

const initialState = {
  documents: [],
  allDocuments: [], // Store all documents for filtering
  selectedDocument: null,
  documentContent: null,
  vaults: [],
  selectedVaultId: null,
  loading: false,
  loadingVaults: false,
  creatingVault: false,
  uploading: false,
  uploadProgress: {},
  downloading: false,
  signing: false,
  error: null,
  vaultsError: null,
  createVaultError: null,
  viewError: null,
  uploadError: null,
  downloadError: null,
  signError: null
};

const clientDocumentsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch client documents
    case FETCH_CLIENT_DOCUMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_CLIENT_DOCUMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        documents: action.payload,
        allDocuments: action.payload, // Store all documents
        error: null
      };
    case FETCH_CLIENT_DOCUMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Upload document
    case UPLOAD_CLIENT_DOCUMENT_REQUEST:
      return {
        ...state,
        uploading: true,
        uploadError: null
      };
    case UPLOAD_CLIENT_DOCUMENT_SUCCESS:
      return {
        ...state,
        uploading: false,
        documents: state.selectedVaultId === action.payload.vaultId || !state.selectedVaultId
          ? [...state.documents, action.payload]
          : state.documents,
        allDocuments: [...state.allDocuments, action.payload],
        uploadProgress: {
          ...state.uploadProgress,
          [action.payload.id]: 100
        },
        uploadError: null
      };
    case UPLOAD_CLIENT_DOCUMENT_FAILURE:
      return {
        ...state,
        uploading: false,
        uploadError: action.payload
      };
    case UPLOAD_CLIENT_DOCUMENT_PROGRESS:
      return {
        ...state,
        uploadProgress: {
          ...state.uploadProgress,
          [action.payload.fileId]: action.payload.progress
        }
      };

    // Download document
    case DOWNLOAD_CLIENT_DOCUMENT_REQUEST:
      return {
        ...state,
        downloading: true,
        downloadError: null
      };
    case DOWNLOAD_CLIENT_DOCUMENT_SUCCESS:
      return {
        ...state,
        downloading: false,
        downloadError: null
      };
    case DOWNLOAD_CLIENT_DOCUMENT_FAILURE:
      return {
        ...state,
        downloading: false,
        downloadError: action.payload
      };

    // View document
    case VIEW_CLIENT_DOCUMENT_REQUEST:
      return {
        ...state,
        selectedDocument: state.documents.find(doc => doc.id === action.payload) || null,
        documentContent: null,
        loading: true,
        viewError: null
      };
    case VIEW_CLIENT_DOCUMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        documentContent: action.payload,
        viewError: null
      };
    case VIEW_CLIENT_DOCUMENT_FAILURE:
      return {
        ...state,
        loading: false,
        viewError: action.payload
      };

    // Sign document
    case SIGN_CLIENT_DOCUMENT_REQUEST:
      return {
        ...state,
        signing: true,
        signError: null
      };
    case SIGN_CLIENT_DOCUMENT_SUCCESS:
      return {
        ...state,
        signing: false,
        documents: state.documents.map(doc =>
          doc.id === action.payload
            ? { ...doc, status: 'Signed', signedDate: new Date().toISOString() }
            : doc
        ),
        allDocuments: state.allDocuments.map(doc =>
          doc.id === action.payload
            ? { ...doc, status: 'Signed', signedDate: new Date().toISOString() }
            : doc
        ),
        signError: null
      };
    case SIGN_CLIENT_DOCUMENT_FAILURE:
      return {
        ...state,
        signing: false,
        signError: action.payload
      };

    // Clear document data
    case CLEAR_CLIENT_DOCUMENT_DATA:
      return {
        ...state,
        selectedDocument: null,
        documentContent: null,
        viewError: null
      };

    // Fetch client vaults
    case FETCH_CLIENT_VAULTS_REQUEST:
      return {
        ...state,
        loadingVaults: true,
        vaultsError: null
      };
    case FETCH_CLIENT_VAULTS_SUCCESS:
      return {
        ...state,
        loadingVaults: false,
        vaults: action.payload,
        vaultsError: null
      };
    case FETCH_CLIENT_VAULTS_FAILURE:
      return {
        ...state,
        loadingVaults: false,
        vaultsError: action.payload
      };

    // Create client vault
    case CREATE_CLIENT_VAULT_REQUEST:
      return {
        ...state,
        creatingVault: true,
        createVaultError: null
      };
    case CREATE_CLIENT_VAULT_SUCCESS:
      return {
        ...state,
        creatingVault: false,
        vaults: [...state.vaults, action.payload],
        createVaultError: null
      };
    case CREATE_CLIENT_VAULT_FAILURE:
      return {
        ...state,
        creatingVault: false,
        createVaultError: action.payload
      };

    // Select client vault
    case SELECT_CLIENT_VAULT:
      return {
        ...state,
        selectedVaultId: action.payload,
        // When selecting a vault, filter documents to show only those in the selected vault
        documents: state.allDocuments.filter(doc =>
          action.payload ? doc.vaultId === action.payload : true
        ),
        // Clear selected document when changing vaults
        selectedDocument: null,
        documentContent: null
      };

    // Clear selected vault
    case CLEAR_SELECTED_CLIENT_VAULT:
      return {
        ...state,
        selectedVaultId: null,
        documents: state.allDocuments,
        selectedDocument: null,
        documentContent: null
      };

    default:
      return state;
  }
};

export default clientDocumentsReducer;
