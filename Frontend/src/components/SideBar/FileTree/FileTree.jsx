import React, {useCallback, useEffect, useState, useRef} from 'react';
import { FileTreeItem } from './FileTreeItem';
import { SearchView } from './SearchHandel/SearchView';
import RightClickMenu from './ContextMenu/RightClickMenu';
import { Search, FolderPlus, FileText } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    addFileRequest, createFileRequest,
    addFolderRequest, deleteFileRequest, deleteFolderRequest, fetchFileDataRequest,
    fetchFoldersRequest, fetchAllFilesMetadataRequest, updateFileRequest,
    updateFolderRequest
} from "@/store/fileManagement/action";
import {useActiveOperations, useFileDownloadUpload} from "./FileService/useFileDownloadUpload";
import FileViewer from "../../FileViewer/FileViewer";

export const FileTree = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // State to track the selected file for viewing

    const dispatch = useDispatch();
    const { handleUpload, handleDownload, cancelOperation } = useFileDownloadUpload();
    const activeOperations = useActiveOperations();

    const { tree,operations, loadingFolders, loadingFiles, error, fileData } = useSelector((state) => state.fileFolderReducer);

    // State from Redux store
    // Fetch folders when component mounts
    useEffect(() => {
        dispatch(fetchFoldersRequest());
        console.log("Fetching folders...");
    }, [dispatch]);

    // Create a ref to track if we've already fetched files
    const hasInitiallyFetchedFiles = useRef(false);

    // Fetch all file metadata at once when folders are initially loaded
    useEffect(() => {
        // Only fetch files when folders are first loaded
        if (Array.isArray(tree) && tree.length > 0 && !loadingFolders && !hasInitiallyFetchedFiles.current) {
            hasInitiallyFetchedFiles.current = true;

            // Use the new endpoint to fetch all files at once
            dispatch(fetchAllFilesMetadataRequest());
            console.log("Fetching all files metadata...");
        }
    }, [dispatch, tree, loadingFolders]);

    // Track file operations to refresh files when needed
    const [lastFileOperation, setLastFileOperation] = useState(null);

    // Handle file creation or deletion
    useEffect(() => {
        // When a file is created or deleted, refresh the file list
        if (lastFileOperation === 'create' || lastFileOperation === 'delete') {
            // Reset the operation
            setLastFileOperation(null);

            // Only refresh files - we don't need to refresh folders
            // This prevents the tree from being rebuilt and losing file references
            dispatch(fetchAllFilesMetadataRequest());
        }
    }, [dispatch, lastFileOperation]);

    const handleCreateFolder = (parentId = null) => {
        const tempId = `temp-${Date.now()}`;
        const newFolder = {
            id: tempId,
            name: "New Folder",
            type: "folder",
            parentId: parentId,
            isTemporary: true,
        };
        // Add temporary folder to tree instantly
        dispatch({ type: 'ADD_TEMP_FOLDER', payload: newFolder });
        // Set folder into editing mode
        setEditingId(tempId);
    };

    const handleRenameFolder = (newName, folder) => {
        console.log("In fileTree handleRename - newName:", newName,"folderId:", folder.id, "nameType:", typeof newName);

        // If it's a temporary folder, create it in the backend
        if (String(editingId).startsWith("temp-")) {
            // const parentId = tree.find((folder) => folder.id === folderId)?.parentId || null;
            dispatch(addFolderRequest({ tempId: editingId, name: newName, parentId: folder.parentId}));
        } else {
            // Update existing folder name in the backend
            dispatch(updateFolderRequest({ folderId: folder.id, newName }));
        }
        setEditingId(null);
    };

    const handelDeleteFolder = (folderId) => {
        console.log("handelDelete:" + folderId);
        dispatch(deleteFolderRequest(folderId));
    }

   // HANDEL FILE
    const handleCreateFile = (parentId = null) => {
        const tempId = `temp-${Date.now()}`;
        const newFile = {
            id: tempId,
            name: "New Markdown.md",
            type: "file",
            contentType: "text/markdown", // Set content type for markdown
            parentId: parentId,
            isTemporary: true,
        };
        // Add temporary file to tree instantly
        dispatch({ type: 'ADD_TEMP_FILE', payload: newFile });
        // Set file into editing mode
        setEditingId(tempId);
    };

    const handleRenameFile = (newName, file = null) => {
        console.log("In handleRenameFile - newName:", newName, "fileId:", file.id, "Type:", typeof newName);

        // If it's a temporary file, create it in the backend
        if (String(editingId).startsWith("temp-")) {
            // If the name is empty or unchanged, remove the temporary file
            if (!newName.trim()) {
                // Remove the temporary file from the tree
                dispatch({
                    type: 'REMOVE_TEMP_FILE',
                    payload: { tempId: editingId }
                });
                setEditingId(null);
                return;
            }

            // For markdown files, use createFileRequest
            if (file.contentType === "text/markdown" || newName.endsWith('.md')) {
                dispatch(createFileRequest({
                    tempId: editingId,
                    name: newName,
                    parentId: file.parentId,
                    contentType: "text/markdown"
                }));

                // Mark that we've created a file
                setLastFileOperation('create');

                // We need to wait for the file to be created in the backend
                // So we'll set a timeout to open it after a short delay
                setTimeout(() => {
                    // Find the newly created file in the tree
                    const createdFile = findFileInTree(tree, editingId);
                    if (createdFile) {
                        handleFileClick(createdFile);
                    }
                }, 500);
            } else {
                // For other file types, use the existing addFileRequest
                dispatch(addFileRequest({
                    tempId: editingId,
                    name: newName,
                    parentId: file.parentId,
                    contentType: file.contentType || "text/plain"
                }));

                // Mark that we've created a file
                setLastFileOperation('create');
            }
        } else {
            // Update existing file name in the backend
            dispatch(updateFileRequest({ fileId: file.id , newName }));
        }
        setEditingId(null);
    };

    const handleDeleteFile = (fileId) => {
        console.log("handleDeleteFile:" + fileId);

        // If the file is currently selected, close the file viewer
        if (selectedFile && selectedFile.id === fileId) {
            setSelectedFile(null);
        }

        dispatch(deleteFileRequest(fileId));

        // Mark that we've deleted a file
        setLastFileOperation('delete');

        // Force refresh the file list after a short delay to ensure backend sync
        setTimeout(() => {
            dispatch(fetchAllFilesMetadataRequest());
        }, 500);
    };

    // Helper function to find a file in the tree by ID
    const findFileInTree = (tree, fileId) => {
        for (const item of tree) {
            if (item.id === fileId) {
                return item;
            }

            if (item.children && item.children.length > 0) {
                const found = findFileInTree(item.children, fileId);
                if (found) return found;
            }
        }
        return null;
    };

    const handleFileSelect = useCallback((parentId) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;

        input.onchange = async (e) => {
            const files = Array.from(e.target.files || []);

            try {
                await Promise.all(files.map(file => handleUpload(file, parentId)));
                toast.success('Files uploaded successfully');
            } catch (error) {
                toast.error('Some files failed to upload');
                console.error('Upload error:', error);
            }
        };

        input.click();
    }, [handleUpload]);

    // Handle file click (open file viewer)
    const handleFileClick = useCallback(
        (file) => {
            // Don't try to fetch data for temporary files
            if (file.isTemporary || String(file.id).startsWith('temp-')) {
                console.log('Skipping fetch for temporary file:', file.id);
                return;
            }

            console.log('FileTree handleFileClick - file:', file);

            // Check if this is an editable file type (markdown, text)
            const isEditableFile =
                file.type === 'text/markdown' ||
                file.contentType === 'text/markdown' ||
                file.type === 'text/plain' ||
                file.name.endsWith('.md') ||
                file.name.endsWith('.txt');

            console.log('FileTree handleFileClick - isEditableFile:', isEditableFile);

            // Always set the selected file first to ensure UI updates
            setSelectedFile(file);

            // Check if file data is already available
            const cachedFileData = fileData[file.id];
            console.log('FileTree handleFileClick - cachedFileData:', cachedFileData ? 'exists' : 'missing');

            if (cachedFileData) {
                // For editable files, fetch fresh data in the background
                // For static files (PDFs, images), just use the cached data
                if (isEditableFile) {
                    console.log('FileTree handleFileClick - editable file, fetching fresh data in background');
                    dispatch(fetchFileDataRequest(file.id, true));
                } else {
                    console.log('FileTree handleFileClick - static file, using cached data only');
                }
            } else {
                // If file data is not available, fetch it
                console.log('FileTree handleFileClick - no cached data, fetching now');
                dispatch(fetchFileDataRequest(file.id)); // Dispatch action to fetch file data
            }
        },
        [dispatch, fileData]
    );

    // Set up polling for file updates when a file is open
    useEffect(() => {
        let pollingInterval;

        if (selectedFile && !selectedFile.isTemporary) {
            // Check if this is an editable file type (markdown, text)
            const isEditableFile =
                selectedFile.type === 'text/markdown' ||
                selectedFile.contentType === 'text/markdown' ||
                selectedFile.type === 'text/plain' ||
                selectedFile.name.endsWith('.md') ||
                selectedFile.name.endsWith('.txt');

            console.log('Polling setup - File:', selectedFile.name, 'Editable:', isEditableFile);

            // Only set up polling for editable files
            if (isEditableFile) {
                console.log('Setting up polling for editable file:', selectedFile.name);
                // Poll for updates every 10 seconds
                pollingInterval = setInterval(() => {
                    console.log('Polling for updates to:', selectedFile.name);
                    dispatch(fetchFileDataRequest(selectedFile.id, true));
                }, 10000); // 10 seconds
            } else {
                console.log('Skipping polling for non-editable file:', selectedFile.name);
            }
        }

        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [selectedFile, dispatch]);

    // Close file viewer
    const closeFileViewer = () => {
        setSelectedFile(null);
    };

    // if (loadingFolders) return <p>Loading folders...</p>;
    // if (loadingFiles) return <p>Loading files...</p>;
    // if (error) return <p>Error: {error}</p>;

    return (
        <div className="file-tree-container">
            {isSearchActive ? (
                <SearchView onBackToTree={() => setIsSearchActive(false)} />
            ) : (
                <>
                    <div className="file-tree-header">
                        <button
                            onClick={() => setIsSearchActive(true)}
                            className="action-button"
                            title="Search"
                        >
                            <Search className="action-icon" />
                        </button>
                        <button
                            onClick={() => {handleCreateFolder()}} // Your folder creation logic
                            className="action-button"
                            title="Create Folder"
                        >
                            <FolderPlus  className="action-icon" />
                        </button>
                        <button
                            onClick={() => {handleCreateFile()}} // Your file creation logic
                            className="action-button"
                            title="Create File"
                        >
                            <FileText className="action-icon" />
                        </button>
                    </div>

                    <div className="file-tree-content">
                        {Array.isArray(tree) && tree.length > 0 ? (
                        tree.map((item) => (
                            <FileTreeItem
                                key={item.id}
                                item={item}
                                isFolderCreating={editingId === item.id || item.isTemporary}
                                onRenameFolder={(newName, folder) => handleRenameFolder(newName, folder)}
                                onRenameFile={(newName, file) => handleRenameFile(newName, file)}
                                onCreateFolder={handleCreateFolder}
                                onCreateFile={handleCreateFile}
                                onDeleteFolder={handelDeleteFolder}
                                onDeleteFile={handleDeleteFile}
                                //new
                                progress={operations[item.id]?.progress}
                                status={operations[item.id]?.status}
                                isUploading={activeOperations.has(item.id)}
                                onUpload={() => handleFileSelect(item.id)}
                                onDownload={() => handleDownload(item.id, item.name)}
                                onCancel={() => cancelOperation(item.id)}
                                onFileClick={handleFileClick} // Pass file click handler
                            />
                        ))
                        ) : (
                            <p>No folders available</p>
                        )}
                    </div>
                    <RightClickMenu/>

                    {/* Render FileViewer if a file is selected */}
                    {selectedFile && (
                        <FileViewer
                            file={selectedFile} // Pass the entire file object
                            fileData={fileData[selectedFile.id]} // Pass file content
                            onClose={closeFileViewer}
                            isSidebarOpen={false} // Pass close handler and FileTree state
                            key={selectedFile.id} // Add key to force re-render when file changes
                        />
                    )}

                </>
            )}
        </div>
    );
};

