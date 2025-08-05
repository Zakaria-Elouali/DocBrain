import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor';

const FileViewer = ({ file, fileData, onClose, isSidebarOpen }) => {
    const [fileContent, setFileContent] = useState(null);
    const [pdfError, setPdfError] = useState(null);

    useEffect(() => {
        console.log('FileViewer useEffect - file:', file);
        console.log('FileViewer useEffect - fileData:', fileData);
        console.log('FileViewer useEffect - file.type:', file.type);

        if (fileData) {
            handleFileData(fileData, file.type);
        } else {
            console.log('FileViewer - No fileData available yet');
            // Show loading state or placeholder
            setFileContent(
                <div className="loading-message">
                    <p>Loading file content...</p>
                </div>
            );
        }
    }, [fileData, file.type]);

    const validatePdfData = (data) => {
        try {
            const binaryData = atob(data.replace(/^data:.*?;base64,/, ''));
            const firstBytes = binaryData.slice(0, 4);
            return firstBytes.startsWith('%PDF');
        } catch (error) {
            console.error('PDF validation error:', error);
            return false;
        }
    };

    const handleFileData = (data, type) => {
        console.log('FileViewer handleFileData - data:', data ? 'exists' : 'missing');
        console.log('FileViewer handleFileData - type:', type);

        // Ensure we have a valid type - use contentType as fallback
        const fileType = type || file.contentType || 'text/plain';
        console.log('FileViewer handleFileData - using fileType:', fileType);

        let formattedData;
        try {
            formattedData = data.startsWith('data:')
                ? data
                : `data:${fileType};base64,${data.trim()}`;

            if (fileType === 'application/pdf' && !validatePdfData(data)) {
                const error = new Error('Invalid PDF data format');
                console.error('PDF Validation Error:', error);
                setPdfError(error);
                toast.error('The file appears to be corrupted or not a valid PDF');
                return;
            }

            switch (fileType) {
                case 'application/pdf':
                    setPdfError(null);
                    setFileContent(
                        <>
                            <div className="compact-header">
                                <span className="file-name">{file.name}</span>
                                <button
                                    onClick={onClose}
                                    className="close-button"
                                    aria-label="Close viewer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <iframe
                                src={`${formattedData}#toolbar=0`}
                                // src={formattedData}
                                className="pdf-iframe"
                                title={file.name}
                            />
                        </>
                    );
                    break;

                case 'text/plain':
                    try {
                        const text = atob(data);
                        setFileContent(
                            <>
                                <div className="compact-header">
                                    <span className="file-name">{file.name}</span>
                                    <button
                                        onClick={onClose}
                                        className="close-button"
                                        aria-label="Close viewer"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <pre className="text-content">{text}</pre>
                            </>
                        );
                    } catch (error) {
                        console.error('Text Decode Error:', error);
                        toast.error('Failed to decode text file');
                    }
                    break;

                case 'text/markdown':
                    console.log('FileViewer - Rendering markdown editor');
                    // For markdown files, use the MarkdownEditor component
                    setFileContent(
                        <MarkdownEditor
                            file={file}
                            fileData={data}
                            onClose={onClose}
                            key={Date.now()} // Add key to force re-render
                        />
                    );
                    break;

                case 'image/jpeg':
                case 'image/png':
                case 'image/gif':
                    setFileContent(
                        <>
                            <div className="compact-header">
                                <span className="file-name">{file.name}</span>
                                <button
                                    onClick={onClose}
                                    className="close-button"
                                    aria-label="Close viewer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <img
                                src={formattedData}
                                alt={file.name}
                                style={{ maxWidth: '100%', maxHeight: '80vh' }}
                                onError={() => toast.error('Failed to load image')}
                            />
                        </>
                    );
                    break;

                default:
                    console.log(`Unsupported file type: ${fileType}, trying markdown as fallback`);
                    // Try markdown as a fallback for unknown types
                    if (file.name.endsWith('.md')) {
                        console.log('FileViewer - File has .md extension, using markdown editor');
                        setFileContent(
                            <MarkdownEditor
                                file={{...file, type: 'text/markdown', contentType: 'text/markdown'}}
                                fileData={data}
                                onClose={onClose}
                                key={Date.now()} // Add key to force re-render
                            />
                        );
                    } else {
                        toast.error(`Unsupported file type: ${fileType}`);
                    }
                    break;
            }
        } catch (error) {
            console.error('File Processing Error:', error);
            toast.error('Failed to process file');
        }
    };

    // Determine if the current content is a markdown editor
    // Ensure we handle both contentType and type fields
    const isMarkdownEditor = file.type === 'text/markdown' || file.contentType === 'text/markdown';

    return (
        <div
            className={`file-viewer-modal ${isMarkdownEditor ? 'markdown-view' : ''}`}
        >
            <div className="file-viewer-content">
                <div className="file-content-wrapper">
                    {pdfError ? (
                        <div className="error-message">
                            <p>Failed to load PDF. Please ensure the file is not corrupted.</p>
                            <p>Error details: {pdfError.message}</p>
                        </div>
                    ) : (
                        fileContent
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileViewer;