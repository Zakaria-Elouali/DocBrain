import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Maximize2, Minimize2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateFileContentRequest } from '@/store/fileManagement/action';

const MarkdownEditor = ({ file, fileData, onClose }) => {
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const editorRef = useRef(null);
    const dispatch = useDispatch();

    // Track if content has been modified by the user
    const [isContentModified, setIsContentModified] = useState(false);
    const lastSavedContent = useRef('');

    useEffect(() => {
        console.log('MarkdownEditor useEffect - file:', file);
        console.log('MarkdownEditor useEffect - fileData:', fileData);
        console.log('MarkdownEditor useEffect - isContentModified:', isContentModified);

        if (fileData) {
            try {
                console.log('MarkdownEditor - Attempting to decode fileData');
                // If fileData is base64 encoded, decode it
                const decodedContent = fileData.startsWith('data:')
                    ? atob(fileData.split(',')[1])
                    : atob(fileData);

                console.log('MarkdownEditor - Successfully decoded content');

                // Only update the content if:
                // 1. The user hasn't modified it yet, or
                // 2. The incoming data is different from what we last saved
                if (!isContentModified || decodedContent !== lastSavedContent.current) {
                    console.log('MarkdownEditor - Setting content with decoded data');
                    setContent(decodedContent);
                    // If this update is from a background refresh and differs from user's edits,
                    // we could show a notification here about conflicting changes
                }
            } catch (error) {
                console.error('Error decoding file data:', error);
                console.log('MarkdownEditor - Error decoding, using raw fileData');
                if (!isContentModified) {
                    setContent(fileData || '');
                }
            }
        } else {
            // If it's a new file, start with empty content
            console.log('MarkdownEditor - No fileData, setting empty content');
            if (!isContentModified) {
                setContent('');
            }
        }
    }, [fileData, isContentModified, file]);

    // Add window resize listener
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            // Clean up fullscreen mode if component unmounts while in fullscreen
            if (isFullscreen) {
                // Restore body scrolling
                document.body.style.overflow = '';

                // Restore page header visibility
                const pageTopbar = document.getElementById('page-topbar');
                if (pageTopbar) {
                    pageTopbar.style.visibility = 'visible';
                }

                // Remove fullscreen class from parent
                const parentModal = editorRef.current?.closest('.file-viewer-modal');
                if (parentModal) {
                    parentModal.classList.remove('fullscreen-mode');
                }
            }
        };
    }, [isFullscreen]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
        setIsContentModified(true);
    };

    const handleSave = () => {
        // Convert content to base64 for storage
        const base64Content = btoa(content);
        dispatch(updateFileContentRequest({
            fileId: file.id,
            content: base64Content
        }));

        // Store the last saved content for comparison with future updates
        lastSavedContent.current = content;
        setIsContentModified(false);
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const toggleFullscreen = () => {
        const newFullscreenState = !isFullscreen;
        setIsFullscreen(newFullscreenState);

        // Apply fullscreen class to parent container for better styling control
        if (editorRef.current) {
            const parentModal = editorRef.current.closest('.file-viewer-modal');
            const pageTopbar = document.getElementById('page-topbar');

            if (parentModal) {
                if (newFullscreenState) {
                    parentModal.classList.add('fullscreen-mode');
                    // Hide scrollbars on body
                    document.body.style.overflow = 'hidden';

                    // Hide the page header when in fullscreen
                    if (pageTopbar) {
                        pageTopbar.style.visibility = 'hidden';
                    }
                } else {
                    parentModal.classList.remove('fullscreen-mode');
                    document.body.style.overflow = '';

                    // Show the page header again
                    if (pageTopbar) {
                        pageTopbar.style.visibility = 'visible';
                    }
                }
            }
        }
    };

    // Determine if we should show compact UI based on screen size
    const isCompactView = windowWidth < 768;

    return (
        <div
            ref={editorRef}
            className={`markdown-editor ${isFullscreen ? 'fullscreen' : ''}`}
        >
            <div className="editor-header">
                <div className="file-info">
                    <span className="file-name">{file.name}</span>
                </div>
                <div className="editor-actions">
                    <button
                        onClick={handleSave}
                        className="action-button save-button"
                        title="Save"
                    >
                        <Save size={isCompactView ? 14 : 16} />
                    </button>
                    <button
                        onClick={toggleEditMode}
                        className="action-button toggle-button"
                        title={isEditing ? "Preview" : "Edit"}
                    >
                        {isCompactView ? (isEditing ? "P" : "E") : (isEditing ? "Preview" : "Edit")}
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="action-button fullscreen-button"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ?
                            <Minimize2 size={isCompactView ? 14 : 16} /> :
                            <Maximize2 size={isCompactView ? 14 : 16} />
                        }
                    </button>
                    <button
                        onClick={onClose}
                        className="action-button close-button"
                        title="Close"
                    >
                        <X size={isCompactView ? 14 : 16} />
                    </button>
                </div>
            </div>
            <div className="editor-content">
                {isEditing ? (
                    <textarea
                        className="markdown-textarea"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Start typing your markdown content here..."
                        autoFocus
                    />
                ) : (
                    <div className="markdown-preview">
                        {/* In a real implementation, you would use a markdown parser here */}
                        <pre>{content}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarkdownEditor;
