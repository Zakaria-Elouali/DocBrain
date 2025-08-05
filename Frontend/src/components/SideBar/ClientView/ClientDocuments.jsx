import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaUpload, FaDownload, FaSignature, FaSpinner, FaTimes,
  FaExclamationTriangle, FaFileAlt, FaFilePdf, FaFileWord,
  FaFileImage, FaFolderPlus, FaFolder, FaFolderOpen
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ClientDocumentsMain from './ClientDocumentsMain';
import {
  fetchClientDocumentsRequest,
  uploadClientDocumentWithVaultRequest,
  downloadClientDocumentRequest,
  viewClientDocumentRequest,
  signClientDocumentRequest,
  clearClientDocumentData,
  fetchClientVaultsRequest,
  createClientVaultRequest,
  selectClientVault,
  clearSelectedClientVault
} from '@/store/clientDocuments/action';

const ClientDocuments = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  // Component state
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateVaultModal, setShowCreateVaultModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newVaultName, setNewVaultName] = useState('');
  const [componentState, setComponentState] = useState({
    isReduxAvailable: true,
    isLoading: false,
    hasError: false,
    errorMessage: null
  });

  // Get data from Redux store
  let reduxState = {};
  try {
    reduxState = useSelector(state => state.clientDocumentsReducer || {});

    if (componentState.isReduxAvailable === false) {
      setComponentState(prev => ({ ...prev, isReduxAvailable: true }));
    }
  } catch (error) {
    console.error('Error accessing Redux store:', error);

    if (componentState.isReduxAvailable === true) {
      setComponentState(prev => ({
        ...prev,
        isReduxAvailable: false,
        hasError: true,
        errorMessage: t('The client documents feature is not fully initialized. Please try again later.')
      }));
    }
  }

  // Extract data from Redux state
  const {
    documents = [],
    documentContent = null,
    vaults = [],
    selectedVaultId = null,
    loading = false,
    loadingVaults = false,
    creatingVault = false,
    uploading = false,
    uploadProgress = {},
    downloading = false,
    signing = false,
    error = null,
    vaultsError = null,
    createVaultError = null,
    uploadError = null,
    downloadError = null,
    viewError = null,
    signError = null
  } = reduxState;

  // Fetch documents and vaults on component mount
  useEffect(() => {
    try {
      if (componentState.isReduxAvailable) {
        dispatch(fetchClientDocumentsRequest());
        dispatch(fetchClientVaultsRequest());
      }
    } catch (error) {
      console.error('Error dispatching fetch actions:', error);
      setComponentState(prev => ({
        ...prev,
        hasError: true,
        errorMessage: t('Failed to load documents. Please try again later.')
      }));
    }
  }, [dispatch, componentState.isReduxAvailable, t]);

  // Show error toasts when errors occur
  useEffect(() => {
    try {
      if (error) toast.error(`${t('Error')}: ${error}`);
      if (vaultsError) toast.error(`${t('Vaults error')}: ${vaultsError}`);
      if (createVaultError) toast.error(`${t('Create vault error')}: ${createVaultError}`);
      if (uploadError) toast.error(`${t('Upload error')}: ${uploadError}`);
      if (downloadError) toast.error(`${t('Download error')}: ${downloadError}`);
      if (viewError) toast.error(`${t('View error')}: ${viewError}`);
      if (signError) toast.error(`${t('Signature error')}: ${signError}`);

      if (componentState.hasError && componentState.errorMessage) {
        toast.error(`${t('Component error')}: ${componentState.errorMessage}`);
      }
    } catch (err) {
      console.error('Error showing toast notifications:', err);
    }
  }, [error, vaultsError, createVaultError, uploadError, downloadError, viewError, signError, componentState.hasError, componentState.errorMessage, t]);

  // Handle document view
  const handleViewDocument = useCallback((document) => {
    setSelectedDocument(document);
    dispatch(viewClientDocumentRequest(document.id));
  }, [dispatch]);

  // Handle document download
  const handleDownloadDocument = useCallback((document) => {
    dispatch(downloadClientDocumentRequest(document.id));
  }, [dispatch]);

  // Handle document signing
  const handleSignDocument = useCallback((document) => {
    // In a real implementation, you might show a signature pad or other UI
    // For now, we'll just simulate a signature with a timestamp
    const signatureData = {
      signedBy: t("Current User"),
      signatureDate: new Date().toISOString(),
      signatureMethod: t("Electronic")
    };

    dispatch(signClientDocumentRequest(document.id, signatureData));
  }, [dispatch, t]);

  // Handle document upload
  const handleUploadDocument = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(() => {
    if (selectedFile) {
      const metadata = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        uploadDate: new Date().toISOString()
      };

      dispatch(uploadClientDocumentWithVaultRequest(selectedFile, metadata, selectedVaultId));
      setShowUploadModal(false);
      setSelectedFile(null);
    }
  }, [dispatch, selectedFile, selectedVaultId]);

  // Handle vault selection
  const handleSelectVault = useCallback((vaultId) => {
    dispatch(selectClientVault(vaultId));
  }, [dispatch]);

  // Handle create vault
  const handleCreateVault = useCallback(() => {
    if (newVaultName.trim()) {
      dispatch(createClientVaultRequest({ name: newVaultName.trim() }));
      setShowCreateVaultModal(false);
      setNewVaultName('');
    }
  }, [dispatch, newVaultName]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setShowUploadModal(false);
    setShowCreateVaultModal(false);
    setSelectedFile(null);
    setNewVaultName('');
  }, []);

  // Render sidebar content
  const renderSidebarContent = () => {
    if (!componentState.isReduxAvailable) {
      return (
        <div className="client-documents-content">
          <div className="client-documents-header">
            <h2>{t('Document Vaults')}</h2>
          </div>
          <div className="error-message">
            <FaExclamationTriangle size={24} />
            <p>{componentState.errorMessage || t('Error loading document vaults')}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="client-documents-content">
        <div className="client-documents-header">
          <h2>{t('Document Vaults')}</h2>
          {/* Create Vault button moved below the title for better layout */}
          <button
            className="create-vault-button"
            onClick={() => setShowCreateVaultModal(true)}
            disabled={creatingVault}
          >
            {creatingVault ? <FaSpinner className="spinner" /> : <FaFolderPlus />} {t('New Vault')}
          </button>
        </div>

        {loadingVaults || componentState.isLoading ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner" /> {t('Loading vaults...')}
          </div>
        ) : vaultsError || componentState.hasError ? (
          <div className="error-message">
            {vaultsError || componentState.errorMessage || t('Error loading vaults')}
          </div>
        ) : vaults && vaults.length > 0 ? (
          <div className="vaults-list">
            <div
              className={`vault-item ${!selectedVaultId ? 'selected' : ''}`}
              onClick={() => handleSelectVault(null)}
            >
              <div className="vault-icon">
                <FaFolder />
              </div>
              <div className="vault-info">
                <span className="vault-name">{t('All Documents')}</span>
              </div>
            </div>

            {vaults.map(vault => (
              <div
                key={vault.id}
                className={`vault-item ${selectedVaultId === vault.id ? 'selected' : ''}`}
                onClick={() => handleSelectVault(vault.id)}
              >
                <div className="vault-icon">
                  {selectedVaultId === vault.id ? <FaFolderOpen /> : <FaFolder />}
                </div>
                <div className="vault-info">
                  <span className="vault-name">{vault.name}</span>
                  <span className="vault-date">{new Date(vault.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-vaults">
            <h3>{t('No Vaults Found')}</h3>
            <p>{t("You don't have any document vaults yet. Create your first vault to organize your documents.")}</p>
            <button
              className="create-first-vault-button"
              onClick={() => setShowCreateVaultModal(true)}
            >
              <FaFolderPlus /> {t('Create Your First Vault')}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div className="client-documents-container">
        <div className="client-documents-wrapper">
          {renderSidebarContent()}
        </div>
      </div>

      {/* Main Area */}
      <ClientDocumentsMain
        documents={documents}
        selectedDocument={selectedDocument}
        documentContent={documentContent}
        selectedVaultId={selectedVaultId}
        loading={loading}
        downloading={downloading}
        signing={signing}
        handleViewDocument={handleViewDocument}
        handleDownloadDocument={handleDownloadDocument}
        handleSignDocument={handleSignDocument}
        handleUploadDocument={handleUploadDocument}
        clearClientDocumentData={() => {
          setSelectedDocument(null);
          dispatch(clearClientDocumentData());
        }}
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="client-documents-upload-modal">
          <div className="client-documents-upload-modal-content">
            <div className="client-documents-upload-modal-header">
              <h3>{t('Upload Document')}</h3>
              <button className="client-documents-upload-modal-close-button" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <div className="client-documents-upload-modal-body">
              <p>
                {selectedVaultId
                  ? t('Select a document to upload to the selected vault:')
                  : t('Select a document to upload to your account:')}
              </p>

              {!selectedFile ? (
                <div
                  className="client-documents-upload-modal-dropzone"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="client-documents-upload-modal-icon">
                    <FaUpload />
                  </div>
                  <h4>{t('Drag & Drop or Click to Browse')}</h4>
                  <p>{t('Upload PDF, Word, Text, or Image files')}</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </div>
              ) : (
                <div className="client-documents-upload-modal-selected-file">
                  <div className="client-documents-upload-modal-file-icon">
                    {selectedFile.type.includes('pdf') ? <FaFilePdf /> :
                     selectedFile.type.includes('word') || selectedFile.type.includes('doc') ? <FaFileWord /> :
                     selectedFile.type.includes('image') || selectedFile.type.includes('jpg') || selectedFile.type.includes('jpeg') || selectedFile.type.includes('png') ? <FaFileImage /> :
                     <FaFileAlt />}
                  </div>
                  <div className="client-documents-upload-modal-file-info">
                    <div className="client-documents-upload-modal-file-name">{selectedFile.name}</div>
                    <div className="client-documents-upload-modal-file-size">{Math.round(selectedFile.size / 1024)} KB</div>
                  </div>
                  <button
                    className="client-documents-upload-modal-remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}

              <div className="client-documents-upload-modal-file-types">
                <p>{t('Supported file types: PDF, Word, Text, Images')}</p>
              </div>
            </div>
            <div className="client-documents-upload-modal-footer">
              <button
                className="client-documents-upload-modal-cancel-button"
                onClick={handleCloseModal}
              >
                {t('Cancel')}
              </button>
              <button
                className="client-documents-upload-modal-upload-button"
                onClick={selectedFile ? handleFileUpload : () => fileInputRef.current.click()}
                disabled={uploading}
              >
                {uploading ? <FaSpinner className="client-documents-upload-modal-spinner" /> : <FaUpload />}
                {selectedFile ? t('Upload Document') : t('Select File')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Vault Modal */}
      {showCreateVaultModal && (
        <div className="client-documents-upload-modal">
          <div className="client-documents-upload-modal-content">
            <div className="client-documents-upload-modal-header">
              <h3>{t('Create New Vault')}</h3>
              <button className="client-documents-upload-modal-close-button" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <div className="client-documents-upload-modal-body">
              <p>{t('Enter a name for your new document vault:')}</p>

              <div className="client-documents-create-vault-input">
                <input
                  type="text"
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  placeholder={t('Vault Name')}
                  autoFocus
                />
              </div>
            </div>
            <div className="client-documents-upload-modal-footer">
              <button
                className="client-documents-upload-modal-cancel-button"
                onClick={handleCloseModal}
              >
                {t('Cancel')}
              </button>
              <button
                className="client-documents-upload-modal-upload-button"
                onClick={handleCreateVault}
                disabled={creatingVault || !newVaultName.trim()}
              >
                {creatingVault ? <FaSpinner className="client-documents-upload-modal-spinner" /> : <FaFolderPlus />}
                {t('Create Vault')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientDocuments;
