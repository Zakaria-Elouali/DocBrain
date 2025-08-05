import React, { useState, useEffect } from "react";
import { Folder, File, ChevronRight, ChevronDown, Loader } from "lucide-react";
import {fetchFilesMetadataRequest, fetchFoldersRequest} from "@/store/fileManagement/action";
import { useDispatch, useSelector } from "react-redux";

// Recursive File Tree Node Component
const FileTreeChatSelection = ({ node, depth = 0, onFileSelect, selectedFileId }) => {
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoadedFiles, setHasLoadedFiles] = useState(false);

    // Select loading state from Redux store
    const { tree, loadingFiles } = useSelector((state) => state.fileFolderReducer);

    // useEffect(() => {
    //     const userId = JSON.parse(sessionStorage.getItem("authUser"))?.userId;
    //     dispatch(fetchFoldersRequest({ userId }));
    // }, [dispatch]);

    const hasFileChildren = (children = []) => {
        return children.some(child => child.type !== 'folder');
    };

    const hasSubfolders = (children = []) => {
        return children.some(child => child.type === 'folder');
    };

    useEffect(() => {
        if (isExpanded &&
            node.type === 'folder' &&
            !hasLoadedFiles &&
            (!node.children || !hasFileChildren(node.children))) {

            setIsLoading(true);
            dispatch(fetchFilesMetadataRequest({ folderId: node.id }));
        }
    }, [isExpanded, node.id, node.type, node.children, hasLoadedFiles, dispatch]);

    // Watch for changes in loadingFiles state
    useEffect(() => {
        if (!loadingFiles && isLoading) {
            setIsLoading(false);
            setHasLoadedFiles(true);
        }
    }, [loadingFiles, isLoading]);

    const toggleExpand = () => {
        if (node.type === 'folder') {
            // If folder has subfolders, toggle immediately
            if (hasSubfolders(node.children)) {
                setIsExpanded(prev => !prev);
            }
            // If folder might have files but hasn't loaded them yet
            else if (!hasLoadedFiles) {
                setIsExpanded(true); // Expand and trigger file fetch
            }
            // If folder has already loaded and has no files, just toggle
            else {
                setIsExpanded(prev => !prev);
            }
        }
    };

    const renderChildren = () => {
        if (!node.children || !isExpanded) return null;

        return node.children.map((child) =>
            child.type === "folder" ? (
                <FileTreeChatSelection
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    onFileSelect={onFileSelect}
                    selectedFileId={selectedFileId}
                />
            ) : (
                <div
                    key={child.id}
                    className={`pl-${depth * 4} flex items-center cursor-pointer p-1 px-3 hover:bg-blue-50 transition-colors duration-200 ${
                        selectedFileId === child.id ? "bg-blue-100" : ""
                    }`}
                    onClick={() => onFileSelect(child)}
                >
                    <File size={16} className="mr-2 text-blue-500" />
                    <span className="text-gray-700">{child.name}</span>
                </div>
            )
        );
    };

    if (node.type === "folder") {
        return (
            <div>
                <div
                    className={`pl-${depth * 4} flex items-center cursor-pointer p-1 hover:bg-blue-50 transition-colors duration-200 ${
                        depth === 0 ? "bg-gray-100 rounded-lg p-2" : ""
                    }`}
                    onClick={toggleExpand}
                >
                    {isExpanded ? (
                        <ChevronDown size={16} className="text-gray-600" />
                    ) : (
                        <ChevronRight size={16} className="text-gray-600" />
                    )}
                    <Folder
                        size={16}
                        className={`mr-2 ${
                            depth === 0 ? "text-purple-600" : "text-yellow-500"
                        }`}
                    />
                    <span
                        className={`${
                            depth === 0 ? "text-purple-800 font-semibold" : "text-gray-800"
                        }`}
                    >
                        {node.name}
                    </span>
                    {isLoading && (
                        <Loader className="loading-icon animate-spin ml-2" size={14} />
                    )}
                </div>
                {renderChildren()}
            </div>
        );
    }

    return null;
};

export default FileTreeChatSelection;