import React, { useState } from 'react';
import { FaDownload, FaSignature, FaSpinner, FaTimes, FaSearch, FaFilter, FaSort, FaEye, FaFileAlt, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaUpload } from 'react-icons/fa';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const ClientDocumentsMain = ({
  documents = [],
  selectedDocument,
  documentContent,
  selectedVaultId,
  loading,
  downloading,
  signing,
  handleViewDocument,
  handleDownloadDocument,
  handleSignDocument,
  handleUploadDocument,
  clearClientDocumentData
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (!fileType) return <FaFileAlt />;

    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FaFilePdf />;
    if (type.includes('image') || type.includes('jpg') || type.includes('jpeg') || type.includes('png')) return <FaFileImage />;
    if (type.includes('word') || type.includes('doc')) return <FaFileWord />;
    if (type.includes('excel') || type.includes('sheet') || type.includes('xls')) return <FaFileExcel />;
    return <FaFileAlt />;
  };

  // Filter and sort documents
  const filteredAndSortedDocuments = React.useMemo(() => {
    if (!documents || !Array.isArray(documents)) return [];

    // Filter by search term and type
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' ||
                         (filterType === 'signed' && doc.status === 'Signed') ||
                         (filterType === 'pending' && doc.status === 'Pending') ||
                         (filterType === 'rejected' && doc.status === 'Rejected');
      return matchesSearch && matchesType;
    });

    // Sort documents
    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'date') {
        const dateA = new Date(a.date || a.uploadDate);
        const dateB = new Date(b.date || b.uploadDate);
        comparison = dateA - dateB;
      } else if (sortBy === 'status') {
        comparison = (a.status || '').localeCompare(b.status || '');
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [documents, searchTerm, filterType, sortBy, sortDirection]);

  // Toggle sort direction when clicking the same sort option
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  // Render document content
  const renderDocumentContent = () => {
    if (!selectedDocument || !documentContent) {
      return (
        <div className="client-documents-main-placeholder">
          <h2>{t('Select a document to view')}</h2>
          <p>{t('Click on a document from the list to view its contents here.')}</p>
        </div>
      );
    }

    return (
      <>
        <div className="client-documents-main-viewer-header">
          <div className="client-documents-main-title">
            {getFileIcon(documentContent.type)}
            <h3>{selectedDocument.name}</h3>
          </div>
          <div className="client-documents-main-actions">
            <button
              onClick={() => handleDownloadDocument(selectedDocument)}
              title="Download"
              disabled={downloading}
              className="client-documents-main-action-button"
            >
              {downloading ? <FaSpinner className="client-documents-main-spinner" /> : <FaDownload />} {t('Download')}
            </button>
            {selectedDocument.requiresSignature && selectedDocument.status !== 'Signed' && (
              <button
                onClick={() => handleSignDocument(selectedDocument)}
                title="Sign"
                disabled={signing}
                className="client-documents-main-action-button"
              >
                {signing ? <FaSpinner className="client-documents-main-spinner" /> : <FaSignature />} {t('Sign Document')}
              </button>
            )}
            <button
              className="client-documents-main-close-button"
              onClick={clearClientDocumentData}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="client-documents-main-viewer-content">
          <div className="client-documents-main-preview">
            {typeof documentContent === 'string' ? (
              <pre>{documentContent}</pre>
            ) : (
              <div className="client-documents-main-info-display">
                <div className="client-documents-main-metadata">
                  <div className="client-documents-main-metadata-item">
                    <span className="client-documents-main-label">Document Type:</span>
                    <span className="client-documents-main-value">{documentContent.type}</span>
                  </div>
                  <div className="client-documents-main-metadata-item">
                    <span className="client-documents-main-label">Size:</span>
                    <span className="client-documents-main-value">{Math.round(documentContent.size / 1024)} KB</span>
                  </div>
                  <div className="client-documents-main-metadata-item">
                    <span className="client-documents-main-label">Created:</span>
                    <span className="client-documents-main-value">{new Date(documentContent.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="client-documents-main-metadata-item">
                    <span className="client-documents-main-label">Status:</span>
                    <span className={`client-documents-main-value status-${documentContent.status?.toLowerCase()}`}>{documentContent.status}</span>
                  </div>
                </div>

                {documentContent.signedBy && (
                  <div className="client-documents-main-signature-info">
                    <h4>Signature Information</h4>
                    <div className="client-documents-main-metadata-item">
                      <span className="client-documents-main-label">Signed by:</span>
                      <span className="client-documents-main-value">{documentContent.signedBy}</span>
                    </div>
                    <div className="client-documents-main-metadata-item">
                      <span className="client-documents-main-label">Signed on:</span>
                      <span className="client-documents-main-value">{new Date(documentContent.signatureDate).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Render document grid/list view
  const renderDocumentsView = () => {
    if (loading) {
      return (
        <div className="client-documents-main-loading-container">
          <FaSpinner className="client-documents-main-spinner" />
          <p>{t('Loading documents...')}</p>
        </div>
      );
    }

    if (filteredAndSortedDocuments.length === 0) {
      return (
        <div className="client-documents-main-no-documents">
          <h3>{t('No Documents Found')}</h3>
          <p>
            {searchTerm || filterType !== 'all'
              ? t('Try adjusting your search or filters to find what you\'re looking for.')
              : t('You don\'t have any documents in this vault yet.')}
          </p>
          <button
            className="client-documents-main-upload-button"
            onClick={handleUploadDocument}
          >
            <FaUpload /> {t('Upload Document')}
          </button>
        </div>
      );
    }

    return (
      <div className={`client-documents-main-${viewMode}-view`}>
        {filteredAndSortedDocuments.map(doc => (
          <div
            key={doc.id}
            className={`client-documents-main-item ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
            onClick={() => handleViewDocument(doc)}
          >
            <div className="client-documents-main-icon">
              {getFileIcon(doc.type)}
            </div>
            <div className="client-documents-main-info">
              <span className="client-documents-main-name">{doc.name}</span>
              <span className="client-documents-main-date">{format(new Date(doc.date || doc.uploadDate), 'MMM d, yyyy')}</span>
              <span className={`client-documents-main-status status-${doc.status?.toLowerCase()}`}>{doc.status}</span>
            </div>
            <div className="client-documents-main-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDocument(doc);
                }}
                title="View"
                className="client-documents-main-view-button"
              >
                <FaEye />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadDocument(doc);
                }}
                title="Download"
                disabled={downloading}
                className="client-documents-main-download-button"
              >
                {downloading && doc.id === selectedDocument?.id ? <FaSpinner className="client-documents-main-spinner" /> : <FaDownload />}
              </button>
              {doc.requiresSignature && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSignDocument(doc);
                  }}
                  title="Sign"
                  disabled={signing}
                  className={`client-documents-main-sign-button ${doc.status === 'Signed' ? 'signed' : ''}`}
                >
                  {signing && doc.id === selectedDocument?.id ? <FaSpinner className="client-documents-main-spinner" /> : <FaSignature />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="client-documents-main-container">
      <div className="client-documents-main-wrapper">
        <div className="client-documents-main-content">
          <div className="client-documents-main-toolbar">
            <div className="client-documents-main-search-filter">
              <div className="client-documents-main-search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder={t('Search documents...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="client-documents-main-filter-dropdown">
                <FaFilter />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">{t('All Documents')}</option>
                  <option value="signed">{t('Signed')}</option>
                  <option value="pending">{t('Pending')}</option>
                  <option value="rejected">{t('Rejected')}</option>
                </select>
              </div>
            </div>
            <div className="client-documents-main-view-sort-options">
              <div className="client-documents-main-sort-dropdown">
                <FaSort />
                <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                  <option value="date">{t('Date')}</option>
                  <option value="name">{t('Name')}</option>
                  <option value="status">{t('Status')}</option>
                </select>
                <button
                  className="client-documents-main-sort-direction"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
              </div>
              <div className="client-documents-main-view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  {t('Grid')}
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  {t('List')}
                </button>
              </div>
            </div>
            {/* Upload button moved outside of view-sort-options for better spacing */}
            <button
              className="client-documents-main-upload-button"
              onClick={handleUploadDocument}
            >
              <FaUpload /> {t('Upload')}
            </button>
          </div>

          <div className="client-documents-main-documents-container">
            {selectedDocument && documentContent ? (
              renderDocumentContent()
            ) : (
              renderDocumentsView()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDocumentsMain;
