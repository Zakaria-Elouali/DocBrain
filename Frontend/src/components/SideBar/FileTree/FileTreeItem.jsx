import React, {useEffect, useRef, useState} from 'react';
import { ChevronDown, ChevronRight, Folder, FileText,Loader } from 'lucide-react';
import {fetchFilesMetadataRequest} from "@/store/fileManagement/action";
import {useDispatch, useSelector} from "react-redux";
import {useRightClick} from "./ContextMenu/useRightClick";
import {toast} from "react-toastify";

export const FileTreeItem = ({ item, depth = 0, onRenameFolder, onRenameFile, onDeleteFolder, onDeleteFile, onCreateFolder, isFolderCreating,
                                 onUpload, onDownload, progress, onCancel, isUploading, status, onFileClick}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoadedFiles, setHasLoadedFiles] = useState(false);
    const [newName, setNewName] = useState(item.name);
    const dispatch = useDispatch();
    const { handleContextMenu } = useRightClick(); //handel the contextMenu for rightclickMenu
    const [isEditing, setIsEditing] = useState(isFolderCreating); // Local editing state


    // Select loading state from Redux store
    const { loadingFiles } = useSelector((state) => state.fileFolderReducer);

    const hasFileChildren = (children = []) => {
        return children.some(child => child.type !== 'folder');
    };

    const hasSubfolders = (children = []) => {
        return children.some(child => child.type === 'folder');
    };

    // We're now fetching all files when the component mounts,
    // so we don't need to fetch files when toggling a folder
    useEffect(() => {
        if (isExpanded && item.type === 'folder') {
            // Just mark as loaded without fetching
            setHasLoadedFiles(true);
        }
    }, [isExpanded, item.type]);

    // Watch for changes in loadingFiles state
    useEffect(() => {
        if (!loadingFiles && isLoading) {
            setIsLoading(false);
            setHasLoadedFiles(true);
        }
    }, [loadingFiles, isLoading]);

    const handleToggle = (e) => {
        e.stopPropagation();

        if (item.type === 'folder') {
            // Simply toggle the folder expansion state
            setIsExpanded(prev => !prev);
        } else {
            // Don't try to open temporary files
            if (item.isTemporary || String(item.id).startsWith('temp-')) {
                return;
            }
            onFileClick(item);
        }
    };

    // Set editing state when folder is temporary
    useEffect(() => {
        if (item.isTemporary) {
            setIsEditing(true);
        }
    }, [item.isTemporary]);

    useEffect(() => {
        if (item.children?.some(child => child.isTemporary)) {
            setIsExpanded(true);
        }
    }, [item.children]);

    const inputRef = useRef(null);
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select(); // Select text only once when input is mounted
        }
    }, [isEditing, isFolderCreating]);

    // Handle right-click to show the context menu
    const handleRightClick = (e) => {
        handleContextMenu(e, {
            ...item,
            onDownload: () => onDownload(item.id),
            onUpload: () => onUpload(item.id),
            onRename: () => setIsEditing(true), // Set editing state instead of calling onRename
            onDelete: () => {
                item.type === 'folder'
                    ? onDeleteFolder(item.id)  // calls handleDeleteFolder
                    : onDeleteFile(item.id)  // calls handleDeleteFile
            },
            onCreateFolder: () => onCreateFolder(item.id),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling

        if (newName.trim()) {
            if (item.type === 'folder') {
                onRenameFolder(newName, item);
            } else {
                onRenameFile(newName, item);
            }
        } else {
            toast.error(`${item.type === 'folder' ? 'Folder' : 'File'} name cannot be empty`);
        }
        setIsEditing(false);
    };

    const handleBlur = (e) => {
        e.stopPropagation(); // Prevent event bubbling

        if (newName.trim() && newName !== item.name) {
            if (item.type === 'folder') {
                onRenameFolder(newName, item);
            } else {
                onRenameFile(newName, item);
            }
        } else if (!newName.trim()) {
            toast.error(`${item.type === 'folder' ? 'Folder' : 'File'} name cannot be empty`);
        }
        setIsEditing(false);
    };

    return (
        <div className="tree-item">
            <div
                onContextMenu={handleRightClick}
                className="tree-item-content"
                style={{paddingLeft: `${depth * 12 + 8}px`}}
                onClick={handleToggle}
            >
                {item.type === 'folder' && (
                    <span className={`tree-item-icon ${isExpanded ? 'expanded' : ''}`}>
                        {isExpanded ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                    </span>
                )}
                <span className="tree-item-icon-wrapper">
                  {item.type === 'folder' ? (
                      <Folder className="tree-item-icon folder" size={16} />
                  ) : (
                      <FileText className="tree-item-icon file" size={16} />
                  )}
                </span>
                {isEditing ? (
                    <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            className="folder-name-input"
                            value={newName}
                            onChange={(e) => {
                                e.stopPropagation();
                                setNewName(e.target.value);
                            }}
                            onBlur={handleBlur}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            ref={inputRef}
                        />
                    </form>
                    ) : (   <span className="tree-item-label">{item.name}</span>    )}
                {isLoading && (
                    <Loader className="loading-icon animate-spin ml-2" size={14} />
                )}
            </div>

            {item.children && Array.isArray(item.children) && item.children.length > 0 && (
            isExpanded && item.children?.map(child => (
                <FileTreeItem
                    key={child.id}
                    item={child}
                    depth={depth + 1}
                    onRenameFolder={(newName) => onRenameFolder(newName, child)}
                    onRenameFile={(newName) => onRenameFile(newName, child)}
                    onDeleteFolder={onDeleteFolder}
                    onDeleteFile={onDeleteFile}
                    onCreateFolder={onCreateFolder}
                    isFolderCreating={isFolderCreating}
                    //new
                    status={status}
                    isUploading={isUploading}
                    onUpload={() => onUpload(child.id)}
                    onDownload={() => onDownload(child.id, child.name)}
                    onCancel={() => onCancel(child.id)}
                    onFileClick={onFileClick}
                />
            )))
            }
        </div>
    );
};
